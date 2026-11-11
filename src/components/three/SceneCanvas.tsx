'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { useClientValue } from '../useClientValue';
import type { SceneProps } from './types';

// Each scene is its own chunk; three.js loads only after first paint, when the canvas is in view.
const scenes = {
  hero: dynamic(() => import('./scenes/HeroSculpture'), { ssr: false }),
  shapes: dynamic(() => import('./scenes/ShapeMorph'), { ssr: false }),
  slabs: dynamic(() => import('./scenes/ProjectRing'), { ssr: false }),
  layers: dynamic(() => import('./scenes/PageLayers'), { ssr: false }),
  globe: dynamic(() => import('./scenes/GoldGlobe'), { ssr: false }),
  listen: dynamic(() => import('./scenes/ListeningMark'), { ssr: false }),
};
export type SceneName = keyof typeof scenes;

/** Keeps the poster if WebGL fails to start (lost or refused context). */
class Fallback extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canRunWebGL() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Low-end phones get the poster only.
  if ((navigator.hardwareConcurrency || 8) <= 4 && matchMedia('(pointer: coarse)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

type Props = {
  scene: SceneName;
  /** Accessible description of the scene (the canvas itself is decorative). */
  label: string;
  className?: string;
  sceneProps?: Record<string, unknown>;
  /**
   * Hero layout: below lg the canvas is its own strip between the text (no overlap on phones);
   * from lg up it covers the hero behind the text. Text siblings need `relative z-[1]`.
   */
  band?: boolean;
};

/**
 * Server-rendered poster first, then the live scene fades in over it.
 * Poster only for reduced motion, low-end phones and no WebGL. Pauses off-screen and in hidden tabs.
 * `?poster` forces the live scene (used by scripts/render-posters.mjs).
 */
export default function SceneCanvas({ scene, label, className = '', sceneProps, band }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(true);
  const posterMode = useClientValue(() => new URLSearchParams(location.search).has('poster'), false);

  useEffect(() => {
    const el = ref.current!;
    if (!posterMode && !canRunWebGL()) return;

    let visible = false;
    let idle = false;
    const update = () => {
      if (visible && idle) setLive(true);
      setRunning(visible && !document.hidden);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(el);
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => {
      idle = true;
      update();
    });
    document.addEventListener('visibilitychange', update);
    // A lost GPU context drops back to the poster (the event does not bubble, so listen in capture).
    const lost = () => {
      setLive(false);
      setReady(false);
    };
    el.addEventListener('webglcontextlost', lost, true);
    return () => {
      el.removeEventListener('webglcontextlost', lost, true);
      io.disconnect();
      cic(id);
      document.removeEventListener('visibilitychange', update);
    };
  }, [posterMode]);

  useEffect(() => {
    if (ready && posterMode) {
      // Let the intro settle before the poster script captures the canvas.
      // Software rendering can be slow; damping is frame-rate independent, so this is enough.
      const t = setTimeout(() => (document.documentElement.dataset.posterReady = '1'), 6000);
      return () => clearTimeout(t);
    }
  }, [ready, posterMode]);

  const Scene = scenes[scene];
  const props: SceneProps = { running, poster: posterMode, onReady: () => setReady(true), ...sceneProps };

  const canvas = (
    <div ref={ref} role="img" aria-label={label} className={`overflow-hidden ${band ? 'absolute inset-0 z-0' : className}`}>
      {!posterMode && (
        <picture>
          <source media="(max-width: 767px)" srcSet={`/posters/${scene}-mobile.webp`} />
          <img
            src={`/posters/${scene}-desktop.webp`}
            alt=""
            decoding="async"
            fetchPriority="low"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700"
            style={{ opacity: ready ? 0 : 1 }}
          />
        </picture>
      )}
      {live && (
        <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
          <Fallback onError={() => setLive(false)}>
            <Scene {...props} />
          </Fallback>
        </div>
      )}
    </div>
  );
  return band ? <div className={`relative -mx-gutter h-[380px] lg:static lg:mx-0 lg:h-0 ${className}`}>{canvas}</div> : canvas;
}
