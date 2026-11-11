import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Athens. Worldwide. — ZYXEN";

export default function Image() {
  return og("Athens. Worldwide.", "(About)");
}
