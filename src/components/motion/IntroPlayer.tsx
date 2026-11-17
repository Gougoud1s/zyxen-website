'use client';

import { useLayoutEffect } from 'react';
import { easeOutExpo } from './easing';
import { projectEdges } from './icosahedron';
import { beginIntro } from './introGate';
import { INTRO, INTRO_RELEASE_EVENT } from './introTimeline';

const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchmove'] as const;
const HERO_WORDS = '[data-intro-hero] .kx-w > span';

function turnMark(lines: NodeListOf<SVGLineElement>, yaw: number) {
  projectEdges(yaw).forEach((edge, i) => {
    const line = lines[i];
    line.setAttribute('x1', edge.x1.toFixed(3));
    line.setAttribute('y1', edge.y1.toFixed(3));
    line.setAttribute('x2', edge.x2.toFixed(3));
    line.setAttribute('y2', edge.y2.toFixed(3));
    line.setAttribute('opacity', edge.opacity.toFixed(2));
  });
}

/**
 * Script side of the home intro (the timeline itself is CSS, see motion.css): turns the mark in 3D while it
 * draws, lets any key, click or scroll skip it, and clears the intro state once the hero has taken over.
 */
export default function IntroPlayer() {
  useLayoutEffect(() => {
    // Visitors arriving by an in-site link never ran the inline gate.
    beginIntro();
    const root = document.documentElement;
    if (!root.dataset.intro) return;

    // The CSS timeline starts with the first painted frame, which can be later than the inline gate ran.
    // Read the clock from the wipe's own animation so the script and the CSS stay in step.
    const wipe = document.querySelector('.zx-intro-wipe')?.getAnimations()[0];
    const sinceGate = performance.now() - (window.__zxIntroStart ?? performance.now());
    const started = performance.now() - (typeof wipe?.currentTime === 'number' ? wipe.currentTime : sinceGate);
    const elapsed = () => performance.now() - started;
    // Freeze the headline in its final state first: clearing the attribute alone would restart its animation.
    const finish = () => {
      document.querySelectorAll<HTMLElement>(HERO_WORDS).forEach((word) => (word.style.animation = 'none'));
      root.removeAttribute('data-intro');
    };
    // Left over from an intro that was still running when the visitor left the home page.
    if (root.dataset.intro !== 'play' || elapsed() > INTRO.endMs) {
      finish();
      window.dispatchEvent(new Event(INTRO_RELEASE_EVENT));
      return;
    }

    const lines = document.querySelectorAll<SVGLineElement>('.zx-intro-mark line');
    let frame = 0;
    const timers: number[] = [];
    const tick = () => {
      const progress = Math.min(1, elapsed() / INTRO.drawMs);
      turnMark(lines, (1 - easeOutExpo(progress)) * INTRO.startYaw);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const releaseScenes = () => window.dispatchEvent(new Event(INTRO_RELEASE_EVENT));
    const stopListening = () => SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));
    function skip() {
      stopListening();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      root.dataset.intro = 'skip';
      releaseScenes();
      timers.push(window.setTimeout(finish, INTRO.heroSettleMs));
    }

    SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }));
    timers.push(
      window.setTimeout(stopListening, Math.max(0, INTRO.wipeStartMs - elapsed())),
      window.setTimeout(releaseScenes, Math.max(0, INTRO.releaseScenesMs - elapsed())),
      window.setTimeout(finish, Math.max(0, INTRO.coverMs + INTRO.heroSettleMs - elapsed())),
    );

    return () => {
      stopListening();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      // Never leave a scene waiting if the visitor leaves the page mid-intro.
      releaseScenes();
    };
  }, []);

  return null;
}
