import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { damp, lerp } from './kit';

export type PointerState = {
  mx: number; // -1..1 over the canvas
  my: number;
  sx: number; // smoothed, eased back to 0 when the pointer leaves
  sy: number;
  inside: boolean;
  down: boolean;
  dragX: number; // accumulated drag with inertia
  dragY: number;
  vx: number;
  vy: number;
  moved: number;
};

/**
 * Pointer tilt, drag with inertia and click detection on the canvas (the reference `base()`).
 * Clicks fire only when the pointer moved less than 6px, so a drag never selects.
 */
export function usePointer(onClick?: (p: PointerState) => void, enabled = true) {
  const { gl } = useThree();
  const p = useMemo<PointerState>(() => ({ mx: 0, my: 0, sx: 0, sy: 0, inside: false, down: false, dragX: 0, dragY: 0, vx: 0, vy: 0, moved: 0 }), []);

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    el.style.touchAction = 'pan-y';
    let lx = 0;
    let ly = 0;
    const set = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      p.mx = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
      p.my = -((e.clientY - r.top) / Math.max(1, r.height)) * 2 + 1;
      p.inside = p.mx > -1 && p.mx < 1 && p.my > -1 && p.my < 1;
    };
    const move = (e: PointerEvent) => {
      set(e);
      if (!p.down) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      p.moved += Math.abs(dx) + Math.abs(dy);
      p.dragX += dx * 0.006;
      p.dragY += dy * 0.006;
      p.vx = dx * 0.006;
      p.vy = dy * 0.006;
    };
    const down = (e: PointerEvent) => {
      set(e);
      p.down = true;
      p.moved = 0;
      lx = e.clientX;
      ly = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (p.down && p.moved < 6) {
        set(e);
        onClick?.(p);
      }
      p.down = false;
    };
    window.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, p, onClick, enabled]);

  // Runs before the scene's own useFrame (registered first).
  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta);
    p.sx = lerp(p.sx, p.inside ? p.mx : 0, damp(0.05, dt));
    p.sy = lerp(p.sy, p.inside ? p.my : 0, damp(0.05, dt));
    if (!p.down) {
      const d = Math.pow(0.94, dt * 60);
      p.vx *= d;
      p.vy *= d;
      p.dragX += p.vx;
      p.dragY += p.vy;
    }
  });

  return p;
}

/**
 * Visible half-extents of the view plane through the origin, for positioning by screen fraction.
 * `narrow`: portrait full-bleed canvas (reference behaviour: centred, shifted up, smaller).
 * `band`: the phone layout, where the canvas sits in its own strip between text, so the object
 * is simply centred at full size instead of offset to the right.
 */
export function useHalfExtents() {
  const camera = useThree((s) => s.camera) as import('three').PerspectiveCamera;
  const size = useThree((s) => s.size);
  return useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    const halfH = Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.length();
    const narrow = aspect < 0.9;
    return { halfH, halfW: halfH * aspect, aspect, narrow, centred: narrow || size.width < 768 };
  }, [camera, size]);
}
