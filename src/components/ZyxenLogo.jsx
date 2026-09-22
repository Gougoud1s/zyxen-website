/**
 * ZYXEN Brand Identity System — Award-Winning Luxury Studio Standard
 */

export function ZyxenMark({ size = 36, className = '', variant = 'dark' }) {
  const isDark = variant === 'dark';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 group-hover:scale-105 rounded-2xl ${className}`}
      aria-label="ZYXEN Designer Monogram"
    >
      <defs>
        <linearGradient id="goldGradientMark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF5D1"/>
          <stop offset="35%" stopColor="#E2B755"/>
          <stop offset="70%" stopColor="#C29028"/>
          <stop offset="100%" stopColor="#8C6310"/>
        </linearGradient>
        <linearGradient id="bgGradientMark" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#141414" : "#FFFFFF"}/>
          <stop offset="100%" stopColor={isDark ? "#050505" : "#F5F5F5"}/>
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="16" fill="url(#bgGradientMark)" stroke={isDark ? "#262626" : "#E5E5E5"} strokeWidth="1.5"/>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="url(#goldGradientMark)" strokeWidth="0.5" strokeOpacity="0.4"/>

      <g>
        <path d="M 16 18 H 48 L 41 26 H 16 Z" fill="url(#goldGradientMark)"/>
        <path d="M 45 22 L 23 42 H 18 L 40 22 Z" fill="url(#goldGradientMark)"/>
        <path d="M 16 38 L 23 46 H 48 V 38 Z" fill="url(#goldGradientMark)"/>
        <circle cx="48" cy="18" r="3.5" fill="#FFF5D1"/>
      </g>
    </svg>
  );
}

export function ZyxenWordmark({ className = '', variant = 'dark' }) {
  const isDark = variant === 'dark';

  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`font-sans font-black text-xl tracking-tight uppercase ${isDark ? 'text-black' : 'text-white'}`}>
          ZYXEN
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </div>
      <span className="text-[9px] tracking-[0.24em] font-bold text-gray-400 uppercase leading-none mt-1">
        SOFTWARE STUDIO
      </span>
    </div>
  );
}

export default function ZyxenLogo({ size = 38, className = '', variant = 'dark' }) {
  return (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      <ZyxenMark size={size} variant={variant} />
      <ZyxenWordmark variant={variant} />
    </div>
  );
}