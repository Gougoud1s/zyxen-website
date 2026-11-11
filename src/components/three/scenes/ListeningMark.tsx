'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import Stage from '../Stage';
import { createKit, damp, disposeTree, lerp, POINT_K } from '../kit';
import { useHalfExtents, usePointer } from '../pointer';
import type { SceneProps } from '../types';

/*
 * Contact: the mark opens as the visitor types and lights up when the message is sent
 * (zx-scenes.js `S.listen`). The form dispatches `zx:pulse` and `zx:sent` (see ../events).
 */

function Mark() {
  const { halfW, halfH, narrow, centred } = useHalfExtents();
  const p = usePointer();

  const built = useMemo(() => {
    const kit = createKit();
    const root = new THREE.Group();
    root.add(kit.dust(200));
    const geo = new THREE.IcosahedronGeometry(2, 0);
    const glass = new THREE.Mesh(geo, kit.glass(0.62));
    const cage = kit.frame(geo, 0.022);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), kit.core);
    const obj = new THREE.Group();
    obj.add(glass, cage, core);
    const light = new THREE.PointLight(0xff8a2b, 2 * POINT_K, 8);
    obj.add(light);
    const shadow = kit.shadow();
    root.add(obj, shadow);
    return { root, obj, glass, cage, core, coreMat: kit.core, light, shadow };
  }, []);
  useEffect(() => () => disposeTree(built.root), [built]);

  const s = useMemo(() => ({ energy: 0, sep: 0, sent: false, spin: 0, glow: 0.6 }), []);
  useEffect(() => {
    const pulse = () => (s.energy = Math.min(1, s.energy + 0.3));
    const sent = () => (s.sent = true);
    window.addEventListener('zx:pulse', pulse);
    window.addEventListener('zx:sent', sent);
    return () => {
      window.removeEventListener('zx:pulse', pulse);
      window.removeEventListener('zx:sent', sent);
    };
  }, [s]);

  useFrame((state, delta) => {
    const dt = Math.min(0.1, delta);
    const t = state.clock.elapsedTime;
    const q = (k: number) => damp(k, dt);
    const ox = centred ? 0 : 0.3 * halfW;
    s.energy = lerp(s.energy, 0, q(0.03));
    s.sep = lerp(s.sep, s.sent ? 0.35 : s.energy * 0.25, q(0.08));
    s.glow = lerp(s.glow, s.sent ? 1.6 : 0.6 + s.energy * 0.6, q(0.05));
    s.spin += dt * (s.sent ? 1.4 : 0.15 + s.energy * 0.8);
    const { obj, glass, cage, core, coreMat, light, shadow } = built;
    obj.position.set(ox, (narrow ? halfH * 0.3 : 0) + Math.sin(t * 0.9) * 0.08, 0);
    obj.scale.setScalar(narrow ? 0.7 : 1);
    obj.rotation.set(0.42 - p.sy * 0.3 + p.dragY * 0.4, s.spin + p.sx * 0.5 + p.dragX, 0.08);
    cage.scale.setScalar(1 + s.sep);
    (glass.material as THREE.MeshPhysicalMaterial).opacity = Math.max(0, 0.62 - s.sep * 1.4);
    core.rotation.set(t * 0.5, -t * 0.7, 0);
    coreMat.emissiveIntensity = 0.55 + 0.45 * s.glow;
    light.intensity = 2 * s.glow * POINT_K;
    shadow.position.set(ox, obj.position.y - 2.6 * obj.scale.x, 0);
    shadow.scale.setScalar(obj.scale.x * 1.2);
  });

  return <primitive object={built.root} />;
}

export default function ListeningMark({ running, poster, onReady }: SceneProps) {
  return (
    <Stage running={running} poster={poster} onReady={onReady}>
      <Mark />
    </Stage>
  );
}
