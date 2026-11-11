import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Cookie Policy — ZYXEN";

export default function Image() {
  return og("Cookie Policy", "(Legal)");
}
