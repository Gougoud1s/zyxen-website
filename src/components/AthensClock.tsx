'use client';

import { useEffect, useState } from 'react';

const now = () =>
  new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit' });

/** Current Athens time; rendered after mount so static HTML never shows a stale time. */
export default function AthensClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(now());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return <time suppressHydrationWarning>{time || '--:--'}</time>;
}
