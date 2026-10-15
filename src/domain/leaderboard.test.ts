import { describe, expect, it } from 'vitest';
import { themes } from '../content';
import { summarizeVisit } from './visit';
import type { Answers } from './quiz';
import { BrowserLeaderboardRepository, LEADERBOARD_KEY, MAX_ENTRIES, normalizeDisplayName, rankEntries, type LeaderboardEntry } from '../services/leaderboard';
const id = '123e4567-e89b-42d3-a456-426614174000';
const otherId = '123e4567-e89b-42d3-a456-426614174001';
const date = () => new Date('2026-10-15T15:00:00.000Z');
const perfect = () => Object.fromEntries(themes.map(t => [t.id, Object.fromEntries(t.quiz.map(q => [q.id, q.correctIndex]))]));
const partial = () => ({ [themes[0].id]: { [themes[0].quiz[0].id]: themes[0].quiz[0].correctIndex } });
function memoryStorage() {
  const data = new Map<string, string>();
  return { data, getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
}
describe('total de acertos por visita', () => {
  it('soma 18 perguntas únicas dos seis temas', () => { expect(summarizeVisit(perfect())).toEqual({ correct: 18, answered: 18, total: 18, completedThemes: 6 }); });
  it('aceita visita parcial e ignora chaves inventadas e alternativas inválidas', () => {
    const answers: Record<string, Answers> = { ...partial(), extra: { invented: 0 } };
    answers[themes[1].id] = { [themes[1].quiz[0].id]: 99, [themes[1].quiz[1].id]: -1, [themes[1].quiz[2].id]: 0.5 };
    expect(summarizeVisit(answers)).toEqual({ correct: 1, answered: 1, total: 18, completedThemes: 0 });
  });
  it('refazer substitui as respostas sem acumular tentativas', () => { const answers = perfect(); answers[themes[0].id] = Object.fromEntries(themes[0].quiz.map(q => [q.id, (q.correctIndex + 1) % 4])); expect(summarizeVisit(answers)).toMatchObject({ correct: 15, answered: 18 }); });
  it('uma visita vazia tem zero acertos e nenhuma resposta', () => { expect(summarizeVisit({})).toMatchObject({ correct: 0, answered: 0, completedThemes: 0 }); });
});
describe('persistência do ranking do totem', () => {
  it('salva nome e total real e preserva após nova instância', () => {
    const storage = memoryStorage(); const repo = new BrowserLeaderboardRepository(() => storage, date);
    const saved = repo.save(id, '  José   do Sol ', perfect()); expect(saved.ok).toBe(true);
    const state = new BrowserLeaderboardRepository(() => storage, date).load();
    expect(state.status).toBe('ok'); expect(state.entries).toHaveLength(1); expect(state.entries[0]).toMatchObject({ displayName: 'José do Sol', correct: 18, answered: 18, total: 18 });
  });
  it('não duplica nem altera uma visita já registrada', () => {
    const storage = memoryStorage(); const repo = new BrowserLeaderboardRepository(() => storage, date);
    repo.save(id, 'Ana', partial()); const result = repo.save(id, 'Outro nome', perfect());
    expect(result).toMatchObject({ ok: true, alreadySaved: true }); expect(repo.load().entries).toHaveLength(1); expect(repo.load().entries[0]).toMatchObject({ displayName: 'Ana', correct: 1 });
  });
  it('permite duas pessoas com o mesmo primeiro nome em visitas distintas', () => { const storage = memoryStorage(); const repo = new BrowserLeaderboardRepository(() => storage, date); repo.save(id, 'Ana', partial()); repo.save(otherId, 'Ana', perfect()); expect(repo.load().entries).toHaveLength(2); });
  it('não salva nomes vazios, grandes, marcação ou visita sem respostas', () => {
    const storage = memoryStorage(); const repo = new BrowserLeaderboardRepository(() => storage, date);
    for (const name of ['', 'A', 'x'.repeat(25), '<script>alert(1)</script>', 'João\u0000']) expect(repo.save(id, name, perfect())).toMatchObject({ ok: false, error: 'name' });
    expect(repo.save(id, 'Ana', {})).toEqual({ ok: false, error: 'empty' }); expect(repo.save('fake', 'Ana', partial())).toEqual({ ok: false, error: 'visit' }); expect(repo.load().entries).toHaveLength(0);
  });
  it('trata bloqueio de leitura e falta de espaço sem prometer gravação', () => {
    const blocked = new BrowserLeaderboardRepository(() => { throw new Error('blocked'); });
    expect(blocked.load().status).toBe('unavailable'); expect(blocked.save(id, 'Ana', partial())).toEqual({ ok: false, error: 'storage' }); expect(blocked.clear()).toBe(false);
    const storage = memoryStorage(); const full = new BrowserLeaderboardRepository(() => ({ ...storage, setItem: () => { throw new Error('quota'); } }), date);
    expect(full.save(id, 'Ana', partial())).toEqual({ ok: false, error: 'storage' }); expect(full.load().entries).toHaveLength(0);
  });
  it('não apaga nem sobrescreve dados corrompidos silenciosamente', () => { const storage = memoryStorage(); storage.setItem(LEADERBOARD_KEY, '{broken'); const repo = new BrowserLeaderboardRepository(() => storage, date); expect(repo.load().status).toBe('corrupt'); expect(repo.save(id, 'Ana', partial())).toEqual({ ok: false, error: 'corrupt' }); expect(storage.getItem(LEADERBOARD_KEY)).toBe('{broken'); });
  it('limpa só o ranking, preservando as preferências do museu', () => { const storage = memoryStorage(); storage.setItem('flic-motion', 'reduced'); const repo = new BrowserLeaderboardRepository(() => storage, date); repo.save(id, 'Ana', partial()); expect(repo.clear()).toBe(true); expect(repo.load().entries).toHaveLength(0); expect(storage.getItem('flic-motion')).toBe('reduced'); });
  it('mantém as mil visitas mais recentes, sem perder a nova inscrição', () => {
    const storage = memoryStorage(); const entries = Array.from({ length: MAX_ENTRIES }, (_, i) => ({ id: `123e4567-e89b-42d3-a456-${String(i).padStart(12, '0')}`, displayName: 'Visitante', correct: 1, answered: 1, total: 18, completedThemes: 0, createdAt: date().toISOString() }));
    storage.setItem(LEADERBOARD_KEY, JSON.stringify({ version: 1, entries })); const repo = new BrowserLeaderboardRepository(() => storage, date);
    expect(repo.save(id, 'Ana', perfect()).ok).toBe(true); expect(repo.load().entries).toHaveLength(MAX_ENTRIES); expect(repo.load().entries[0].id).toBe(entries[1].id); expect(repo.load().entries.at(-1)?.displayName).toBe('Ana');
  });
});
describe('ordenação e nomes', () => {
  it('ordena por acertos e respostas, compartilhando posições em empates', () => {
    const base: LeaderboardEntry = { id, displayName: 'Ana', correct: 2, answered: 3, total: 18, completedThemes: 1, createdAt: date().toISOString() };
    const entries = [base, { ...base, id: otherId }, { ...base, id: '123e4567-e89b-42d3-a456-426614174002', correct: 1 }, { ...base, id: '123e4567-e89b-42d3-a456-426614174003', correct: 2, answered: 6 }];
    const ranked = rankEntries(entries); expect(ranked.map(e => e.rank)).toEqual([1, 2, 2, 4]); expect(ranked.map(e => e.answered)).toEqual([6, 3, 3, 3]); expect(entries[0]).not.toHaveProperty('rank');
  });
  it('preserva acentos e normaliza espaços sem criar identificadores pessoais', () => { expect(normalizeDisplayName('  Jose\u0301   Sol  ')).toBe('José Sol'); });
});