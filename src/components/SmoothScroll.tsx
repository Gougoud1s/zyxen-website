'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { useReducedMotion } from './useClientValue';

/**
 * Inertial smooth scrolling (Lenis) on top of native scroll, so sticky sections, the home scroll
 * choreography, keyboard scrolling and touch all behave as normal. In-page anchor links glide too.
 * Off for reduced motion; touch keeps native momentum.
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true, // targets already carry scroll-margin for the sticky header
      // Let form fields scroll their own content.
      prevent: (node) => node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT',
    });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}
