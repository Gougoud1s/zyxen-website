import type { CSSProperties } from 'react';
import Mark from './Mark';

type Props = {
  /** One entry per line of the headline. The words stay ordinary text, so the heading reads the same to crawlers. */
  lines: string[];
  /** Words that punch in instead of rising (the reels' slam). Matched exactly, punctuation included. */
  slam?: string[];
  /** Line indexes pushed right, as on the home hero. */
  indent?: number[];
  /** Line indexes that get an underline which draws itself once the line is in view. */
  underline?: number[];
  /** `load` plays with the first paint (page heroes); `view` waits until the headline scrolls into view. */
  when?: 'load' | 'view';
};

/**
 * Kinetic headline: each word rises out of a mask with a short blur, one after another.
 * CSS only. Without JavaScript or with reduced motion the text is simply there.
 */
export default function Kinetic({ lines, slam = [], indent = [], underline = [], when = 'load' }: Props) {
  let order = 0;
  return (
    <span className={when === 'load' ? 'kx-load' : undefined} data-kx={when === 'view' ? 'words' : undefined}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ').map((word, wordIndex) => (
          <span key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span className={slam.includes(word) ? 'kx-w kx-slam' : 'kx-w'}>
              <span style={{ '--i': order++ } as CSSProperties}>{word}</span>
            </span>
          </span>
        ));
        // A single line stays inline, so it can share its line with what follows (the arrow in "Next" links).
        return (
          <span key={lineIndex} className={lines.length > 1 ? 'kx-line' : undefined} style={indent.includes(lineIndex) ? { paddingLeft: '12vw' } : undefined}>
            {underline.includes(lineIndex) ? <Mark>{words}</Mark> : words}
          </span>
        );
      })}
    </span>
  );
}
