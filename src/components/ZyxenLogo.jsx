/**
 * ZYXEN Brand Identity System
 * ─────────────────────────────
 * Slogan: "Systems, Engineered."
 *
 * Logo System:
 * - Primary: ZYXEN wordmark — geometric sans-serif, wide tracking, gold split-X
 * - Symbol: ZX monogram — angular connected node mark
 * - Favicon: Geometric Z with precision cut
 *
 * Brand Colors:
 * - Primary:  hsl(20, 100%, 55%)   — signal orange
 * - Gold:     #AF994D              — precision gold / luxury accent
 * - Base:     #0A0A0C              — deep system black
 */

/** Full wordmark: ZYXEN with engineered X */
export function ZyxenWordmark({ className = '', height = 28, showSlogan = false }) {
  return (
    <svg
      height={height}
      viewBox="0 0 240 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ZYXEN"
    >
      {/* Z */}
      <path d="M4 8H26L8 32H28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Y */}
      <path d="M38 8L48 20L58 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M48 20V32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      {/* X — engineered split: two strokes with a 3px gap at center */}
      <path d="M68 8L78.5 19" stroke="#AF994D" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M81.5 21L91 32" stroke="#AF994D" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M91 8L80.5 19" stroke="#AF994D" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M78.5 21L68 32" stroke="#AF994D" strokeWidth="3.2" strokeLinecap="round"/>
      {/* E */}
      <path d="M101 8H121" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M101 8V32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M101 20H117" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M101 32H121" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      {/* N */}
      <path d="M131 32V8L151 32V8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** ZX symbol / app icon mark */
export function ZyxenMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Zyxen"
    >
      <rect width="40" height="40" rx="10" fill="#0F0F12"/>
      {/* Z top bar */}
      <path d="M8 10H22L11 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Z bottom bar */}
      <path d="M11 20L8 30H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* X — split at center with gold */}
      <path d="M24 10L31.5 19" stroke="#AF994D" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32.5 21L24 30" stroke="#AF994D" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 30L31.5 21" stroke="#AF994D" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32.5 19L24 10" stroke="#AF994D" strokeWidth="2.5" strokeLinecap="round"/>
      {/* center node dot */}
      <circle cx="28" cy="20" r="1.5" fill="#AF994D"/>
    </svg>
  );
}

/** Compact lockup: mark + wordmark (horizontal) */
export default function ZyxenLogo({ height = 28, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ZyxenMark size={Math.round(height * 1.1)} />
      <ZyxenWordmark height={height} />
    </span>
  );
}