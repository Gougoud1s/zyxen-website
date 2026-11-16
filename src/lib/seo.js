export const SITE_URL = 'https://www.zyxen.gr';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Strip trailing slashes and the retired /en and /el prefixes (both 301 to the English URL). */
export function canonicalPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path.replace(/^\/(en|el)(?=\/|$)/, '') || '/';
}

// ZYXEN's own profiles elsewhere. Listing them ties those pages to this brand for search engines;
// add new ones (GoodFirms, vrisko.gr, xo.gr) here once their listings are public.
export const PROFILES = [
  'https://www.linkedin.com/company/zyxen-gr/',
  'https://www.instagram.com/zyxen.gr/',
  // Google Business Profile, by its Knowledge Graph id (the stable form of the profile's share link).
  'https://www.google.com/search?kgmid=/g/11z_g8k5np',
  'https://clutch.co/profile/zyxen',
];

// The Business Profile's own share link, used as the company's map listing.
export const BUSINESS_PROFILE_URL = 'https://share.google/W6mwQ9aW3yaJ24eED';

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
  telephone: '+30 694 442 1297',
  description: 'ZYXEN is a software studio based in Greece, building business websites, e-commerce platforms, mobile applications and business automation.',
  address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' },
  areaServed: 'Worldwide',
  sameAs: PROFILES,
  hasMap: BUSINESS_PROFILE_URL,
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
