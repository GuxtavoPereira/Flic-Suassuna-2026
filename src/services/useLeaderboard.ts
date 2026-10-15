import { useEffect, useState } from 'react';
import { leaderboardRepository, LEADERBOARD_EVENT, LEADERBOARD_KEY } from './leaderboard';
export function useLeaderboard() {
  const [state, setState] = useState(() => leaderboardRepository.load());
  useEffect(() => {
    const reload = () => setState(leaderboardRepository.load());
    const storage = (event: StorageEvent) => { if (event.key === LEADERBOARD_KEY || event.key === null) reload(); };
    window.addEventListener(LEADERBOARD_EVENT, reload);
    window.addEventListener('storage', storage);
    return () => { window.removeEventListener(LEADERBOARD_EVENT, reload); window.removeEventListener('storage', storage); };
  }, []);
  return state;
}