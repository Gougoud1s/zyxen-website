import { projects, services } from '../../src/lib/data.js';

export const routes = [
  '/',
  '/projects',
  '/services',
  '/websites',
  '/about',
  '/contact',
  '/privacy-policy',
  '/cookie-policy',
  '/terms',
  ...projects.map((p) => `/projects/${p.slug}`),
  ...services.map((s) => `/services/${s.slug}`),
];

/** Vercel Web Analytics only exists on Vercel; ignore its script if a build has it switched on. */
export const ignorable = (text: string) => text.includes('/_vercel/insights');
