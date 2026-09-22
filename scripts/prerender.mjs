// Static prerender: renders each route to HTML with headless Chromium (Puppeteer) and
// writes dist/<route>/index.html so crawlers receive real content. Runs in any build
// environment that can launch Chromium — including Vercel's remote build.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { allRoutes } from './routes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '../dist');
const PORT = 5273;
const SETTLE_MS = 250; // let React render + SEOMeta effects run
const CONCURRENCY = 8; // process 8 pages in parallel for ultra-fast builds

if (!existsSync(join(DIST, 'index.html'))) {
  console.warn('⚠ prerender: dist/index.html missing — skipping.');
  process.exit(0);
}

// In-process static file server with SPA fallback
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

// Launch browser
let browser;
try {
  if (process.platform === 'linux') {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteerCore = (await import('puppeteer-core')).default;
    chromium.setGraphicsMode = false;
    browser = await puppeteerCore.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    const puppeteer = (await import('puppeteer')).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars'],
    });
  }
} catch (e) {
  console.warn(`⚠ prerender: could not launch Chromium (${e.message}) — skipping. Build continues.`);
  server.close();
  process.exit(0);
}

const routes = allRoutes();
let ok = 0, failed = 0;

async function renderRoute(route) {
  const page = await browser.newPage();
  try {
    // Disable external network requests during prerender to speed up dramatically
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.startsWith(`http://localhost:${PORT}`)) {
        req.continue();
      } else {
        req.abort(); // don't wait for Google Fonts, external APIs, tracking, etc.
      }
    });

    const url = `http://localhost:${PORT}${route}?prerender=1`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
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

// Parallel processing queue
const queue = [...routes];
async function worker() {
  while (queue.length > 0) {
    const route = queue.shift();
    if (route) await renderRoute(route);
  }
}

const startTime = Date.now();
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

await browser.close().catch(() => {});
server.close();
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n✓ prerender complete in ${elapsed}s — ${ok} ok, ${failed} failed of ${routes.length}`);
process.exit(0);