import { describe, expect, it } from 'vitest';
import raw from '../content/modules.json';
import { themes, literature, findTheme } from '../content';
import { allowedQuote, contentSchema, slideIndex } from './content';
import { answerQuestion, quizScore } from './quiz';
import { LocalScoreRepository } from '../services/scores';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
describe('contrato do pacote editorial', () => {
  it('conserva os seis temas, 30 slides e 18 questões do JSON', () => { expect(themes).toHaveLength(8); expect(themes.flatMap(t => t.slides)).toHaveLength(30); expect(themes.flatMap(t => t.quiz)).toHaveLength(18); for (const [i, t] of themes.filter(t=>t.quizEnabled).entries()) { expect(t.title).toBe(raw.modules[i].title); expect(t.slides.map(s => s.body)).toEqual(raw.modules[i].slides.map(s => s.body)); expect(existsSync(`public${t.cover}`)).toBe(true); } });
  it('rejeita índices de resposta inválidos e IDs repetidos', () => { const invalid = structuredClone(raw); invalid.modules[0].quiz[0].correctIndex = 8; expect(contentSchema.safeParse(invalid).success).toBe(false); const duplicate = structuredClone(raw); duplicate.modules[0].slides[1].id = duplicate.modules[0].slides[0].id; expect(contentSchema.safeParse(duplicate).success).toBe(false); });
  it('aceita os aliases documentados sem duplicar módulos', () => { expect(findTheme('clima')).toBe(findTheme('clima-vegetacao')); expect(findTheme('ariano-vida-obras')?.id).toBe('ariano'); expect(findTheme('não-existe')).toBeUndefined(); });
});
describe('motor do quiz', () => {
  for (const theme of themes.filter(t=>t.quizEnabled)) {
    it(`pontua as três questões de ${theme.id}, bloqueando resposta duplicada`, () => { let answers = {}; for (const q of theme.quiz) { answers = answerQuestion(answers, q, q.correctIndex); expect(answerQuestion(answers, q, (q.correctIndex + 1) % 4)).toBe(answers); } expect(quizScore(theme.quiz, answers)).toEqual({ correct: 3, answered: 3, total: 3, points: 300, complete: true }); });
  }
  it('não premia resposta incorreta, inválida ou incompleta', () => { const q = themes[0].quiz[0]; expect(answerQuestion({}, q, 8)).toEqual({}); expect(answerQuestion({}, q, -1)).toEqual({}); expect(answerQuestion({}, q, 1.5)).toEqual({}); expect(quizScore(themes[0].quiz, { [q.id]: 1 })).toMatchObject({ points: 0, correct: 0, complete: false, answered: 1 }); });
  it('mantém pontuações isoladas e permite limpar a visita', () => { const repo = new LocalScoreRepository(); repo.save({ themeId: 'cultura', correct: 2, points: 200, total: 3 }); expect(repo.get('cultura')?.points).toBe(200); expect(repo.get('ariano')).toBeUndefined(); repo.clear(); expect(repo.get('cultura')).toBeUndefined(); });
});
describe('publicação literária', () => {
  it('oculta todos os trechos pendentes do pacote', () => { for (const panel of literature) expect(allowedQuote(panel)).toBeUndefined(); });
  it('exige aprovação explícita, revisão, edição, página, autorização e fonte', () => { const approved = { ...literature[0], permissionStatus: 'approved' as const, editorialVerified: true, quoteText: 'Trecho de teste', edition: 'Edição conferida', page: '12', authorization: 'Autorização conferida' }; expect(allowedQuote(approved)).toBe('Trecho de teste'); for (const key of ['edition', 'page', 'authorization', 'editorialVerified', 'quoteText'] as const) expect(allowedQuote({ ...approved, [key]: undefined })).toBeUndefined(); expect(allowedQuote({ ...approved, sources: [] })).toBeUndefined(); expect(allowedQuote({ ...approved, permissionStatus: 'rejected' })).toBeUndefined(); });
});
describe('navegação', () => { it('não ultrapassa os limites dos cinco slides', () => { expect(slideIndex(0, -1, 5)).toBe(0); expect(slideIndex(4, 1, 5)).toBe(4); expect(slideIndex(0, 1, 5)).toBe(1); }); });
describe('bundle publicado', () => {
  it('inclui todas as xilogravuras e não expõe citação pendente', () => { if (!existsSync('dist')) return; const sw = readFileSync('dist/sw.js', 'utf8'); for (const t of themes) expect(sw).toContain(t.cover.slice(1)); const js = readdirSync('dist/assets').filter(n => n.endsWith('.js')).map(n => readFileSync(`dist/assets/${n}`, 'utf8')).join(''); expect(js).not.toContain('Não sei, só sei que foi assim.'); expect(sw).toContain('index.html'); });
});