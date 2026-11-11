'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import Stage from '../Stage';
import { createKit, damp, disposeTree, labelTexture, lerp } from '../kit';
import { useHalfExtents, usePointer } from '../pointer';
import type { SceneProps } from '../types';

/*
 * Work: glass project slabs on a ring (zx-scenes.js `S.slabs`). Drag to turn, it snaps to the
 * nearest slab; click a slab or a name in the HTML list to bring it forward.
 * Faces show the real project screenshot; names live in the HTML beside the canvas.
 */
export type RingItem = { name: string; tag: string; short: string; image: string };
type Props = { items: RingItem[]; active: number; onSelect?: (i: number) => void };

const W = 3.4;
const H = 2.15;

function face(item: RingItem, i: number) {
  let img: HTMLImageElement | null = null;
  const label = labelTexture(
    [
      { t: item.tag.toUpperCase(), f: '500 26px Inter, sans-serif', c: '#D9AE5F', x: 44, y: 70 },
      { t: String(i + 1).padStart(2, '0'), f: '400 26px Inter, sans-serif', c: '#8C8A85', x: 980, y: 70, a: 'right' },
      { t: item.name, f: `500 ${item.name.length > 16 ? 58 : 84}px "Inter Tight", Inter, sans-serif`, x: 44, y: 560 },
      { t: item.short, f: '400 28px Inter, sans-serif', c: '#8C8A85', x: 44, y: 612 },
    ],
    1024,
    648,
    (x) => {
      x.fillStyle = 'rgba(10,10,11,0.55)';
      x.fillRect(0, 0, 1024, 648);
      if (img?.complete && img.naturalWidth) {
        // Cover-fit the screenshot, then darken towards the name.
        const s = Math.max(1024 / img.naturalWidth, 648 / img.naturalHeight);
        const w = img.naturalWidth * s;
        x.globalAlpha = 0.85;
        x.drawImage(img, (1024 - w) / 2, 0, w, img.naturalHeight * s);
        x.globalAlpha = 1;
      }
      const g = x.createLinearGradient(0, 0, 0, 648);
      g.addColorStop(0, 'rgba(10,10,11,0.75)');
      g.addColorStop(0.18, 'rgba(10,10,11,0.1)');
      g.addColorStop(0.5, 'rgba(10,10,11,0.35)');
      g.addColorStop(1, 'rgba(10,10,11,0.95)');
      x.fillStyle = g;
      x.fillRect(0, 0, 1024, 648);
    },
  );
  img = new Image();
  img.decoding = 'async';
  img.onload = label.redraw;
  img.src = item.image;
  return label.texture;
}

function Ring({ items, active, onSelect }: Props) {
  const { halfW, halfH, narrow, centred } = useHalfExtents();
  const N = items.length;
  const R = Math.max(3.6, (W * 1.08) / (2 * Math.sin(Math.PI / Math.max(3, N))));
  const step = (Math.PI * 2) / Math.max(1, N);

  const built = useMemo(() => {
    const kit = createKit();
    const root = new THREE.Group();
    root.add(kit.dust(180));
    const ring = new THREE.Group();
    root.add(ring);
    const geo = new THREE.BoxGeometry(W, H, 0.08);
    const slabs = items.map((it, i) => {
      const g = new THREE.Group();
      const glass = kit.glass(0.78);
      g.add(new THREE.Mesh(geo, glass));
      // Own frame material so each slab can fade on its own.
      const frameMat = kit.gold.clone();
      frameMat.transparent = true;
      const frame = kit.frame(geo, 0.012, false);
      frame.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material = frameMat;
      });
      g.add(frame);
      const faceMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 0.98, H * 0.98),
        new THREE.MeshBasicMaterial({ map: face(it, i), transparent: true, toneMapped: false }),
      );
      faceMesh.position.z = 0.045;
      faceMesh.userData.i = i;
      g.add(faceMesh);
      ring.add(g);
      return { g, face: faceMesh, glass, frameMat };
    });
    return { root, ring, slabs };
  }, [items]);
  useEffect(() => () => disposeTree(built.root), [built]);

  const st = useRef({ rot: 0, target: -active * step, cur: active, lastDrag: 0 });
  const select = useRef(onSelect);
  useEffect(() => {
    select.current = onSelect;
  }, [onSelect]);

  const go = useCallback(
    (i: number, notify: boolean) => {
      const s = st.current;
      let d = (((i - s.cur) % N) + N) % N;
      if (d > N / 2) d -= N;
      s.target -= d * step;
      s.cur = i;
      if (notify) select.current?.(i);
    },
    [N, step],
  );

  // The HTML list drives the ring.
  useEffect(() => {
    if (active !== st.current.cur) go(active, false);
  }, [active, go]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pickRef = useRef<(p: { mx: number; my: number }) => THREE.Object3D | null>(() => null);
  const click = useCallback((p: { mx: number; my: number }) => {
    const hit = pickRef.current(p);
    if (hit) go(hit.userData.i, true);
  }, [go]);
  const p = usePointer(click);

  useFrame((state, delta) => {
    const dt = Math.min(0.1, delta);
    const t = state.clock.elapsedTime;
    pickRef.current = (pt) => {
      raycaster.setFromCamera(new THREE.Vector2(pt.mx, pt.my), state.camera);
      const hits = raycaster.intersectObjects(built.slabs.filter((s) => s.g.visible).map((s) => s.face), false);
      return hits[0]?.object ?? null;
    };
    const s = st.current;
    const d = p.dragX - s.lastDrag;
    s.lastDrag = p.dragX;
    if (p.down || Math.abs(p.vx) > 0.002) s.target += d;
    else {
      const idx = Math.round(-s.target / step);
      s.target = lerp(s.target, -idx * step, damp(0.12, dt));
      const ni = ((idx % N) + N) % N;
      if (ni !== s.cur) {
        s.cur = ni;
        select.current?.(ni);
      }
    }
    s.rot = lerp(s.rot, s.target, damp(0.08, dt));
    const ox = centred ? 0 : 0.22 * halfW;
    built.ring.position.set(ox, narrow ? halfH * 0.25 : 0.1, -R);
    built.ring.scale.setScalar(narrow ? 0.62 : 1);
    built.slabs.forEach((sl, i) => {
      const a = i * step + s.rot;
      sl.g.position.set(Math.sin(a) * R, Math.sin(t * 0.8 + i) * 0.05, Math.cos(a) * R);
      sl.g.rotation.set(-p.sy * 0.08, a + p.sx * 0.15, 0);
      const front = (Math.cos(a) + 1) / 2;
      // With nine slabs the neighbours stay in view, so they are ghosted harder than in the
      // four-slab reference (front^1.5) to keep the selected project clear of the text beside it.
      (sl.face.material as THREE.MeshBasicMaterial).opacity = Math.pow(front, 8);
      sl.glass.opacity = 0.78 * Math.pow(front, 3);
      sl.frameMat.opacity = Math.pow(front, 4);
      sl.g.visible = front > 0.05;
    });
    const hover = p.inside ? pickRef.current(p) : null;
    state.gl.domElement.style.cursor = hover ? 'pointer' : p.down ? 'grabbing' : 'grab';
  });

  return <primitive object={built.root} />;
}

export default function ProjectRing({ running, poster, onReady, items, active, onSelect }: SceneProps & Partial<Props>) {
  return (
    <Stage running={running} poster={poster} onReady={onReady}>
      <Ring items={items ?? []} active={active ?? 0} onSelect={onSelect} />
    </Stage>
  );
}
