'use client';

import { useScrollProgress } from './scrollProgress';
import { useReducedMotion } from './useClientValue';

/**
 * Home studio statement: words brighten as the section scrolls in (from the prototype).
 * Full text for assistive tech; the effect is skipped before hydration and under reduced motion.
 */
export default function StatementReveal({ text, className }: { text: string; className?: string }) {
  const f = useScrollProgress();
  // Server render and reduced motion both show the full-strength text.
  const animate = !useReducedMotion();
  const words = text.split(' ');
  const p = Math.max(0, Math.min(1, (f - 0.3) / 0.75));
  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="transition-opacity duration-300"
          style={{ opacity: animate ? 0.16 + 0.84 * Math.max(0, Math.min(1, (p * (words.length + 5) - i) / 5)) : 1 }}
        >
          {w}{' '}
        </span>
      ))}
    </p>
  );
}
