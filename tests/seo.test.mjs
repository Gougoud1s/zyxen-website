import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allRoutes } from '../scripts/routes.mjs';
import { canonicalPath, languageAlternates } from '../src/lib/seo.js';

const html = route => readFileSync(new URL(`../dist${route === '/' ? '' : route}/index.html`, import.meta.url), 'utf8');
const extract = (text, expression) => [...text.matchAll(expression)].map(match => match[1]);

test('canonical and translated URL strategy', () => {
  assert.equal(canonicalPath('/en/services/'), '/services');
  assert.equal(canonicalPath('/el'), '/');
  assert.equal(canonicalPath('/el/websites'), '/el/websites');
  assert.equal(canonicalPath('/enterprise'), '/enterprise');
  assert.deepEqual(languageAlternates('/services'), []);
  assert.deepEqual(languageAlternates('/websites'), languageAlternates('/el/websites'));
});

test('every sitemap URL has crawlable HTML, a matching canonical and unique title', () => {
  const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const urls = extract(sitemap, /<loc>(.*?)<\/loc>/g);
  assert.deepEqual(urls, allRoutes().map(path => `https://www.zyxen.gr${path}`));
  assert.equal(new Set(urls).size, urls.length);
  const titles = new Set();
  for (const path of allRoutes()) {
    const page = html(path);
    assert.ok(page.includes(`rel="canonical" href="https://www.zyxen.gr${path}"`), path);
    assert.equal((page.match(/<h1[ >]/g) || []).length, 1, path);
    assert.ok(!page.includes('content="noindex'), path);
    const title = extract(page, /<title>(.*?)<\/title>/g)[0];
    assert.ok(title && !titles.has(title), `unique title: ${path}`); titles.add(title);
    assert.ok(page.includes(`<html lang="${path === '/el/websites' ? 'el' : 'en'}"`), path);
    assert.equal((page.match(/hreflang="/g) || []).length, path.endsWith('/websites') ? 3 : 0, path);
    assert.ok(!page.includes('+30 210 000 0000'));
    assert.ok(!page.includes('Official partner'));
    const schemas = extract(page, /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs).map(JSON.parse);
    assert.equal(schemas.filter(item => item['@type'] === 'Organization').length, 1, path);
    assert.equal(schemas.filter(item => item['@type'] === 'BreadcrumbList').length, 1, path);
  }
});

test('legacy URLs redirect to indexable pages and preserve the genuine translation', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
  for (const path of ['/en/services','/el/projects/ips','/en','/el','/en/websites']) {
    const redirect = config.redirects.find(item => item.source === path);
    assert.equal(redirect.destination, canonicalPath(path)); assert.equal(redirect.permanent, true);
  }
  assert.ok(!config.redirects.some(item => item.source === '/el/websites'));
});

test('all service proposals and answers are in the delivered HTML', () => {
  const page = html('/services');
  for (const text of ['Catalogue and customer journey planning', 'Workflow map and agreed requirements', 'What does ZYXEN do?', 'Did ZYXEN build every project']) assert.ok(page.includes(text), text);
  assert.ok(page.includes('FAQPage'));
  assert.ok(readFileSync(new URL('../dist/404.html', import.meta.url),'utf8').includes('content="noindex'));
});
