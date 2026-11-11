import { getProject } from '@/lib/site';
import { projects } from '@/lib/data.js';
import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
// Built at build time like the pages (the font is fetched then, and src/assets is not shipped to functions).
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((x) => ({ slug: x.slug }));

export const alt = 'ZYXEN project contribution';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug)!;
  return og(p.en.name, p.en.category);
}
