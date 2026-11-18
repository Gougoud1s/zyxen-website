// Bakes the studio environment map the 3D scenes reflect (public/environment/studio-<size>.png).
// Usage: `npm run bake:environment`. Needs no running server.
// Re-run whenever src/components/three/studioRoom.ts or the encoding in environment.ts changes,
// then re-render the posters (`npm run posters`).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const OUT_DIR = 'public/environment';
// Never requested from the network: every URL under it is answered from local files below.
const ORIGIN = 'http://bake.invalid';
const SOURCE_DIR = 'src/components/three';
const THREE_BUILD_DIR = 'node_modules/three/build';
const PAGE = `<!doctype html><script type="importmap">{"imports":{"three":"/three.module.js"}}</script>`;

/** The site's own modules, transpiled so the browser bakes with the exact room and encoding the site uses. */
function siteModule(name) {
  const source = readFileSync(`${SOURCE_DIR}/${name}.ts`, 'utf8');
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function answer(route) {
  const path = new URL(route.request().url()).pathname;
  if (path === '/') return route.fulfill({ contentType: 'text/html', body: PAGE });
  const body = path.startsWith('/three.') ? readFileSync(`${THREE_BUILD_DIR}${path}`, 'utf8') : siteModule(path.slice(1));
  return route.fulfill({ contentType: 'text/javascript', body });
}

async function bake(page, size) {
  return page.evaluate(async (faceSize) => {
    const THREE = await import('three');
    const { renderStudioEnvironment } = await import('/studioRoom');
    const { encodeEnvironment } = await import('/environment');
    // The site's canvas runs in legacy colour mode (see kit.ts), so the room's colours must too.
    THREE.ColorManagement.enabled = false;
    const gl = new THREE.WebGLRenderer();
    const target = renderStudioEnvironment(gl, faceSize);
    const { width, height } = target;
    const halfFloats = new Uint16Array(width * height * 4);
    gl.readRenderTargetPixels(target, 0, 0, width, height, halfFloats);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').putImageData(new ImageData(encodeEnvironment(halfFloats), width, height), 0, 0);
    target.dispose();
    gl.dispose();
    return { width, height, png: canvas.toDataURL('image/png') };
  }, size);
}

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', (error) => {
    throw error;
  });
  await page.route(`${ORIGIN}/**`, answer);
  await page.goto(`${ORIGIN}/`);
  const { ENVIRONMENT_SIZES } = await page.evaluate(() => import('/environment').then((m) => ({ ENVIRONMENT_SIZES: m.ENVIRONMENT_SIZES })));
  for (const size of Object.values(ENVIRONMENT_SIZES)) {
    const { width, height, png } = await bake(page, size);
    const file = `${OUT_DIR}/studio-${size}.png`;
    const bytes = Buffer.from(png.split(',')[1], 'base64');
    writeFileSync(file, bytes);
    console.log(file, `${width}x${height}`, Math.round(bytes.length / 1024), 'KB');
  }
} finally {
  await browser.close();
}
