'use client';

import { useEffect, useState } from 'react';

/*
 * Home page scroll progress on normal document scroll: f = i + t while section i is at the
 * top of the viewport (t = how far through it). Sections opt in with [data-scene-section].
 * One passive scroll listener, read by the 3D scene every frame and by the statement reveal.
 */
let f = 0;
let started = false;
const listeners = new Set<(f: number) => void>();

function measure() {
  const sections = document.querySelectorAll<HTMLElement>('[data-scene-section]');
  const y = window.scrollY;
  let next = 0;
  sections.forEach((s, i) => {
    const top = s.offsetTop;
    const h = Math.max(1, s.offsetHeight);
    if (y >= top) next = i + Math.min(1, (y - top) / h);
  });
  f = next;
  listeners.forEach((l) => l(f));
}

function start() {
  if (started) return;
  started = true;
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      measure();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  measure();
}

export const getScrollProgress = () => {
  start();
  return f;
};

export function useScrollProgress(step = 0.02) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    start();
    const l = (v: number) => setValue((prev) => (Math.abs(prev - v) >= step ? Math.round(v / step) * step : prev));
    listeners.add(l);
    l(f);
    return () => {
      listeners.delete(l);
    };
  }, [step]);
  return value;
}
