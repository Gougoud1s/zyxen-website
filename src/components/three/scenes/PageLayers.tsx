'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import Stage from '../Stage';
import { createKit, damp, disposeTree, labelTexture, lerp } from '../kit';
import { useHalfExtents, usePointer } from '../pointer';
import type { SceneProps } from '../types';

/* Websites: five glass page plates stacked; the selected one lifts out (zx-scenes.js `S.layers`). */
type Props = { names: string[]; active: number; onSelect?: (i: number) => void };
const W = 3.8;
const D = 2.5;

function Layers({ names, active, onSelect }: Props) {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => camera.lookAt(0, 0, 0), [camera]);
  const { halfW, narrow, centred } = useHalfExtents();
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const built = useMemo(() => {
    const kit = createKit();
    const root = new THREE.Group();
    root.add(kit.dust(140));
    const stack = new THREE.Group();
    root.add(stack);
    const geo = new THREE.BoxGeometry(W, 0.06, D);
    const plates = names.map((n, i) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(geo, kit.glass(0.7)));
      g.add(kit.frame(geo, 0.01, false));
      const tex = labelTexture(
        [
          { t: String(i + 1).padStart(2, '0'), f: '400 30px Inter, sans-serif', c: '#D9AE5F', x: 48, y: 80 },
          { t: n, f: '500 96px "Inter Tight", Inter, sans-serif', x: 48, y: 200 },
        ],
        1024,
        674,
      ).texture;
      const lab = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 0.98, D * 0.98),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }),
      );
      lab.rotation.x = -Math.PI / 2;
      lab.position.y = 0.035;
      lab.userData.i = i;
      g.add(lab);
      stack.add(g);
      return { g, lab, lift: 0 };
    });
    return { root, stack, plates, spread: 0.5 };
  }, [names]);
  useEffect(() => () => disposeTree(built.root), [built]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pick = useCallback(
    (p: { mx: number; my: number }) => {
      raycaster.setFromCamera(new THREE.Vector2(p.mx, p.my), camera);
      return raycaster.intersectObjects(built.plates.map((pl) => pl.lab), false)[0]?.object ?? null;
    },
    [raycaster, camera, built],
  );
  const click = useCallback(
    (p: { mx: number; my: number }) => {
      const hit = pick(p);
      if (hit) onSelect?.(hit.userData.i);
    },
    [pick, onSelect],
  );
  const p = usePointer(click);

  useFrame((state, delta) => {
    const dt = Math.min(0.1, delta);
    const t = state.clock.elapsedTime;
    const ox = centred ? 0 : 0.32 * halfW * 0.8;
    built.spread = lerp(built.spread, p.inside ? 0.85 : 0.6, damp(0.05, dt));
    built.stack.position.set(ox, narrow ? 1.2 : 0, 0);
    built.stack.scale.setScalar(narrow ? 0.7 : 1);
    built.stack.rotation.set(0, -0.5 + p.sx * 0.3 + p.dragX, 0);
    built.plates.forEach((pl, i) => {
      pl.lift = lerp(pl.lift, i === activeRef.current ? 1 : 0, damp(0.1, dt));
      pl.g.position.set(pl.lift * 1.1, (names.length - 1 - i) * built.spread - 1.4 + Math.sin(t + i) * 0.03, pl.lift * 0.6);
      pl.g.rotation.z = pl.lift * 0.05;
      (pl.lab.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.65 * pl.lift;
    });
    const hover = p.inside ? pick(p) : null;
    state.gl.domElement.style.cursor = hover ? 'pointer' : 'grab';
  });

  return <primitive object={built.root} />;
}

export default function PageLayers({ running, poster, onReady, names, active, onSelect }: SceneProps & Partial<Props>) {
  return (
    <Stage running={running} poster={poster} onReady={onReady} camera={{ position: [0, 6.5, 10] }}>
      <Layers names={names ?? []} active={active ?? 0} onSelect={onSelect} />
    </Stage>
  );
}
