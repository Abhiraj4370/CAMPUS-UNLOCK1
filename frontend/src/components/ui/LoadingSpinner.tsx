import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-10 text-slate-400', className)}>
      <Loader2 className="animate-spin text-primary-500" size={28} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="skeleton h-36 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}
