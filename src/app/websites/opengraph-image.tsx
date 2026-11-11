import { og, ogContentType, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "A website, ready to work. — ZYXEN";

export default function Image() {
  return og("A website, ready to work.", "Up to 5 pages");
}
