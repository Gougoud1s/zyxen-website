import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Privacy Policy — ZYXEN";

export default function Image() {
  return og("Privacy Policy", "(Legal)");
}
