import { breadcrumbSchema } from '@/lib/structuredData.js';

/** Structured data for search engines. `<` is escaped so content can never close the script tag. */
export default function JsonLd({ data }: { data: object | null | (object | null)[] }) {
  const items = [data].flat().filter(Boolean);
  return items.map((item, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }} />
  ));
}

/** BreadcrumbList from Home through the given trail, e.g. [['Work', '/projects'], ['LED7', '/projects/led7']]. */
export function Breadcrumbs({ trail }: { trail: [string, string][] }) {
  return <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, ...trail.map(([name, path]) => ({ name, path }))])} />;
}
