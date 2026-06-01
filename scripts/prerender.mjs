// Best-effort static prerender: renders each route to HTML with a headless browser
// and writes dist/<route>/index.html so crawlers receive real content.
//
// Safe by design: if no Chrome/Chromium is found (e.g. a remote CI build), it logs a
// warning and exits 0 — the SPA fallback still works, the build never breaks.
//
// The static file server runs in a SEPARATE child process: the prerender loop uses
// synchronous spawnSync (which blocks the event loop), so an in-process server would
// deadlock when Chrome requests the page.
import { spawnSync, spawn, execSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { allRoutes } from './routes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '../dist');
const PORT = 5273;
const BUDGET_MS = 4000;   // virtual-time budget for the page to settle (DOM dumped by now)
const KILL_MS = 6000;     // hard cap — animation pages (rAF) never self-exit; DOM is already captured by BUDGET_MS
const PROFILE_BASE = '/tmp/zyxen-pr'; // unique profile per route avoids lock contention between launches

function findChrome() {
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (existsSync(mac)) return mac;
  for (const bin of ['google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser']) {
    try { return execSync(`command -v ${bin}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
    catch { /* not found */ }
  }
  return null;
}

const CHROME = findChrome();
if (!CHROME) {
  console.warn('⚠ prerender: no Chrome/Chromium found — skipping prerender (SPA fallback serves). Build continues.');
  process.exit(0);
}
if (!existsSync(join(DIST, 'index.html'))) {
  console.warn('⚠ prerender: dist/index.html missing — did vite build run? Skipping.');
  process.exit(0);
}

// --- Static dist server, run as a separate process so spawnSync can't deadlock it. ---
const SERVER_SRC = `
const { createServer } = require('http');
const { readFileSync, existsSync, statSync } = require('fs');
const { join, extname } = require('path');
const DIST = ${JSON.stringify(DIST)};
const idx = readFileSync(join(DIST, 'index.html'));
const M = { '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json',
  '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp',
  '.ico':'image/x-icon', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain' };
createServer((q, s) => {
  const p = decodeURIComponent((q.url || '/').split('?')[0]);
  const f = join(DIST, p);
  if (extname(p) && existsSync(f) && statSync(f).isFile()) {
    s.writeHead(200, { 'Content-Type': M[extname(p)] || 'application/octet-stream' });
    s.end(readFileSync(f));
  } else { s.writeHead(200, { 'Content-Type': 'text/html' }); s.end(idx); }
}).listen(${PORT});
`;

const serverProc = spawn(process.execPath, ['-e', SERVER_SRC], { stdio: 'ignore' });

function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const code = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT}/`, { encoding: 'utf8', timeout: 2000 }).trim();
      if (code === '200') return true;
    } catch { /* not up yet */ }
    try { execSync('sleep 0.25'); } catch { /* ignore */ }
  }
  return false;
}

function renderRoute(route) {
  // ?prerender=1 tells the app to skip the intro overlay so the snapshot shows page content.
  const url = `http://localhost:${PORT}${route}?prerender=1`;
  const r = spawnSync(CHROME, [
    '--headless=old', '--disable-gpu', '--enable-unsafe-swiftshader',
    '--no-sandbox', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-sync', '--disable-background-networking',
    `--user-data-dir=${PROFILE_BASE}/${route.replace(/\W/g, '_') || 'root'}`,
    `--virtual-time-budget=${BUDGET_MS}`, '--dump-dom', url,
  ], { encoding: 'utf8', timeout: KILL_MS, maxBuffer: 32 * 1024 * 1024 });
  // Chrome may not self-exit (gets SIGTERM at KILL_MS) — that's fine, --dump-dom has
  // already streamed the serialized DOM to stdout by then. Accept whatever rendered.
  let html = r.stdout || '';
  if (html.length < 2000 || /<div id="root">\s*<\/div>/.test(html)) {
    throw new Error(`incomplete render (${html.length}b)${r.error ? ' ' + r.error.code : ''}`);
  }
  if (!/^<!doctype/i.test(html.trimStart())) html = `<!DOCTYPE html>\n${html}`;
  return html;
}

if (!waitForServer()) {
  console.warn('⚠ prerender: dist server did not start — skipping.');
  serverProc.kill();
  process.exit(0);
}

const routes = allRoutes();
let ok = 0, failed = 0;
for (const route of routes) {
  try {
    const html = renderRoute(route);
    const outDir = join(DIST, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    ok++;
    process.stdout.write(`  ✓ ${route} (${(html.length / 1024).toFixed(0)}kb)\n`);
  } catch (e) {
    failed++;
    process.stdout.write(`  ✗ ${route} — ${e.message}\n`);
  }
}

serverProc.kill();
try { rmSync(PROFILE_BASE, { recursive: true, force: true }); } catch { /* ignore */ }
console.log(`\n✓ prerender complete — ${ok} ok, ${failed} failed of ${routes.length}`);
process.exit(0);
