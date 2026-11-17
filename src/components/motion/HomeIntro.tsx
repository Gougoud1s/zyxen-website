import type { CSSProperties } from 'react';
import IntroPlayer from './IntroPlayer';
import { MARK_EXTENT, projectEdges } from './icosahedron';
import { beginIntro } from './introGate';
import { introCssVariables } from './introTimeline';

const WORDMARK = 'ZYXEN';
const box = `${-MARK_EXTENT} ${-MARK_EXTENT} ${MARK_EXTENT * 2} ${MARK_EXTENT * 2}`;

/**
 * Cinematic intro for the home page: the mark draws itself in orange, the wordmark resolves, and an orange
 * wipe hands off to the hero. About 2.5s, once per session.
 *
 * The page underneath is complete and painted the whole time; the overlay is decoration on top of it
 * (hidden from assistive tech, `display: none` unless the inline gate below switches it on). The timeline is
 * plain CSS, so it always ends by itself; IntroPlayer only adds the turning mark and skipping.
 */
export default function HomeIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(${beginIntro.toString()})()` }} />
      <style dangerouslySetInnerHTML={{ __html: introCssVariables }} />
      <div className="zx-intro" aria-hidden="true">
        <svg className="zx-intro-mark" viewBox={box} fill="none" focusable="false">
          {projectEdges().map((edge, i) => (
            <line key={i} pathLength={1} {...edge} style={{ '--i': i } as CSSProperties} />
          ))}
        </svg>
        <div className="zx-intro-word">
          {[...WORDMARK].map((letter, i) => (
            <span key={letter} style={{ '--i': i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </div>
        <p className="zx-intro-hint">Click or press any key to skip</p>
      </div>
      <div className="zx-intro-wipe" aria-hidden="true" />
      <IntroPlayer />
    </>
  );
}
