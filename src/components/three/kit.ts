import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
 * Shared materials and builders, ported from docs/redesign/3d-reference (three r149).
 * The Canvas runs in `legacy` colour mode so hex colours match the approved reference;
 * light intensities are scaled for the physically based lights in current three.
 */

export const ORANGE = '#ff6a10';
/** r149 legacy lights → current physical lights. */
export const LIGHT_K = Math.PI;
/** Point lights also lost the old linear falloff; tuned against the reference renders. */
export const POINT_K = Math.PI * 2.5;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const smooth = (t: number) => {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
};
/** Frame-rate-independent damping factor: 1 - (1 - k)^(dt * 60). */
export const damp = (k: number, dt: number) => 1 - Math.pow(1 - k, dt * 60);

export function createKit() {
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9ae5f, metalness: 1, roughness: 0.22, envMapIntensity: 1.3 });
  const core = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(ORANGE),
    emissiveIntensity: 1,
    roughness: 0.4,
    flatShading: true,
    toneMapped: false,
  });
  const glass = (opacity = 0.62, smoothShading = false) =>
    new THREE.MeshPhysicalMaterial({
      color: 0x17120d,
      metalness: 0.1,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.2,
      flatShading: !smoothShading,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

  const up = new THREE.Vector3(0, 1, 0);
  const rodGeometry = (a: THREE.Vector3, b: THREE.Vector3, r: number, segments = 8) => {
    const middle = a.clone().add(b).multiplyScalar(0.5);
    return new THREE.CylinderGeometry(r, r, a.distanceTo(b), segments)
      .applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, b.clone().sub(a).normalize()))
      .translate(middle.x, middle.y, middle.z);
  };
  const rod = (a: THREE.Vector3, b: THREE.Vector3, r: number, segments = 8) => new THREE.Mesh(rodGeometry(a, b, r, segments), gold);

  /**
   * Gold rods along every edge, with ball joints at the vertices.
   * Merged into one mesh: a frame is a single draw call instead of one per rod and joint.
   */
  const frame = (geo: THREE.BufferGeometry, r: number, joints = true, opts: { scale?: number; jointR?: number; segments?: number } = {}) => {
    const parts: THREE.BufferGeometry[] = [];
    const e = new THREE.EdgesGeometry(geo, 1).getAttribute('position');
    const seen = new Set<string>();
    const s = opts.scale ?? 1;
    for (let i = 0; i < e.count; i += 2) {
      const a = new THREE.Vector3().fromBufferAttribute(e, i).multiplyScalar(s);
      const b = new THREE.Vector3().fromBufferAttribute(e, i + 1).multiplyScalar(s);
      parts.push(rodGeometry(a, b, r, opts.segments));
      if (!joints) continue;
      for (const v of [a, b]) {
        const key = v.toArray().map((n) => n.toFixed(3)).join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        parts.push(new THREE.SphereGeometry(opts.jointR ?? r * 2.4, 12, 10).translate(v.x, v.y, v.z));
      }
    }
    const merged = mergeGeometries(parts);
    for (const part of parts) part.dispose();
    if (!merged) throw new Error('Frame rods and joints could not be merged into one geometry');
    return new THREE.Mesh(merged, gold);
  };

  /** Smoked glass body + gold frame + optional orange core. */
  const solid = (geo: THREE.BufferGeometry, opts: { op?: number; r?: number; core?: boolean; coreR?: number } = {}) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, glass(opts.op)));
    g.add(frame(geo, opts.r ?? 0.022));
    let coreMesh: THREE.Mesh | null = null;
    if (opts.core !== false) {
      coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(opts.coreR ?? 0.45, 0), core);
      g.add(coreMesh);
    }
    return { group: g, core: coreMesh };
  };

  const shadow = (alpha = 0.7) => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d')!;
    const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, `rgba(0,0,0,${alpha})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr;
    x.fillRect(0, 0, 128, 128);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
    );
    m.rotation.x = -Math.PI / 2;
    return m;
  };

  /** Warm floating dust. Seeded so posters and live scenes match. */
  const dust = (n: number, spread: [number, number, number] = [24, 14, 8], zOffset = -3, opacity = 0.4) => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (rand() - 0.5) * spread[0];
      a[i * 3 + 1] = (rand() - 0.5) * spread[1];
      a[i * 3 + 2] = (rand() - 0.5) * spread[2] + zOffset;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xe8c48a, size: 0.025, transparent: true, opacity, depthWrite: false }));
  };

  return { gold, core, glass, rod, frame, solid, shadow, dust };
}

export type Kit = ReturnType<typeof createKit>;

type Line = { t: string; f: string; c?: string; x: number; y: number; a?: CanvasTextAlign };

/** Decorative canvas texture (text in WebGL is never the only source of information). */
export function labelTexture(lines: Line[], w: number, h: number, background?: (x: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d')!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const draw = () => {
    x.clearRect(0, 0, w, h);
    background?.(x);
    for (const l of lines) {
      x.fillStyle = l.c ?? '#EDEBE6';
      x.font = l.f;
      x.textAlign = l.a ?? 'left';
      x.fillText(l.t, l.x, l.y);
    }
    tex.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw);
  return { texture: tex, redraw: draw };
}

/** Every colour map used under an object, so they can be uploaded before the first frame. */
export function sceneTextures(root: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  root.traverse((o) => {
    const material = (o as THREE.Mesh).material;
    for (const mat of Array.isArray(material) ? material : material ? [material] : []) {
      const map = (mat as THREE.MeshBasicMaterial).map;
      if (map) textures.add(map);
    }
  });
  return textures;
}

/** Dispose every geometry, material and texture under an object. */
export function disposeTree(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    for (const mat of mats) {
      for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
      mat.dispose();
    }
  });
}
