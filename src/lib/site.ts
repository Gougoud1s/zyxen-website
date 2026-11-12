import type { Metadata } from 'next';
import { projects, services } from './data.js';
import { projectStories } from './projectStories.js';
import { serviceSeo } from './serviceSeo.js';

export const SITE_URL = 'https://www.zyxen.gr';
export const EMAIL = 'hello@zyxen.gr';

export const nav = [
  { href: '/projects', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/websites', label: 'Websites' },
  { href: '/about', label: 'About' },
];

export type Project = (typeof projects)[number];
export type Service = (typeof services)[number];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
/** Search-facing heading, meta tags and FAQs for a service page. */
export const seoFor = (slug: string) => (serviceSeo as Record<string, (typeof serviceSeo)['flutter-web-mobile']>)[slug];
export const storyFor = (slug: string) =>
  (projectStories as Record<string, (typeof projectStories)['led7'] | undefined>)[slug];

/** Short sector tag for list rows, e.g. "E-commerce / Retail" → "E-commerce". */
export const sector = (p: Project) => p.en.category.split(' / ')[0];
/** One-line summary: the story headline where one exists, else the overview. */
export const summary = (p: Project) => storyFor(p.slug)?.headline ?? p.en.overview;

/** The four service shapes from the approved design, grouping the six service pages. */
export const serviceGroups = [
  {
    id: 'websites',
    title: 'Websites',
    text: 'Content-managed websites on Umbraco and .NET, built to turn visitors into calls, bookings and enquiries — and easy for your team to update.',
    tech: 'Umbraco · .NET / C# · Technical SEO',
    items: ['Page structure and content plan', 'Responsive design and development', 'Core Web Vitals and structured data', 'Easy content editing for your team'],
    services: ['umbraco-platform-engineering', 'web-experiences-seo'],
  },
  {
    id: 'online-stores',
    title: 'Online stores',
    text: 'B2C and B2B stores on nopCommerce — catalogue, payments, shipping and vendor management — with Google Ads that bring buyers in.',
    tech: 'nopCommerce · .NET · Google Ads',
    items: ['Store setup and product catalogue', 'Payments and shipping', 'B2B portals and vendor management', 'Support for existing stores'],
    services: ['commerce-nopcommerce'],
  },
  {
    id: 'apps',
    title: 'Apps',
    text: 'One Flutter codebase for iPhone, Android and the web, connected to your APIs and business systems.',
    tech: 'Flutter · REST APIs · Integrations',
    items: ['App design and prototyping', 'iOS, Android and web builds', 'API and system integrations', 'Release support'],
    services: ['flutter-web-mobile'],
  },
  {
    id: 'automation',
    title: 'Automation',
    text: 'AI assistants and automated workflows — including document processing with .NET systems — that take manual work off your team.',
    tech: 'AI · .NET · Jenkins · Bitbucket Pipelines',
    items: ['Process mapping', 'AI assistants and document processing', 'System integrations', 'CI/CD and reliable deployments'],
    services: ['ai-integrations', 'delivery-devops'],
  },
];

export const groupForService = (slug: string) => serviceGroups.find((g) => g.services.includes(slug))!;

/** Case studies that share at least one technology tag with a service (live "Case studies utilizing this stack"). */
export const projectsForService = (s: Service) =>
  projects.filter((p) => p.tech.some((t) => s.tech.includes(t))).slice(0, 3);

export const pad = (n: number) => String(n).padStart(2, '0');

type MetaOptions = {
  /** hreflang alternates, e.g. { en: '/websites', el: '/kataskevi-istoselidon' }. */
  languages?: Record<string, string>;
  /** Open Graph locale; English unless the page is written in another language. */
  locale?: string;
};

export function pageMeta(path: string, title: string, description: string, { languages, locale = 'en_US' }: MetaOptions = {}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, ...(languages ? { languages } : {}) },
    // Images come from each route's opengraph-image / twitter-image file.
    openGraph: { title, description, url: path, siteName: 'ZYXEN', type: 'website', locale },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** Trim to ~155 characters at a word boundary, as the live service meta descriptions do. */
export const clip = (text: string, max = 155) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max))}…`;
