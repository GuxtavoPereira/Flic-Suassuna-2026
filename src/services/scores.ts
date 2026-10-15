export interface Score { themeId: string; correct: number; total: number; points: number }
export interface ScoreRepository { save(score: Score): void; get(themeId: string): Score | undefined; clear(): void }
// Session-only anonymous scores: no names, identifiers, analytics or remote requests.
export class LocalScoreRepository implements ScoreRepository {
  private scores = new Map<string, Score>();
  save(score: Score) { this.scores.set(score.themeId, score); }
  get(themeId: string) { return this.scores.get(themeId); }
  clear() { this.scores.clear(); }
}
export const scoreRepository: ScoreRepository = new LocalScoreRepository();