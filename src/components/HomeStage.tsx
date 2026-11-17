'use client';

import type { ReactNode } from 'react';
import { useScrollProgress } from './scrollProgress';

/** Scroll progress (in sections) after which the hero is behind the visitor and the text sections begin. */
const HERO_PASSED = 0.55;
const PROGRESS_STEP = 0.05;

/**
 * The sticky stage behind the home page. On phones the sculpture sits directly behind the text once the hero
 * is passed, so it steps back there to keep the lists readable; wider screens have room beside the text and
 * keep it at full strength.
 */
export default function HomeStage({ children }: { children: ReactNode }) {
  const pastHero = useScrollProgress(PROGRESS_STEP) > HERO_PASSED;
  return (
    <div
      className={`stage-glow sticky top-0 z-0 -mb-[100vh] h-screen transition-opacity duration-700 ${pastHero ? 'max-sm:opacity-35' : ''}`}
      style={{ ['--glow-y' as string]: '42%' }}
    >
      {children}
    </div>
  );
}
