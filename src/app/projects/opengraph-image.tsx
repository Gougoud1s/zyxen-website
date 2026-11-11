import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Selected work — ZYXEN";

export default function Image() {
  return og("Selected work", "(Work)");
}
