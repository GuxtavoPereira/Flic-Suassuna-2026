import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Answers } from './domain/quiz';
import { quizScore } from './domain/quiz';
import { createRound } from './domain/rotation';
import { themes } from './content';
import { scoreRepository } from './services/scores';
import { createSession, loadRecent, loadSession, persistSession, recordRecent, type VisitSession } from './services/visit-session';
interface SessionApi extends VisitSession { setPosition: (id: string, position: number) => void; setAnswers: (id: string, answers: Answers) => void; markSeen: (id: string, post: string) => void; practiceRound: (id: string) => void; reset: () => void; reducedMotion: boolean; setReducedMotion: (value: boolean) => void; kioskMinutes: number; setKioskMinutes: (value: number) => void }
const SessionContext = createContext<SessionApi | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<VisitSession>(loadSession);
  useEffect(() => { persistSession(session); }, [session]);
  const [reducedMotion, setReducedMotion] = useState(() => { try { return localStorage.getItem('flic-motion') === 'reduced'; } catch { return false; } });
  const [kioskMinutes, setKioskMinutes] = useState(0);
  const markSeen = useCallback((id: string, post: string) => {
    recordRecent([post], []);
    setSession(s => { const r = s.rounds[id]; if (!r || r.seenPostIds.includes(post) || !r.postIds.includes(post)) return s; return { ...s, rounds: { ...s.rounds, [id]: { ...r, seenPostIds: [...r.seenPostIds, post] } } }; });
  }, []);
  const setAnswers = useCallback((id: string, answers: Answers) => setSession(s => {
    const round = s.rounds[id];
    if (!round) return s;
    const lock = !round.practice && !round.rankingAnswers && quizScore(round.questions, answers).complete;
    return { ...s, answers: { ...s.answers, [id]: answers }, rounds: { ...s.rounds, [id]: { ...round, rankingAnswers: lock ? { ...answers } : round.rankingAnswers } } };
  }), []);
  return <SessionContext.Provider value={{ ...session, markSeen, setAnswers, setPosition: (id, position) => setSession(s => ({ ...s, positions: { ...s.positions, [id]: position } })), practiceRound: id => { const theme = themes.find(t => t.id === id); if (!theme) return; const next = createRound(theme, loadRecent(), true); setSession(s => ({ ...s, positions: { ...s.positions, [id]: 0 }, answers: { ...s.answers, [id]: {} }, rounds: { ...s.rounds, [id]: { ...next, rankingAnswers: s.rounds[id]?.rankingAnswers } } })); }, reset: () => { setSession(createSession()); scoreRepository.clear(); }, reducedMotion, setReducedMotion: value => { setReducedMotion(value); try { localStorage.setItem('flic-motion', value ? 'reduced' : 'default'); } catch { /* Preferences must not block the museum. */ } }, kioskMinutes, setKioskMinutes }}>{children}</SessionContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useSession() { const value = useContext(SessionContext); if (!value) throw new Error('Sessão indisponível'); return value; }
