const BASE = 'https://www.zyxen.gr';

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
 */
export function serviceSchema(service, lang) {
  const s = service[lang] || {};
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    serviceType: s.name,
    areaServed: 'GR',
    provider: {
      '@type': 'Organization',
      name: 'ZYXEN',
      url: BASE,
    },
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
      item: `${BASE}${item.path}`,
    })),
  };
}
