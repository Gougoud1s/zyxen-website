import type { ReactNode } from 'react';
import { pad } from '@/lib/site';

// Hand-drawn strokes in a 100x100 box that stretches with the phrase; the stroke width stays constant.
const UNDERLINE = 'M1 62 C 22 30, 44 78, 63 50 S 90 34, 99 52';
const CIRCLE = 'M52 6 C 22 2, 3 24, 4 50 C 5 80, 30 97, 56 95 C 82 93, 98 72, 96 46 C 94 20, 70 3, 40 8';

/**
 * An orange annotation that draws itself around or under a phrase when it scrolls into view.
 * Decorative: the phrase stays plain text. Use at most once per section.
 */
export default function Mark({ children, shape = 'underline' }: { children: ReactNode; shape?: 'underline' | 'circle' }) {
  return (
    <span className={`kx-mark kx-mark-${shape}`} data-kx="draw">
      {children}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="kx-stroke" pathLength={1} d={shape === 'circle' ? CIRCLE : UNDERLINE} />
      </svg>
    </span>
  );
}

/** Step number in a circle that draws itself. For real sequences (process steps) only. */
export function StepBadge({ n }: { n: number }) {
  return (
    <span className="kx-badge">
      {pad(n)}
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <circle className="kx-stroke" pathLength={1} cx="20" cy="20" r="18.5" />
      </svg>
    </span>
  );
}
