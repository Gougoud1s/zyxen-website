import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Terms of Use — ZYXEN";

export default function Image() {
  return og("Terms of Use", "(Legal)");
}
