'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import Stage from '../Stage';
import { clamp, createKit, disposeTree, ORANGE } from '../kit';
import { useHalfExtents, usePointer } from '../pointer';
import type { SceneProps } from '../types';

/* About: gold lat/long globe, Athens glowing, arcs to partner cities (zx-scenes.js `S.globe`). */
const R = 2.5;
const CITIES: [number, number][] = [
  [51.5, -0.12], // London
  [52.37, 4.9], // Amsterdam
  [52.52, 13.4], // Berlin
  [55.68, 12.57], // Copenhagen
  [48.86, 2.35], // Paris
  [25.2, 55.27], // Dubai
  [40.71, -74.0], // New York
  [41.0, 28.98], // Istanbul
];

function latLon(lat: number, lon: number, rad: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const the = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-(rad * Math.sin(phi) * Math.cos(the)), rad * Math.cos(phi), rad * Math.sin(phi) * Math.sin(the));
}

function Globe() {
  const { halfW, halfH, narrow, centred } = useHalfExtents();
  const p = usePointer();

  const built = useMemo(() => {
    const kit = createKit();
    const root = new THREE.Group();
    root.add(kit.dust(160));
    const globe = new THREE.Group();
    root.add(globe);
    const thin = new THREE.MeshStandardMaterial({ color: 0xd9ae5f, metalness: 1, roughness: 0.3, envMapIntensity: 1.1, transparent: true, opacity: 0.55 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(R * Math.cos((lat * Math.PI) / 180), 0.008, 6, 96), thin);
      m.rotation.x = Math.PI / 2;
      m.position.y = R * Math.sin((lat * Math.PI) / 180);
      globe.add(m);
    }
    for (let lo = 0; lo < 180; lo += 30) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(R, 0.008, 6, 96), thin);
      m.rotation.y = (lo * Math.PI) / 180;
      globe.add(m);
    }
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 48), kit.glass(0.3, true)));
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 6, 4), kit.gold, 520);
    const mtx = new THREE.Matrix4();
    for (let i = 0; i < 520; i++) {
      const y = 1 - (i / 519) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      mtx.makeTranslation(Math.cos(th) * rr * R * 1.002, y * R * 1.002, Math.sin(th) * rr * R * 1.002);
      dots.setMatrixAt(i, mtx);
    }
    globe.add(dots);
    const athens = latLon(37.98, 23.73, R);
    const home = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), kit.core);
    home.position.copy(athens);
    globe.add(home);
    const ringMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
    const pulse = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.15, 40), ringMat);
    pulse.position.copy(athens);
    pulse.lookAt(athens.clone().multiplyScalar(2));
    globe.add(pulse);
    const travelers = CITIES.map(([la, lo], j) => {
      const b = latLon(la, lo, R);
      const mid = athens.clone().add(b).multiplyScalar(0.5);
      mid.setLength(R + athens.distanceTo(b) * 0.4);
      const curve = new THREE.QuadraticBezierCurve3(athens, mid, b);
      globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.008, 6, false), kit.gold));
      const end = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), kit.gold);
      end.position.copy(b);
      globe.add(end);
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), kit.core);
      globe.add(m);
      return { m, curve, o: j / CITIES.length };
    });
    return { root, globe, pulse, ringMat, travelers };
  }, []);
  useEffect(() => () => disposeTree(built.root), [built]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const ox = centred ? 0 : 0.3 * halfW;
    built.globe.position.set(ox, narrow ? halfH * 0.28 : 0, 0);
    built.globe.scale.setScalar(narrow ? 0.7 : 1);
    built.globe.rotation.y = -2.0 + t * 0.06 + p.dragX + p.sx * 0.25;
    built.globe.rotation.x = 0.4 + clamp(p.dragY * 0.5, -0.6, 0.6) - p.sy * 0.12;
    for (const tr of built.travelers) {
      const k = (t * 0.22 + tr.o) % 1;
      tr.m.position.copy(tr.curve.getPoint(k));
      tr.m.scale.setScalar(Math.sin(k * Math.PI) + 0.01);
    }
    const k = (t % 2) / 2;
    built.pulse.scale.setScalar(1 + k * 3);
    built.ringMat.opacity = 1 - k;
    state.gl.domElement.style.cursor = p.down ? 'grabbing' : 'grab';
  });

  return <primitive object={built.root} />;
}

export default function GoldGlobe({ running, poster, onReady }: SceneProps) {
  return (
    <Stage running={running} poster={poster} onReady={onReady}>
      <Globe />
    </Stage>
  );
}
