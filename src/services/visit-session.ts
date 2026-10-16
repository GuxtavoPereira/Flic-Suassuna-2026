import { z } from 'zod';
import { themes } from '../content';
import { createRound, remember, type RecentContent, type Rounds } from '../domain/rotation';
export const SESSION_KEY = 'flic-visit-v2';
export const HISTORY_KEY = 'flic-recent-content-v2';
const ids = z.array(z.string()).max(120);
const recentSchema = z.object({ posts: ids, questions: ids });
export function loadRecent(): RecentContent {
  try { const parsed = recentSchema.safeParse(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? 'null')); if (parsed.success) return parsed.data; } catch { /* The museum also works with blocked storage. */ }
  return { posts: [], questions: [] };
}
export function recordRecent(posts: string[], questions: string[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(remember(loadRecent(), posts, questions))); } catch { /* History is optional; never block a visit. */ }
}
export interface VisitSession { positions: Record<string, number>; answers: Record<string, Record<string, number>>; visitId: string; rounds: Rounds }
export function createSession(): VisitSession {
  const history = loadRecent();
  return { positions: {}, answers: {}, visitId: crypto.randomUUID(), rounds: Object.fromEntries(themes.map(t => [t.id, createRound(t, history)])) };
}
const answersSchema = z.record(z.string(), z.number().int().min(0).max(3));
const roundSchema = z.object({ postIds: z.array(z.string()).length(5), seenPostIds: z.array(z.string()).max(5), questions: z.array(z.object({ id: z.string(), optionOrder: z.array(z.number().int().min(0).max(3)).length(4) })).length(3), practice: z.boolean(), rankingAnswers: answersSchema.optional() });
const sessionSchema = z.object({ version: z.literal(2), visitId: z.string().uuid(), positions: z.record(z.string(), z.number().int().min(0).max(4)), answers: z.record(z.string(), answersSchema), rounds: z.record(z.string(), roundSchema) });
export function loadSession(): VisitSession {
  try {
    const parsed = sessionSchema.safeParse(JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null'));
    if (parsed.success) {
      const rounds: Rounds = {};
      for (const theme of themes) {
        const r = parsed.data.rounds[theme.id];
        if (!r || new Set(r.postIds).size !== 5 || r.postIds.some(id => !theme.postPool.some(p => p.id === id)) || r.seenPostIds.some(id => !r.postIds.includes(id))) return createSession();
        const questions = r.questions.map(saved => {
          const q = theme.questionPool.find(q => q.id === saved.id);
          if (!q || new Set(saved.optionOrder).size !== 4 || !q.postIds?.some(id => r.postIds.includes(id))) throw new Error('Stale session');
          return { ...q, options: saved.optionOrder.map(i => q.options[i]), correctIndex: saved.optionOrder.indexOf(q.correctIndex), optionOrder: saved.optionOrder };
        });
        if (new Set(questions.map(q => q.id)).size !== 3 || new Set(questions.map(q => q.difficulty)).size !== 3) return createSession();
        rounds[theme.id] = { ...r, questions };
      }
      return { visitId: parsed.data.visitId, positions: parsed.data.positions, answers: parsed.data.answers, rounds };
    }
  } catch { /* Stale/inaccessible sessions start a new visit; saved rankings are untouched. */ }
  return createSession();
}
export function persistSession(session: VisitSession) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, version: 2, rounds: Object.fromEntries(Object.entries(session.rounds).map(([id, round]) => [id, { ...round, questions: round.questions.map(q => ({ id: q.id, optionOrder: q.optionOrder ?? [0, 1, 2, 3] })) }])) })); } catch { /* Continue in memory. */ }
}
