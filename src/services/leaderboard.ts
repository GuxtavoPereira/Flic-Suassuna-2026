import { z } from 'zod';
import { summarizeVisit, type VisitSummary } from '../domain/visit';
import type { Answers } from '../domain/quiz';
export const LEADERBOARD_KEY = 'flic-leaderboard-v1';
export const LEADERBOARD_EVENT = 'flic-leaderboard-change';
export const MAX_ENTRIES = 1000;
const displayNameSchema = z.string().trim().min(2).max(24).regex(/^[\p{L}\p{N}][\p{L}\p{N} .’'-]*$/u);
const entrySchema = z.object({
  id: z.string().uuid(), displayName: displayNameSchema, correct: z.number().int().min(0).max(18),
  answered: z.number().int().min(1).max(18), total: z.literal(18), completedThemes: z.number().int().min(0).max(6),
  createdAt: z.string().datetime(),
}).strict().refine(e => e.correct <= e.answered && e.completedThemes * 3 <= e.answered);
const dataSchema = z.object({ version: z.literal(1), entries: z.array(entrySchema).max(MAX_ENTRIES) }).strict();
export type LeaderboardEntry = z.infer<typeof entrySchema>;
export type RankedEntry = LeaderboardEntry & { rank: number };
export type LeaderboardState = { status: 'ok'; entries: LeaderboardEntry[] } | { status: 'unavailable' | 'corrupt'; entries: LeaderboardEntry[] };
export type SaveResult = { ok: true; entry: LeaderboardEntry; alreadySaved: boolean } | { ok: false; error: 'name' | 'empty' | 'storage' | 'corrupt' | 'visit' };
interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export function normalizeDisplayName(value: string) { return value.normalize('NFC').replace(/\s+/g, ' ').trim(); }
export function rankEntries(entries: LeaderboardEntry[]): RankedEntry[] {
  const sorted = [...entries].sort((a, b) => b.correct - a.correct || b.answered - a.answered || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  return sorted.reduce<RankedEntry[]>((rows, entry, index) => {
    const previous = rows[index - 1];
    rows.push({ ...entry, rank: previous && previous.correct === entry.correct && previous.answered === entry.answered ? previous.rank : index + 1 });
    return rows;
  }, []);
}
export interface LeaderboardRepository {
  load(): LeaderboardState;
  save(visitId: string, name: string, answers: Record<string, Answers>): SaveResult;
  clear(): boolean;
}
export class BrowserLeaderboardRepository implements LeaderboardRepository {
  constructor(private readonly getStorage: () => StorageLike = () => window.localStorage, private readonly now: () => Date = () => new Date()) {}
  load(): LeaderboardState {
    let raw: string | null;
    try { raw = this.getStorage().getItem(LEADERBOARD_KEY); } catch { return { status: 'unavailable', entries: [] }; }
    if (raw === null) return { status: 'ok', entries: [] };
    try { const data = dataSchema.safeParse(JSON.parse(raw)); return data.success ? { status: 'ok', entries: data.data.entries } : { status: 'corrupt', entries: [] }; }
    catch { return { status: 'corrupt', entries: [] }; }
  }
  save(visitId: string, name: string, answers: Record<string, Answers>): SaveResult {
    const stored = this.load();
    if (stored.status !== 'ok') return { ok: false, error: stored.status === 'corrupt' ? 'corrupt' : 'storage' };
    const existing = stored.entries.find(entry => entry.id === visitId);
    if (existing) return { ok: true, entry: existing, alreadySaved: true };
    const displayName = normalizeDisplayName(name);
    if (!displayNameSchema.safeParse(displayName).success) return { ok: false, error: 'name' };
    const summary: VisitSummary = summarizeVisit(answers);
    if (!summary.answered) return { ok: false, error: 'empty' };
    const parsed = entrySchema.safeParse({ id: visitId, displayName, ...summary, createdAt: this.now().toISOString() });
    if (!parsed.success) return { ok: false, error: 'visit' };
    const entries = [...stored.entries, parsed.data].slice(-MAX_ENTRIES);
    try { this.getStorage().setItem(LEADERBOARD_KEY, JSON.stringify({ version: 1, entries })); }
    catch { return { ok: false, error: 'storage' }; }
    return { ok: true, entry: parsed.data, alreadySaved: false };
  }
  clear() { try { this.getStorage().removeItem(LEADERBOARD_KEY); return true; } catch { return false; } }
}
export const leaderboardRepository: LeaderboardRepository = new BrowserLeaderboardRepository();