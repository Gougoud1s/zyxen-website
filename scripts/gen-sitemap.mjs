// Publish only canonical, indexable pages. Do not invent modification dates.
import { writeFileSync } from 'node:fs';
import { allRoutes, BASE } from './routes.mjs';
import { languageAlternates } from '../src/lib/seo.js';
const urls = allRoutes().map(path => {
  const alternates = languageAlternates(path).map(item =>
    `    <xhtml:link rel="alternate" hreflang="${item.lang}" href="${BASE}${item.path}"/>`).join('\n');
  return `  <url>\n    <loc>${BASE}${path}</loc>\n${alternates ? alternates + '\n' : ''}  </url>`;
});
writeFileSync(new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`Sitemap: ${urls.length} canonical URLs`);
