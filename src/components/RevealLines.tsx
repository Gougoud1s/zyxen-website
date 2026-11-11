import type { CSSProperties } from 'react';

/** Headline whose lines slide up on load (CSS only, disabled under reduced motion). */
export default function RevealLines({ lines, indent = [] }: { lines: string[]; indent?: number[] }) {
  return lines.map((line, i) => (
    <span key={line} className="reveal" style={indent.includes(i) ? { paddingLeft: '12vw' } : undefined}>
      <span style={{ '--i': i } as CSSProperties}>{line}</span>
    </span>
  ));
}
