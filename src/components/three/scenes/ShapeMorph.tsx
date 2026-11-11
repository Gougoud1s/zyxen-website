'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import Stage from '../Stage';
import { createKit, damp, disposeTree, lerp } from '../kit';
import { useHalfExtents, usePointer } from '../pointer';
import type { SceneProps } from '../types';

/* Services: one sculpture that changes shape per service (zx-scenes.js `S.shapes`). */
type Props = { active: number; onSelect?: (i: number) => void; poster: boolean };

function Shapes({ active, onSelect }: Props) {
  const { halfW, halfH, narrow, centred } = useHalfExtents();
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const built = useMemo(() => {
    const kit = createKit();
    const root = new THREE.Group();
    root.add(kit.dust(160));
    const geos = [
      new THREE.BoxGeometry(2.3, 2.3, 2.3),
      new THREE.OctahedronGeometry(1.9, 0),
      new THREE.TetrahedronGeometry(2.1, 0),
      new THREE.DodecahedronGeometry(1.75, 0),
    ];
    const shapes = geos.map((g) => {
      const s = kit.solid(g, { coreR: 0.4 });
      s.group.scale.setScalar(0.001);
      root.add(s.group);
      return { ...s, sc: 0.001 };
    });
    const shadow = kit.shadow();
    root.add(shadow);
    return { root, shapes, shadow, spin: 0, started: false };
  }, []);
  useEffect(() => () => disposeTree(built.root), [built]);

  const click = useCallback(() => onSelect?.((activeRef.current + 1) % built.shapes.length), [onSelect, built]);
  const p = usePointer(click);

  useFrame((state, delta) => {
    const dt = Math.min(0.1, delta);
    const t = state.clock.elapsedTime;
    const ox = centred ? 0 : 0.3 * halfW;
    const oy = narrow ? halfH * 0.3 : 0;
    built.spin += dt * 0.25;
    built.shapes.forEach((s, i) => {
      const on = i === activeRef.current;
      const target = on ? (narrow ? 0.7 : 1) : 0.001;
      // First frame starts at full size, matching the poster, instead of growing in.
      s.sc = built.started ? lerp(s.sc, target, damp(on ? 0.06 : 0.12, dt)) : target;
      s.group.scale.setScalar(Math.max(0.001, s.sc));
      s.group.position.set(ox, oy + Math.sin(t * 0.9) * 0.08, 0);
      s.group.rotation.set(0.45 - p.sy * 0.3 + p.dragY * 0.4, built.spin + p.sx * 0.5 + p.dragX + (on ? 0 : 1.5), 0.1);
      s.core?.rotation.set(t * 0.6, -t * 0.8, 0);
    });
    built.started = true;
    built.shadow.position.set(ox, oy - 2.4, 0);
    built.shadow.scale.setScalar(narrow ? 0.8 : 1.1);
    state.gl.domElement.style.cursor = p.down ? 'grabbing' : 'grab';
  });

  return <primitive object={built.root} />;
}

export default function ShapeMorph({ running, poster, onReady, active, onSelect }: SceneProps & Partial<Props>) {
  return (
    <Stage running={running} poster={poster} onReady={onReady}>
      <Shapes active={active ?? 0} onSelect={onSelect} poster={poster} />
    </Stage>
  );
}
