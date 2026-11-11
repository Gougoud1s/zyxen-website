import * as THREE from 'three';

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

/** The studio "panel room" baked into a PMREM environment map. */
export function studioEnvironment(gl: THREE.WebGLRenderer, size = 256) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 20, 30), new THREE.MeshBasicMaterial({ color: 0x050506, side: THREE.BackSide })));
  const panel = (w: number, h: number, color: number, x: number, y: number, z: number, ry = 0, rx = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    env.add(m);
  };
  panel(10, 6, 0xffffff, -8, 7, 4, Math.PI / 4, Math.PI / 5); // key softbox
  panel(4, 12, 0xffd9a8, 12, 1, -2, -Math.PI / 2); // warm strip right
  panel(14, 1.2, 0xff7a1a, 0, -8, -6, 0, -Math.PI / 3); // orange floor bounce
  panel(2, 10, 0x9fb4ff, -13, 0, -6, Math.PI / 2); // cool rim left
  panel(8, 2, 0xffffff, 3, 9.5, -3, 0, Math.PI / 2); // top strip
  const pm = new THREE.PMREMGenerator(gl);
  const texture = pm.fromScene(env, 0.035, 0.1, 100, { size }).texture;
  pm.dispose();
  env.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return texture;
}

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
  const rod = (a: THREE.Vector3, b: THREE.Vector3, r: number, segments = 8) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), segments), gold);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
    return m;
  };

  /** Gold rods along every edge, with ball joints at the vertices. */
  const frame = (geo: THREE.BufferGeometry, r: number, joints = true, opts: { scale?: number; jointR?: number; segments?: number } = {}) => {
    const g = new THREE.Group();
    const e = new THREE.EdgesGeometry(geo, 1).getAttribute('position');
    const seen = new Set<string>();
    const s = opts.scale ?? 1;
    for (let i = 0; i < e.count; i += 2) {
      const a = new THREE.Vector3().fromBufferAttribute(e, i).multiplyScalar(s);
      const b = new THREE.Vector3().fromBufferAttribute(e, i + 1).multiplyScalar(s);
      g.add(rod(a, b, r, opts.segments));
      if (!joints) continue;
      for (const v of [a, b]) {
        const key = v.toArray().map((n) => n.toFixed(3)).join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(opts.jointR ?? r * 2.4, 12, 10), gold);
        ball.position.copy(v);
        g.add(ball);
      }
    }
    return g;
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
