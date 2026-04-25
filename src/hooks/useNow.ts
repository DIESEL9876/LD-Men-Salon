import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * Returns the current `Date` and re-renders on a chosen cadence.
 *
 * - Default `intervalMs` is 60 000 (one minute) — perfect for greetings,
 *   "היום / מחר" labels, and "in 30 minutes" countdowns.
 * - Drops the timer while the app is backgrounded and refreshes the
 *   timestamp the moment the user returns, so the UI is always in sync
 *   with the wall clock without burning battery.
 *
 * Usage:
 *   const now = useNow();          // ticks every minute
 *   const now = useNow(1000);      // ticks every second
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    function start() {
      // Snap immediately so a long background period doesn't show stale data.
      setNow(new Date());
      timer = setInterval(() => setNow(new Date()), intervalMs);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    start();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') start();
      else stop();
    });

    return () => {
      stop();
      sub.remove();
    };
  }, [intervalMs]);

  return now;
}
