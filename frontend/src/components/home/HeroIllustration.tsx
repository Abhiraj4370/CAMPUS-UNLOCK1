/**
 * Original flat-style illustration (person + laptop) for the hero section.
 * Hand-built SVG — no external photo/stock-image dependency, so there's
 * no licensing risk and it renders crisply at any size with zero network
 * requests.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 380" className={className} role="img" aria-label="Student studying online with a laptop">
      <defs>
        <linearGradient id="heroSkyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BAE0FF" />
          <stop offset="100%" stopColor="#D9CCFF" />
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect x="0" y="0" width="420" height="380" rx="28" fill="url(#heroSkyGrad)" />

      {/* Decorative dotted trail */}
      <path d="M40 60 Q120 40 160 90 T280 70" stroke="#93C5FD" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" fill="none" opacity="0.8" />
      <circle cx="368" cy="52" r="6" fill="#C4B5FD" opacity="0.8" />
      <circle cx="52" cy="230" r="5" fill="#93C5FD" opacity="0.7" />
      <circle cx="390" cy="220" r="4" fill="#FBCFE8" opacity="0.8" />

      {/* Small graduation-cap glyph, decorative */}
      <g transform="translate(330,90) rotate(-12)" opacity="0.85">
        <path d="M0 6 L20 -2 L40 6 L20 14 Z" fill="#4F46E5" />
        <path d="M8 10 V20 Q20 26 32 20 V10" stroke="#4F46E5" strokeWidth="2" fill="none" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="205" cy="336" rx="118" ry="14" fill="#0F172A" opacity="0.08" />

      {/* Platform / cushion */}
      <rect x="118" y="300" width="176" height="34" rx="17" fill="#FFFFFF" />
      <rect x="118" y="296" width="176" height="16" rx="8" fill="#F1F5F9" />

      {/* Plant, bottom-left */}
      <g transform="translate(70,286)">
        <rect x="-14" y="18" width="28" height="22" rx="4" fill="#E2E8F0" />
        <path d="M0 18 C -14 6 -10 -14 0 -20 C 10 -14 14 6 0 18 Z" fill="#34D399" />
        <path d="M0 18 C 6 4 4 -10 -2 -16" stroke="#059669" strokeWidth="1.5" fill="none" />
      </g>

      {/* Crossed legs (jeans) */}
      <path d="M158 268 Q150 300 176 306 Q206 312 226 300 L222 282 Q198 292 178 286 Q166 282 168 268 Z" fill="#4338CA" />
      <path d="M252 268 Q262 298 234 306 Q206 314 184 300 L190 282 Q212 292 232 284 Q246 278 244 266 Z" fill="#3730A3" />

      {/* Torso / jacket */}
      <path d="M160 190 Q158 150 210 148 Q262 150 260 190 L266 270 Q210 288 154 270 Z" fill="url(#jacketGrad)" />
      {/* Shirt collar */}
      <path d="M196 156 L210 178 L224 156 Q210 148 196 156 Z" fill="#F8FAFC" />

      {/* Left arm to laptop */}
      <path d="M168 200 Q140 220 152 250 Q160 262 182 258" stroke="url(#jacketGrad)" strokeWidth="26" strokeLinecap="round" fill="none" />
      {/* Right arm to laptop */}
      <path d="M252 200 Q280 220 268 250 Q260 262 238 258" stroke="url(#jacketGrad)" strokeWidth="26" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <circle cx="184" cy="259" r="10" fill="#F2B98C" />
      <circle cx="236" cy="259" r="10" fill="#F2B98C" />

      {/* Neck + Head */}
      <rect x="198" y="128" width="24" height="24" rx="8" fill="#F2B98C" />
      <circle cx="210" cy="108" r="34" fill="#F6C9A0" />
      {/* Hair */}
      <path d="M176 104 Q172 66 210 64 Q248 66 244 104 Q244 84 210 82 Q176 84 176 104 Z" fill="#3B2A20" />
      <path d="M176 100 Q172 130 182 146 Q178 118 184 104 Z" fill="#3B2A20" />
      <path d="M244 100 Q248 130 238 146 Q242 118 236 104 Z" fill="#3B2A20" />
      {/* Simple face */}
      <circle cx="200" cy="110" r="2.4" fill="#3B2A20" />
      <circle cx="220" cy="110" r="2.4" fill="#3B2A20" />
      <path d="M202 120 Q210 125 218 120" stroke="#B4633A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Laptop base */}
      <path d="M172 262 L248 262 L258 278 L162 278 Z" fill="#E2E8F0" />
      {/* Laptop screen */}
      <rect x="176" y="222" width="68" height="46" rx="4" fill="#1E293B" transform="rotate(-2 210 245)" />
      <rect x="180" y="226" width="60" height="38" rx="2" fill="url(#screenGrad)" transform="rotate(-2 210 245)" />

      {/* Small sparkles */}
      <g fill="#F59E0B" opacity="0.9">
        <path d="M336 260 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" />
      </g>
      <g fill="#FFFFFF" opacity="0.9">
        <path d="M60 150 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 Z" />
      </g>
    </svg>
  );
}
