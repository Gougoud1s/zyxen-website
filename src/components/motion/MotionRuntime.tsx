'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useReducedMotion } from '../useClientValue';

declare global {
  interface Window {
    /** Set once the runtime is watching; the inline script in layout.tsx un-hides everything if it never is. */
    __kxLive?: boolean;
  }
}

/** How far a button follows the pointer, as a share of the pointer's distance from its centre. */
const MAGNET_PULL = 0.22;
const MAGNET_SELECTOR = '.zx-cta';

/**
 * The script side of the motion system (see motion.css):
 * marks `[data-kx]` elements with `data-in` when they scroll into view, and gives pill buttons a magnetic pull.
 * Does nothing under reduced motion.
 */
export default function MotionRuntime() {
  const path = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (reduce) {
      root.removeAttribute('data-kx');
      return;
    }
    window.__kxLive = true;
    root.setAttribute('data-kx', '');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-in', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('body [data-kx]:not([data-in])').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [path, reduce]);

  useEffect(() => {
    if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let held: HTMLElement | null = null;
    const release = () => {
      held?.style.removeProperty('--mx');
      held?.style.removeProperty('--my');
      held = null;
    };
    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(MAGNET_SELECTOR) : null;
      if (target !== held) release();
      if (!target) return;
      held = target;
      const box = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${((event.clientX - (box.left + box.width / 2)) * MAGNET_PULL).toFixed(1)}px`);
      target.style.setProperty('--my', `${((event.clientY - (box.top + box.height / 2)) * MAGNET_PULL).toFixed(1)}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', release);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', release);
      release();
    };
  }, [reduce]);

  return null;
}
