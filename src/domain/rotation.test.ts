import { describe, expect, it, vi, afterEach } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { imageAssets, suppliedAssets, themes } from '../content';
import pool from '../content/pools.json';
import { poolSchema } from '../content/pool-schema';
import { createRound, remember, roundReady, selectQuestions, shuffleQuestion, shuffled } from './rotation';
import { answerQuestion, quizScore } from './quiz';
import { summarizeVisit } from './visit';
import { createSession, loadSession, persistSession, SESSION_KEY } from '../services/visit-session';
import { BrowserLeaderboardRepository, LEADERBOARD_KEY } from '../services/leaderboard';
function seeded(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
function storage() { const map = new Map<string, string>(); return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); } }; }
afterEach(() => vi.unstubAllGlobals());
describe('pools e imagens por assunto', () => {
  it('valida 72+ posts e 102 perguntas, sem órfãos nem alternativas repetidas', () => {
    expect(poolSchema.safeParse(pool).success).toBe(true); expect(pool.posts.length).toBeGreaterThanOrEqual(72); expect(pool.questions).toHaveLength(102);
    const invalid = structuredClone(pool); invalid.questions[0].topicId = 'inexistente'; expect(poolSchema.safeParse(invalid).success).toBe(false);
    const duplicate = structuredClone(pool); duplicate.questions[0].options[1] = duplicate.questions[0].options[0]; expect(poolSchema.safeParse(duplicate).success).toBe(false);
  });
  it('todos os posts têm imagem local, texto alternativo, fonte e licença', () => {
    for (const p of themes.flatMap(t => t.postPool)) { expect(existsSync(`public${p.image}`), p.id).toBe(true); expect(p.alt.length).toBeGreaterThan(20); expect(p.sourceMetadata.sourceUrl).toMatch(/^(https:\/\/|\/images\/fornecidas\/)/); expect(p.sourceMetadata.licenseNote).not.toBe(''); expect(p.text).toBe(p.body); }
    for (const a of imageAssets) expect(existsSync(`public${a.image}`)).toBe(true);
  });
  it('preserva procedência das artes, sem usá-las como registro factual', () => {
    expect(suppliedAssets).toHaveLength(14);
    for (const a of suppliedAssets) {
      const post = themes.flatMap(t => t.postPool).find(p => p.id === a.postId);
      expect(post?.image).not.toBe(a.image); expect(a.assetType).toBe('ilustração gerada por IA');
      expect(a.credit).toContain('gerada por IA'); expect(a.sourceUrl).toContain(`/lote-${a.batch}/creditos.html#${a.postId}`);
      expect(existsSync(`public${a.sourceUrl.split('#')[0]}`)).toBe(true);
    }
  });
  it('inclui todas as fotos no cache do build', () => { if (!existsSync('dist/sw.js')) return; const sw = readFileSync('dist/sw.js', 'utf8'); for (const a of imageAssets) expect(sw).toContain(a.image.slice(1)); });
});
describe('seleção com histórico e dificuldade equilibrada', () => {
  for (const theme of themes) it(`${theme.id}: 200 sorteios válidos, três níveis e só assuntos dos posts vistos`, () => {
    for (let seed = 1; seed <= 200; seed++) {
      const round = createRound(theme, { posts: [], questions: [] }, false, seeded(seed));
      expect(round.postIds).toHaveLength(theme.postsPerVisit); expect(new Set(round.postIds).size).toBe(theme.postsPerVisit); expect(round.questions).toHaveLength(theme.quizEnabled ? 3 : 0);
      const posts = round.postIds.map(id => theme.postPool.find(p => p.id === id)!);
      expect(posts.length).toBeGreaterThanOrEqual(8); expect(posts.some(p => p.introductory)).toBe(true);
      expect([...round.questions.map(q => q.difficulty)].sort()).toEqual(theme.quizEnabled ? [1,2,3] : []); expect(new Set(round.questions.map(q => q.id)).size).toBe(theme.quizEnabled ? 3 : 0);
      for (const q of round.questions) { expect(posts.some(p => p.topicId === q.topicId)).toBe(true); expect(q.postIds?.some(id => round.postIds.includes(id))).toBe(true); }
      expect(roundReady(round)).toBe(false); expect(roundReady({ ...round, seenPostIds: round.postIds })).toBe(theme.quizEnabled);
    }
  });
  it('prioriza posts e questões não recentes e faz fallback finito quando todos são recentes', () => {
    const theme = themes[0]; const a = createRound(theme, { posts: [], questions: [] }, false, seeded(1));
    const b = createRound(theme, { posts: a.postIds, questions: a.questions.map(q => q.id) }, false, seeded(1));
    expect(b.postIds).not.toEqual(a.postIds); expect(b.questions.map(q => q.id)).not.toEqual(a.questions.map(q => q.id));
    expect(createRound(theme, { posts: theme.postPool.map(p => p.id), questions: theme.questionPool.map(q => q.id) }).questions).toHaveLength(3);
  });
  it('nunca completa com questões de assuntos ausentes ou nível diferente', () => {
    expect(selectQuestions(themes[0].questionPool, [], [])).toEqual([]);
    expect(selectQuestions(themes[0].questionPool.filter(q => q.difficulty !== 3), themes[0].postPool)).toEqual([]);
  });
  it('limita histórico, remove duplicatas e não altera o pool original', () => {
    const h = remember({ posts: Array.from({ length: 120 }, (_, i) => String(i)), questions: ['a','b'] }, ['0','novo'], ['a']);
    expect(h.posts).toHaveLength(120); expect(h.posts.at(-1)).toBe('novo'); expect(h.questions).toEqual(['b','a']);
    const arr=[1,2,3,4]; shuffled(arr, seeded(1)); expect(arr).toEqual([1,2,3,4]);
  });
  it('mantém a resposta correta após 100 embaralhamentos e persiste o índice canônico', () => {
    const original = themes[0].questionPool[0];
    for (let i=0;i<100;i++) { const q=shuffleQuestion(original,seeded(i)); expect(q.options[q.correctIndex]).toBe(original.options[original.correctIndex]); const answers=answerQuestion({},q,q.correctIndex); expect(answers[q.id]).toBe(original.correctIndex); expect(quizScore([q],answers).correct).toBe(1); }
  });
});
describe('sessão, retomada e ranking comparável', () => {
  it('retoma os mesmos posts, ordem das alternativas e respostas depois de recarregar', () => {
    vi.stubGlobal('localStorage', storage()); vi.stubGlobal('sessionStorage', storage());
    const session = createSession(); session.positions.cultura=2; const q=session.rounds.cultura.questions[0]; session.answers.cultura=answerQuestion({},q,q.correctIndex); persistSession(session);
    expect(loadSession()).toEqual(session);
    sessionStorage.setItem(SESSION_KEY, '{broken'); expect(loadSession().visitId).not.toBe(session.visitId);
  });
  it('sem armazenamento, a visita continua em memória', () => {
    vi.stubGlobal('localStorage', { getItem(){ throw new Error('blocked'); } }); vi.stubGlobal('sessionStorage', { getItem(){ throw new Error('blocked'); }, setItem(){ throw new Error('quota'); } });
    const session=loadSession(); expect(Object.keys(session.rounds)).toHaveLength(8); expect(() => persistSession(session)).not.toThrow();
  });
  it('conta somente rodadas concluídas e mantém a primeira pontuação durante treino', () => {
    vi.stubGlobal('localStorage', storage()); const s=createSession(); const r=s.rounds.cultura; const answers=Object.fromEntries(r.questions.map(q=>[q.id,q.optionOrder![q.correctIndex]]));
    expect(summarizeVisit({ cultura: answers },s.rounds).answered).toBe(0);
    r.rankingAnswers=answers; expect(summarizeVisit({},s.rounds)).toMatchObject({ correct:3,answered:3,completedThemes:1 });
    const practice=createRound(themes[1],{posts:r.postIds,questions:r.questions.map(q=>q.id)},true); s.rounds.cultura={...practice,rankingAnswers:answers};
    expect(summarizeVisit({cultura:{}},s.rounds)).toMatchObject({correct:3,answered:3,completedThemes:1});
    const repo=new BrowserLeaderboardRepository(()=>storage()); expect(repo.save(s.visitId,'Teste',{},s.rounds)).toMatchObject({ok:true,entry:{rulesVersion:2,correct:3,answered:3}});
  });
  it('preserva registros antigos como edição anterior e não os sobrescreve na leitura', () => {
    const store=storage(); const legacy={id:'123e4567-e89b-42d3-a456-426614174000',displayName:'Ana',correct:1,answered:1,total:18,completedThemes:0,createdAt:'2026-10-15T15:00:00.000Z'};
    const raw=JSON.stringify({version:1,entries:[legacy]});store.setItem(LEADERBOARD_KEY,raw);expect(new BrowserLeaderboardRepository(()=>store).load().entries).toEqual([legacy]);expect(store.getItem(LEADERBOARD_KEY)).toBe(raw);
  });
});
