'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FilterSidebar, Filters } from '@/components/universities/FilterSidebar';
import { CollegeCard } from '@/components/universities/CollegeCard';
import { CardSkeleton } from '@/components/ui/LoadingSpinner';
import { SearchBar } from '@/components/ui/SearchBar';
import api from '@/lib/api';
import type { University, PaginatedResponse } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { SlidersHorizontal } from 'lucide-react';

export default function UniversitiesPage() {
  return (
    <Suspense fallback={null}>
      <UniversitiesPageInner />
    </Suspense>
  );
}

function UniversitiesPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 350);
  const [filters, setFilters] = useState<Filters>({ type: '', sort: 'rating' });
  const [universities, setUniversities] = useState<University[] | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchUniversities = useCallback(() => {
    setUniversities(null);
    api
      .get<PaginatedResponse<University>>('/universities', {
        q: debouncedQuery, type: filters.type, sort: filters.sort, category: searchParams.get('category') || undefined, limit: 24,
      })
      .then((d) => setUniversities(d.items))
      .catch(() => setUniversities([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters]);

  useEffect(() => { fetchUniversities(); }, [fetchUniversities]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="bg-slate-50 border-b border-slate-200 py-7">
          <div className="max-w-[1260px] mx-auto px-6">
            <p className="text-[12px] text-slate-500 mb-2">
              <a href="/" className="hover:text-primary-600">Home</a> / Universities
            </p>
            <h1 className="text-[26px] font-extrabold text-ink-900 mb-1">Explore Universities</h1>
            <p className="text-slate-600 text-[14.5px]">Browse verified online universities and compare fees, courses and placements.</p>
          </div>
        </div>

        <div className="max-w-[1260px] mx-auto px-6 py-8">
          <SearchBar className="mb-6 max-w-xl" placeholder="Search by university name..." />
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <span className="text-[13px] font-bold text-slate-600">{universities?.length ?? '—'} universities found</span>
            <button onClick={() => setMobileFiltersOpen((o) => !o)} className="flex items-center gap-1.5 text-[13px] font-bold border border-slate-200 rounded-lg px-3 py-2">
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-7">
            <div className={mobileFiltersOpen ? 'block' : 'hidden lg:block'}>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>

            <div>
              <div className="hidden lg:block text-[13px] font-bold text-slate-600 mb-4">{universities?.length ?? '—'} universities found</div>
              {universities === null ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : universities.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <p className="text-4xl mb-3">🔍</p>
                  <h4 className="font-bold text-ink-900 mb-1">No universities match your filters</h4>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {universities.map((u) => <CollegeCard key={u.id} university={u} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
