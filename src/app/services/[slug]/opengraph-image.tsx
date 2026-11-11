import { getService } from '@/lib/site';
import { services } from '@/lib/data.js';
import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
// Built at build time like the pages (the font is fetched then, and src/assets is not shipped to functions).
export const dynamicParams = false;
export const generateStaticParams = () => services.map((x) => ({ slug: x.slug }));

export const alt = 'ZYXEN service';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug)!;
  return og(s.en.name, '(Services)');
}
