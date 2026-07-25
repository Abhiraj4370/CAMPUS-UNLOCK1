import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'violet';

const TONE_CLASSES: Record<Tone, string> = {
  blue: 'bg-primary-100 text-primary-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-slate-100 text-slate-600',
  violet: 'bg-violet-100 text-violet-700',
};

export function Badge({ tone = 'gray', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold', TONE_CLASSES[tone], className)}>
      {children}
    </span>
  );
}
