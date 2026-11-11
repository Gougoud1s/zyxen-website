import { expect, test } from '@playwright/test';
import { routes } from './routes';

test('every internal link and asset on every page resolves', async ({ request }, info) => {
  test.skip(info.project.name !== 'chromium-1440', 'crawl once');
  test.setTimeout(180_000);
  const seen = new Map<string, number>();
  for (const path of routes) {
    const html = await (await request.get(path)).text();
    const hrefs = [...html.matchAll(/href="([^"#?]+)/g)].map((m) => m[1]).filter((h) => h.startsWith('/') && !h.startsWith('//'));
    const assets = [...html.matchAll(/(?:src|srcSet)="(\/[^"\s,]+)/g)].map((m) => m[1].replace(/&amp;/g, '&'));
    for (const url of [...hrefs, ...assets]) {
      if (seen.has(url)) continue;
      seen.set(url, (await request.get(url)).status());
    }
  }
  const broken = [...seen].filter(([, status]) => status !== 200);
  expect(broken).toEqual([]);
  expect(seen.size).toBeGreaterThan(40);
});
