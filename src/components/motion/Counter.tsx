'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../useClientValue';
import { clamp01, easeOutExpo } from './easing';

const DURATION_MS = 1400;

/**
 * A number that counts up to its value the first time it is seen.
 * The real value is always in the markup (and is what assistive tech reads); only the visible digits animate.
 */
export default function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (reduce || !el) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = clamp01((now - start) / DURATION_MS);
        setShown(value * easeOutExpo(progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduce, value]);

  const final = value.toFixed(decimals);
  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{final}</span>
      {/* Reserve the final width so the digits never shift the line. */}
      <span aria-hidden="true" className="inline-block text-right" style={{ minWidth: `${final.length}ch` }}>
        {shown.toFixed(decimals)}
      </span>
    </span>
  );
}
