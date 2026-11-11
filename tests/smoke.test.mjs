// Run against a running build: `npm run build && npm start`, then `npm run test:smoke`.
// SITE_TEST_URL points it elsewhere (e.g. a preview URL).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projects, services } from '../src/lib/data.js';

const base = process.env.SITE_TEST_URL || 'http://localhost:3000';

const routes = [
  '/', '/projects', '/services', '/websites', '/about', '/contact',
  '/privacy-policy', '/cookie-policy', '/terms',
  ...projects.map((p) => `/projects/${p.slug}`),
  ...services.map((s) => `/services/${s.slug}`),
];

test('every page renders with one h1, a unique title and its own canonical', async () => {
  const titles = new Set();
  for (const path of routes) {
    const res = await fetch(base + path, { redirect: 'manual' });
    assert.equal(res.status, 200, path);
    const html = await res.text();
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one h1`);
    assert.ok(html.includes(`<link rel="canonical" href="https://www.zyxen.gr${path === '/' ? '' : path}"/>`), `${path}: canonical`);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), `${path}: duplicate title ${title}`);
    titles.add(title);
  }
});

test('old URLs redirect permanently to the right page', async () => {
  const cases = {
    '/el/websites': '/websites',
    '/en/websites': '/websites',
    '/el': '/',
    '/en/projects/led7': '/projects/led7',
    '/el/services/ai-integrations': '/services/ai-integrations',
    '/technologies': '/services',
    '/en/technologies': '/services',
    '/audit': '/contact',
    '/el/audit': '/contact',
    '/en/en/audit': '/contact',
    '/free-website-review': '/contact',
  };
  for (const [from, to] of Object.entries(cases)) {
    const res = await fetch(base + from, { redirect: 'manual' });
    assert.equal(res.status, 301, from);
    assert.equal(new URL(res.headers.get('location'), base).pathname, to, from);
  }
});

test('unknown pages return 404', async () => {
  assert.equal((await fetch(`${base}/does-not-exist`)).status, 404);
  assert.equal((await fetch(`${base}/projects/not-a-project`)).status, 404);
});

test('sitemap lists every page and no redirected URL', async () => {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.deepEqual(new Set(urls), new Set(routes));
});

test('contact API keeps its input guards', async () => {
  const post = (body, type = 'application/json') =>
    fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': type }, body });
  assert.equal((await post('{}')).status, 400);
  assert.equal((await post('x', 'text/plain')).status, 415);
  const bad = { name: 'A', email: 'not-an-email', service: 'Business website', budget: 'Not specified', details: 'Hi' };
  assert.equal((await post(JSON.stringify(bad))).status, 400);
});
