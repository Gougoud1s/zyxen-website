// Shared route manifest — used by both the sitemap generator and the prerenderer.
import { services, projects } from '../src/lib/data.js';

export const BASE = 'https://www.zyxen.gr';
export const LANGS = ['el', 'en'];

// Localized path suffixes (without the /{lang} prefix). '' === the home page.
export const localizedPaths = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/projects', priority: 0.9, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/technologies', priority: 0.6, changefreq: 'monthly' },
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.7, changefreq: 'monthly' })),
  ...projects
    .filter((p) => !p.confidential)
    .map((p) => ({ path: `/projects/${p.slug}`, priority: 0.6, changefreq: 'monthly' })),
  { path: '/privacy-policy', priority: 0.2, changefreq: 'yearly' },
  { path: '/cookie-policy', priority: 0.2, changefreq: 'yearly' },
  { path: '/terms', priority: 0.2, changefreq: 'yearly' },
];

// Absolute route paths to prerender, e.g. ['/el', '/en/about', ...].
export function allRoutes() {
  const routes = [];
  for (const lang of LANGS) {
    for (const { path } of localizedPaths) routes.push(`/${lang}${path}`);
  }
  return routes;
}
