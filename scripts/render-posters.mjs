// Renders the static poster for each 3D scene (the server-rendered fallback and LCP-safe placeholder).
// Usage: npm run build && npm start, then `node scripts/render-posters.mjs` (SITE_URL to override).
// Re-run whenever a scene's look changes.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.env.SITE_URL || 'http://localhost:3000';
const scenes = { hero: '/', shapes: '/services', slabs: '/projects', layers: '/websites', globe: '/about', listen: '/contact' };
const views = {
  desktop: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
};

mkdirSync('public/posters', { recursive: true });
mkdirSync('src/assets', { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  for (const [name, path] of Object.entries(scenes)) {
    for (const [view, options] of Object.entries(views)) {
      const context = await browser.newContext({ ...options, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`${base}${path}?poster`, { waitUntil: 'networkidle' });
      await page.waitForSelector('html[data-poster-ready]', { timeout: 90_000 });
      const data = await page.$eval('[role=img] canvas', (c) => c.toDataURL('image/webp', 0.86));
      if (!data.startsWith('data:image/webp')) throw new Error(`${name}/${view}: browser did not encode WebP`);
      const file = `public/posters/${name}-${view}.webp`;
      writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
      console.log(file, Math.round((data.length * 0.75) / 1024), 'KB', errors.length ? errors : '');
      if (name === 'hero' && view === 'desktop') {
        // Open Graph images (next/og) cannot read WebP; keep a PNG of the hero outside public/.
        const png = await page.$eval('[role=img] canvas', (c) => c.toDataURL('image/png'));
        writeFileSync('src/assets/og-hero.png', Buffer.from(png.split(',')[1], 'base64'));
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
