import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ rating, size = 14, showValue = true, reviews }: { rating: number; size?: number; showValue?: boolean; reviews?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-slate-700">
      <span className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} className={cn(i < rounded ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
        ))}
      </span>
      {showValue && <span>{rating.toFixed(1)}</span>}
      {typeof reviews === 'number' && <span className="text-slate-400 font-medium">({reviews.toLocaleString('en-IN')})</span>}
    </span>
  );
}
