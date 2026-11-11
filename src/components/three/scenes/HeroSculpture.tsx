'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { getScrollProgress } from '@/components/scrollProgress';
import Stage from '../Stage';
import { createKit, damp, disposeTree, lerp, POINT_K, smooth } from '../kit';
import { useHalfExtents } from '../pointer';
import type { SceneProps } from '../types';

/*
 * Home: smoked-glass icosahedron in a gold cage around an orange core (zx-cine.js `mount`).
 * Keyframes per home section: [fracX, fracY, scale, cageSeparation, coreGlow, spinOffset].
 */
const KEYS = [
  [0, 0.1, 1.0, 0, 1, 0], // hero
  [0.42, 0.02, 0.85, 0, 0.8, 1.2], // studio statement
  [-0.46, 0, 0.78, 0.12, 0.9, 2.4], // what we build
  [0.5, 0.04, 0.62, 0, 0.7, 3.6], // selected work
  [0.5, 0.3, 0.5, 0.06, 0.8, 4.8], // working together
  [0, 0.12, 0.95, 0.32, 1.7, 6.0], // contact
];

function Sculpture({ poster }: { poster: boolean }) {
  const { halfW, halfH, narrow } = useHalfExtents();

  const built = useMemo(() => {
    const kit = createKit();
    const obj = new THREE.Group();
    const geo = new THREE.IcosahedronGeometry(2, 0);
    const glass = new THREE.Mesh(geo, kit.glass(0.62));
    obj.add(glass);
    const cage = kit.frame(geo, 0.022, true, { scale: 1.004, jointR: 0.055, segments: 10 });
    obj.add(cage);
    const coreMat = kit.core;
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), coreMat);
    obj.add(core);
    const coreLight = new THREE.PointLight(0xff8a2b, 2.5 * POINT_K, 8);
    obj.add(coreLight);
    const shadow = kit.shadow(0.75);
    const dust = kit.dust(typeof window !== 'undefined' && window.innerWidth < 700 ? 120 : 260, [22, 12, 8], -2, 0.45);
    const root = new THREE.Group();
    root.add(obj, shadow, dust);
    return { root, obj, glass, cage, core, coreMat, coreLight, shadow, dust };
  }, []);

  useEffect(() => () => disposeTree(built.root), [built]);

  const s = useMemo(() => ({ cx: 0, cy: -4, cs: 0.6, sep: 0, glow: 0, spin: 0, rx: 0, ry: 0, intro: 0, mx: 0, my: 0, snapped: false }), []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      s.mx = e.clientX / (window.innerWidth || 1) - 0.5;
      s.my = e.clientY / (window.innerHeight || 1) - 0.5;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [s]);

  useFrame((state, delta) => {
    const dt = Math.min(0.1, delta);
    const t = state.clock.elapsedTime;
    const q = (k: number) => damp(k, dt);
    const f = Math.max(0, Math.min(KEYS.length - 1, poster ? 0 : getScrollProgress()));
    const i = Math.min(KEYS.length - 2, Math.floor(f));
    const u = smooth(f - i);
    const A = KEYS[i];
    const B = KEYS[i + 1];
    let tx = lerp(A[0], B[0], u) * halfW;
    let ty = lerp(A[1], B[1], u) * halfH;
    let tsc = lerp(A[2], B[2], u);
    if (narrow) {
      tx = 0;
      ty = halfH * 0.05; // reference used 0.32, which covered the intro text on phones
      tsc *= 0.62; // reference 0.72; smaller so it fits between the intro and the headline on short phones
    }
    // Start exactly where the poster shows the sculpture (no rise-in), so the poster-to-live swap is invisible.
    if (!s.snapped) {
      Object.assign(s, { snapped: true, intro: 1, cx: tx, cy: ty, cs: tsc, sep: lerp(A[3], B[3], u), glow: lerp(A[4], B[4], u), spin: lerp(A[5], B[5], u) });
    }
    s.intro = lerp(s.intro, t > 0.2 ? 1 : 0, q(0.035));
    s.cx = lerp(s.cx, tx, q(0.06));
    s.cy = lerp(s.cy, ty - (1 - s.intro) * 3, q(0.06));
    s.cs = lerp(s.cs, tsc * (0.6 + 0.4 * s.intro), q(0.06));
    s.sep = lerp(s.sep, lerp(A[3], B[3], u), q(0.06));
    s.glow = lerp(s.glow, lerp(A[4], B[4], u), q(0.05));
    s.spin = lerp(s.spin, lerp(A[5], B[5], u), q(0.04));
    s.rx = lerp(s.rx, s.my * 0.35, q(0.05));
    s.ry = lerp(s.ry, s.mx * 0.5, q(0.05));

    const { obj, glass, cage, core, coreMat, coreLight, shadow, dust } = built;
    obj.position.set(s.cx, s.cy + Math.sin(t * 0.9) * 0.08, 0);
    obj.scale.setScalar(s.cs);
    obj.rotation.set(0.42 + s.rx + Math.sin(t * 0.35) * 0.06, t * 0.12 + s.spin + s.ry, 0.08);
    cage.scale.setScalar(1 + s.sep);
    (glass.material as THREE.MeshPhysicalMaterial).opacity = Math.max(0, 0.62 - s.sep * 1.4);
    core.rotation.set(t * 0.5, -t * 0.7, 0);
    core.scale.setScalar(1 + s.sep * 0.6);
    coreMat.emissiveIntensity = 0.55 + 0.45 * s.glow + Math.sin(t * 2.2) * 0.08;
    coreLight.intensity = 2.2 * s.glow * POINT_K;
    shadow.position.set(s.cx, s.cy - 2.6 * s.cs, 0);
    shadow.scale.setScalar(s.cs * 1.2);
    (shadow.material as THREE.MeshBasicMaterial).opacity = 0.8 * s.intro;
    dust.rotation.y = t * 0.012;
    dust.position.y = -f * 0.6;
  });

  return <primitive object={built.root} />;
}

export default function HeroSculpture({ running, poster, onReady }: SceneProps) {
  return (
    <Stage running={running} poster={poster} onReady={onReady}>
      <Sculpture poster={poster} />
    </Stage>
  );
}
