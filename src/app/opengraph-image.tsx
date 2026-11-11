import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Systems, engineered. — ZYXEN";

export default function Image() {
  return og("Systems, engineered.", "Software studio · Athens");
}
