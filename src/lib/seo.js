export const SITE_URL = 'https://www.zyxen.gr';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Strip trailing slashes and the retired /en and /el prefixes (both 301 to the English URL). */
export function canonicalPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path.replace(/^\/(en|el)(?=\/|$)/, '') || '/';
}

// No sameAs: the repo lists no social profiles. Add them here once they exist.
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORGANIZATION_ID,
  name: 'ZYXEN',
  // Spelled-out variants help Google treat the brand as its own name rather than a typo of a similar word.
  alternateName: ['Zyxen', 'ZYXEN Software Studio', 'zyxen.gr'],
  url: `${SITE_URL}/`,
  // Google ignores SVG logos in structured data; this is the favicon rendered at 512px.
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  email: 'hello@zyxen.gr',
  description: 'ZYXEN is a software studio based in Greece, building business websites, e-commerce platforms, mobile applications and business automation.',
  address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' },
  areaServed: 'Worldwide',
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'ZYXEN',
  alternateName: ['Zyxen', 'zyxen.gr'],
  url: `${SITE_URL}/`,
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: 'en',
};
