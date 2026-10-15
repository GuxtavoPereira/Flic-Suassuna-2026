import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Answers } from './domain/quiz';
import { scoreRepository } from './services/scores';
type Session = { positions: Record<string, number>; answers: Record<string, Answers> };
interface SessionApi extends Session { setPosition: (id: string, position: number) => void; setAnswers: (id: string, answers: Answers) => void; reset: () => void; reducedMotion: boolean; setReducedMotion: (value: boolean) => void; kioskMinutes: number; setKioskMinutes: (value: number) => void }
const SessionContext = createContext<SessionApi | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ positions: {}, answers: {} });
  const [reducedMotion, setReducedMotion] = useState(() => { try { return localStorage.getItem('flic-motion') === 'reduced'; } catch { return false; } });
  const [kioskMinutes, setKioskMinutes] = useState(0);
  return <SessionContext.Provider value={{ ...session, setPosition: (id, position) => setSession(s => ({ ...s, positions: { ...s.positions, [id]: position } })), setAnswers: (id, answers) => setSession(s => ({ ...s, answers: { ...s.answers, [id]: answers } })), reset: () => { setSession({ positions: {}, answers: {} }); scoreRepository.clear(); }, reducedMotion, setReducedMotion: value => { setReducedMotion(value); try { localStorage.setItem('flic-motion', value ? 'reduced' : 'default'); } catch { /* A preference must not block the museum. */ } }, kioskMinutes, setKioskMinutes }}>{children}</SessionContext.Provider>;
}
// Context hooks are intentionally shared with page components.
// eslint-disable-next-line react-refresh/only-export-components
export function useSession() { const value = useContext(SessionContext); if (!value) throw new Error('Sessão indisponível'); return value; }