// Static prerender: renders each route to HTML with headless Chromium (Puppeteer) and
// writes dist/<route>/index.html so crawlers receive real content. Runs in any build
// environment that can launch Chromium — including Vercel's remote build — because
// Puppeteer ships its own browser.
//
// Safe by design: if Puppeteer is missing or the browser can't launch, it logs a
// warning and exits 0 — the SPA fallback still serves, the build never breaks.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { allRoutes } from './routes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '../dist');
const PORT = 5273;
const SETTLE_MS = 700; // let React render + SEOMeta effects run after navigation

if (!existsSync(join(DIST, 'index.html'))) {
  console.warn('⚠ prerender: dist/index.html missing — skipping.');
  process.exit(0);
}

let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  console.warn('⚠ prerender: puppeteer not available — skipping prerender (SPA fallback serves). Build continues.');
  process.exit(0);
}

// In-process static file server with SPA fallback (async — safe with Puppeteer).
const indexHtml = readFileSync(join(DIST, 'index.html'));
const MIME = {
  '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
};
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const filePath = join(DIST, urlPath);
  if (extname(urlPath) && existsSync(filePath) && statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[extname(urlPath)] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
  }
});
await new Promise((r) => server.listen(PORT, r));

let browser;
try {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars'],
  });
} catch (e) {
  console.warn(`⚠ prerender: could not launch Chromium (${e.message}) — skipping. Build continues.`);
  server.close();
  process.exit(0);
}

const routes = allRoutes();
let ok = 0, failed = 0;
for (const route of routes) {
  const page = await browser.newPage();
  try {
    // ?prerender=1 tells the app to skip the intro overlay so the snapshot shows page content.
    const url = `http://localhost:${PORT}${route}?prerender=1`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, SETTLE_MS));
    const html = await page.content();
    if (html.length < 2000 || /<div id="root">\s*<\/div>/.test(html)) {
      throw new Error(`incomplete render (${html.length}b)`);
    }
    const outDir = join(DIST, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    ok++;
    process.stdout.write(`  ✓ ${route} (${(html.length / 1024).toFixed(0)}kb)\n`);
  } catch (e) {
    failed++;
    process.stdout.write(`  ✗ ${route} — ${e.message}\n`);
  } finally {
    await page.close().catch(() => {});
  }
}

await browser.close().catch(() => {});
server.close();
console.log(`\n✓ prerender complete — ${ok} ok, ${failed} failed of ${routes.length}`);
process.exit(0);
