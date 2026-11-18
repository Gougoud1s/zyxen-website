import * as THREE from 'three';

/*
 * Offline only: imported by scripts/bake-studio-environment.mjs, never by the site.
 * Changing the room means re-running `npm run bake:environment` and `npm run posters`.
 */

/** The studio "panel room", filtered into a PMREM environment map `size` pixels per cube face. */
export function renderStudioEnvironment(gl: THREE.WebGLRenderer, size: number) {
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
  const target = pm.fromScene(env, 0.035, 0.1, 100, { size });
  pm.dispose();
  env.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return target;
}
