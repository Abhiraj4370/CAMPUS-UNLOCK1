import { cn } from '@/lib/utils';

/**
 * Campus Unlock brand mark: an open padlock shackle rendered as a graduation-cap
 * silhouette — "unlocking" education. Built as inline SVG so it's crisp at any
 * size and needs no external image asset.
 */
export function LogoMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
      <defs>
        <linearGradient id="cuLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#cuLogoGrad)" />
      {/* Open padlock shackle */}
      <path
        d="M14 18v-4a6 6 0 0 1 11.2-3"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="12" y="18" width="16" height="12" rx="3" fill="white" />
      <circle cx="20" cy="23.4" r="1.8" fill="#4F46E5" />
      <rect x="19.1" y="24.4" width="1.8" height="3.2" rx="0.9" fill="#4F46E5" />
    </svg>
  );
}

export function Logo({ size = 34, wordmark = true, dark = false, className }: { size?: number; wordmark?: boolean; dark?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-display font-extrabold', className)}>
      <LogoMark size={size} />
      {wordmark && (
        <span className={cn('text-[19px] tracking-tight', dark ? 'text-white' : 'text-ink-900')}>
          Campus<span className="text-gradient">Unlock</span>
        </span>
      )}
    </span>
  );
}
