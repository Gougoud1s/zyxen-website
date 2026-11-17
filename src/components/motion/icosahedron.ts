/*
 * The ZYXEN mark as geometry: a wireframe icosahedron, projected flat for SVG.
 * At yaw 0 it is seen face-on (down a three-fold axis), which is the brand mark in favicon.svg.
 */
type Vec3 = [number, number, number];

const PHI = (1 + Math.sqrt(5)) / 2;
const EDGE_LENGTH = 2;

const VERTICES: Vec3[] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const subtract = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const normalize = (a: Vec3) => scale(a, 1 / Math.hypot(...a));
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// Camera basis: look straight at the face (0, 11, 5), with vertex 0 pointing up.
const FACE: [number, number, number] = [0, 11, 5];
const toward = normalize(FACE.map((i) => VERTICES[i]).reduce((sum, v) => [sum[0] + v[0], sum[1] + v[1], sum[2] + v[2]] as Vec3));
const up = normalize(subtract(VERTICES[FACE[0]], scale(toward, dot(VERTICES[FACE[0]], toward))));
const right = cross(up, toward);

/** Vertices in camera space: x right, y up, z toward the viewer. */
const VIEW: Vec3[] = VERTICES.map((v) => [dot(v, right), dot(v, up), dot(v, toward)]);

const edges: [number, number][] = [];
for (let i = 0; i < VERTICES.length; i++) {
  for (let j = i + 1; j < VERTICES.length; j++) {
    if (Math.abs(Math.hypot(...subtract(VERTICES[i], VERTICES[j])) - EDGE_LENGTH) < 0.01) edges.push([i, j]);
  }
}
// Front edges first, so the visible mark is what draws first.
const depthOf = ([i, j]: [number, number]) => VIEW[i][2] + VIEW[j][2];
const EDGES = edges.sort((a, b) => depthOf(b) - depthOf(a));

/** Half the size of the square that always contains the projected solid (its circumradius, plus stroke room). */
export const MARK_EXTENT = Math.hypot(1, PHI) + 0.08;

const BACK_OPACITY = 0.16;

export type ProjectedEdge = { x1: number; y1: number; x2: number; y2: number; opacity: number };

/** The 30 edges projected to 2D after turning the solid `yaw` radians about the vertical axis. */
export function projectEdges(yaw = 0): ProjectedEdge[] {
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const points = VIEW.map(([x, y, z]) => ({ x: x * cos + z * sin, y: -y, z: -x * sin + z * cos }));
  return EDGES.map(([i, j]) => {
    const a = points[i];
    const b = points[j];
    // Edges on the far side fade back so the front of the solid reads clearly.
    const nearness = Math.min(1, Math.max(0, (a.z + b.z) / 2 + 0.75));
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, opacity: BACK_OPACITY + (1 - BACK_OPACITY) * nearness };
  });
}
