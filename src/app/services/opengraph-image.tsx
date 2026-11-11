import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Every system has a shape. — ZYXEN";

export default function Image() {
  return og("Every system has a shape.", "(Services)");
}
