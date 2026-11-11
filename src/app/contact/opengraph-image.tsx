import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Let's build. — ZYXEN";

export default function Image() {
  return og("Let's build.", "(Contact)");
}
