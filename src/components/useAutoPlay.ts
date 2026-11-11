'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from './useClientValue';

/**
 * Steps a hero through its items on its own (phones have no hover to drive the 3D scene).
 * Runs only while the section is on screen and the tab is visible; the visitor's first pick
 * stops it, and `toggle` is the required pause/play control (WCAG 2.2.2). Off for reduced motion.
 */
export function useAutoPlay(section: RefObject<HTMLElement | null>, advance: () => void, interval = 4000) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const step = useRef(advance);
  useEffect(() => {
    step.current = advance;
  }, [advance]);

  const active = playing && !reduce;
  useEffect(() => {
    if (!active || !section.current) return;
    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(section.current);
    const id = window.setInterval(() => {
      if (inView && !document.hidden) step.current();
    }, interval);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [active, section, interval]);

  return {
    /** Auto-play is available (motion allowed). */
    enabled: !reduce,
    playing: active,
    stop: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
  };
}
