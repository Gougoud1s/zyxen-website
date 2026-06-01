// Generates public/sitemap.xml from the shared route manifest, with hreflang alternates.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { localizedPaths, LANGS, BASE } from './routes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const lastmod = new Date().toISOString().slice(0, 10);

const urls = [];
for (const lang of LANGS) {
  for (const { path, priority, changefreq } of localizedPaths) {
    const alts = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}/${l}${path}"/>`
    ).join('\n');
    urls.push(
      `  <url>\n` +
        `    <loc>${BASE}/${lang}${path}</loc>\n` +
        `${alts}\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/el${path}"/>\n` +
        `    <changefreq>${changefreq}</changefreq>\n` +
        `    <priority>${priority.toFixed(1)}</priority>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `  </url>`
    );
  }
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${urls.join('\n')}\n` +
  `</urlset>\n`;

writeFileSync(join(here, '../public/sitemap.xml'), xml, 'utf8');
console.log(`✓ sitemap.xml written — ${urls.length} URLs`);
