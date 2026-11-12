import { SITE_URL as BASE, ORGANIZATION_ID, canonicalPath } from './seo.js';

/**
 * Build a schema.org FAQPage from an array of { q, a } items.
 * Returns null when faqs is empty or not an array.
 */
export function faqPageSchema(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/**
 * Build a schema.org Service from a data.js service object.
 * `title` is the search-facing name (see serviceSeo.js); without it the service's own name is used.
 */
export function serviceSchema(service, lang, title) {
  const s = service[lang] || {};
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title || s.name,
    ...(title ? { alternateName: s.name } : {}),
    description: s.description,
    serviceType: title || s.name,
    // Based in Greece, working with clients abroad too.
    areaServed: [{ '@type': 'Country', name: 'Greece' }, { '@type': 'Place', name: 'Worldwide' }],
    provider: { '@id': ORGANIZATION_ID },
    url: `${BASE}/services/${service.slug}`,
  };
}

/**
 * Build a schema.org BreadcrumbList from [{ name, path }] items.
 */
export function breadcrumbSchema(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${canonicalPath(item.path)}`,
    })),
  };
}
