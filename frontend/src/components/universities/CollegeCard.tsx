'use client';

import Link from 'next/link';
import { Heart, MapPin, Scale } from 'lucide-react';
import type { University } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { useComparison } from '@/hooks/useComparison';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { AuthModal } from '@/components/forms/AuthModal';
import api, { resolveFileUrl } from '@/lib/api';
import { cn, formatCurrency, TYPE_LABELS } from '@/lib/utils';
import { useState } from 'react';

export function CollegeCard({ university, shortlisted = false }: { university: University; shortlisted?: boolean }) {
  const { isComparing, toggleCompare } = useComparison();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isShortlisted, setIsShortlisted] = useState(shortlisted);
  const [authOpen, setAuthOpen] = useState(false);
  const comparing = isComparing(university.id);

  const doShortlist = async () => {
    try {
      const res = await api.post<{ shortlisted: boolean }>(`/universities/${university.id}/shortlist`);
      setIsShortlisted(res.shortlisted);
      showToast(res.shortlisted ? 'Added to shortlist' : 'Removed from shortlist', 'success');
    } catch {
      showToast('Could not update shortlist right now.', 'error');
    }
  };

  const handleShortlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { setAuthOpen(true); return; }
    doShortlist();
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    const { added, limitReached } = toggleCompare(university.id);
    if (limitReached) showToast('You can compare up to 4 universities at a time.', 'info');
    else showToast(added ? 'Added to comparison' : 'Removed from comparison', 'success');
  };

  return (
    <>
      <Link href={`/universities/${university.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all flex flex-col">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center text-primary-500 text-3xl font-extrabold overflow-hidden">
          {university.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveFileUrl(university.banner)} alt={university.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : university.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveFileUrl(university.logo)} alt={university.name} className="w-16 h-16 rounded-xl object-cover shadow-md" />
          ) : (
            university.name.slice(0, 2).toUpperCase()
          )}
          {university.banner && university.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveFileUrl(university.logo)} alt="" className="absolute bottom-2.5 left-2.5 w-9 h-9 rounded-lg object-cover border-2 border-white shadow-md" />
          )}
          <span className="absolute top-2.5 left-2.5 bg-white text-[10.5px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            {TYPE_LABELS[university.type] || university.type}
          </span>
          <button
            onClick={handleShortlist}
            aria-label="Shortlist"
            className={cn('absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center', isShortlisted && 'text-red-500')}
          >
            <Heart size={14} className={cn(isShortlisted && 'fill-red-500')} />
          </button>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-bold text-[15px] text-ink-900 leading-snug">{university.name}</h4>
          <div className="flex items-center gap-1 text-[12px] text-slate-500 mt-1 mb-2">
            <MapPin size={12} /> {university.location}
          </div>
          <StarRating rating={university.rating} reviews={university.totalReviews} size={13} />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-slate-200">
            <div>
              <div className="font-extrabold text-ink-900 text-[14.5px]">{formatCurrency(university.avgFees)}</div>
              <div className="text-[10.5px] text-slate-400 font-semibold">Avg. Fees</div>
            </div>
            <button
              onClick={handleCompare}
              className={cn(
                'flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg border',
                comparing ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-primary-400'
              )}
            >
              <Scale size={12} /> {comparing ? 'Added' : 'Compare'}
            </button>
          </div>
        </div>
      </Link>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={doShortlist} />
    </>
  );
}
