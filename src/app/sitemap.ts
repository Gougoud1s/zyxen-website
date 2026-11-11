import type { MetadataRoute } from 'next';
import { projects, services } from '@/lib/data.js';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/websites',
    '/services',
    '/projects',
    '/contact',
    '/about',
    ...services.map((s) => `/services/${s.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
    '/privacy-policy',
    '/cookie-policy',
    '/terms',
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path === '/' ? '' : path}` }));
}
