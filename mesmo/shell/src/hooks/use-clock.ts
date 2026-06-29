import { useEffect, useState } from 'react';

/**
 * Headless hook that exposes the current time, refreshed every second.
 * Returned as a `Date` so consumers decide how to format it.
 */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}
