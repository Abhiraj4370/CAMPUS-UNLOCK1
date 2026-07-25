'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComparisonTable } from '@/components/universities/ComparisonTable';
import { useComparison } from '@/hooks/useComparison';
import api from '@/lib/api';
import type { University } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ComparePage() {
  const { compareIds, removeFromCompare } = useComparison();
  const [universities, setUniversities] = useState<University[] | null>(null);

  useEffect(() => {
    if (compareIds.length === 0) {
      setUniversities([]);
      return;
    }
    api.get<{ items: University[] }>('/universities/compare', { ids: compareIds.join(',') })
      .then((d) => setUniversities(d.items))
      .catch(() => setUniversities([]));
  }, [compareIds]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="max-w-[1260px] mx-auto px-6 py-10 min-h-[60vh]">
        <p className="text-[12px] text-slate-500 mb-2">
          <Link href="/" className="hover:text-primary-600">Home</Link> / Compare
        </p>
        <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
          <div>
            <h1 className="text-[26px] font-extrabold text-ink-900 mb-1">Compare Universities</h1>
            <p className="text-slate-500 text-[14.5px]">Add up to 4 universities to compare side by side</p>
          </div>
          <Link href="/universities" className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg">
            + Add University
          </Link>
        </div>

        {universities === null ? (
          <LoadingSpinner label="Loading comparison…" />
        ) : universities.length >= 2 ? (
          <ComparisonTable universities={universities} onRemove={removeFromCompare} />
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚖️</p>
            <h4 className="font-bold text-ink-900 mb-1">Nothing to compare yet</h4>
            <p className="text-sm max-w-sm mx-auto">
              Add at least 2 universities from the{' '}
              <Link href="/universities" className="text-primary-600 font-bold">universities page</Link> to see a side-by-side comparison.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
