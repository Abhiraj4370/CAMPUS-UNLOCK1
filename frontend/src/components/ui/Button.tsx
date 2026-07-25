import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'white';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:brightness-105 hover:-translate-y-0.5',
  outline: 'bg-white border border-slate-200 text-ink-900 hover:border-primary-500 hover:text-primary-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  white: 'bg-white text-primary-700 hover:bg-slate-50 shadow-md',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
};

const BASE = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  href?: undefined;
}

interface ButtonAsLink extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> {
  href: string;
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', loading, fullWidth, children, className } = props;
  const classes = cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth && 'w-full', className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, loading: _l, fullWidth: _fw, children: _c, className: _cn, ...anchorRest } = props;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </Link>
    );
  }

  const { variant: _v2, size: _s2, loading: _l2, fullWidth: _fw2, children: _c2, className: _cn2, ...buttonRest } = props;
  return (
    <button className={classes} disabled={loading || buttonRest.disabled} {...buttonRest}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
