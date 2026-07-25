'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CardSkeleton } from '@/components/ui/LoadingSpinner';
import { StarRating } from '@/components/ui/StarRating';
import api from '@/lib/api';
import type { Course, PaginatedResponse } from '@/types';
import { cn, formatCurrency, TAG_LABELS } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const TAG_COLORS: Record<string, string> = {
  bestseller: 'bg-amber-500', popular: 'bg-emerald-600', trending: 'bg-violet-600', top_rated: 'bg-red-600',
};
const LEVELS = ['', 'Undergraduate', 'Postgraduate', 'Diploma'];

export default function ProgramsPage() {
  return (
    <Suspense fallback={null}>
      <ProgramsPageInner />
    </Suspense>
  );
}

function ProgramsPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 350);
  const [level, setLevel] = useState('');
  const [courses, setCourses] = useState<Course[] | null>(null);

  const fetchCourses = useCallback(() => {
    setCourses(null);
    api.get<PaginatedResponse<Course>>('/courses', { q: debouncedQuery, level, limit: 24 })
      .then((d) => setCourses(d.items))
      .catch(() => setCourses([]));
  }, [debouncedQuery, level]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="bg-slate-50 border-b border-slate-200 py-7">
          <div className="max-w-[1260px] mx-auto px-6">
            <p className="text-[12px] text-slate-500 mb-2"><Link href="/" className="hover:text-primary-600">Home</Link> / Courses</p>
            <h1 className="text-[26px] font-extrabold text-ink-900 mb-1">Explore Courses</h1>
            <p className="text-slate-600 text-[14.5px]">5000+ courses across engineering, management, computer applications and more.</p>
          </div>
        </div>

        <div className="max-w-[1260px] mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-3 mb-7">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 min-w-[220px] px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
            />
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l || 'all'}
                  onClick={() => setLevel(l)}
                  className={cn('px-3.5 py-2.5 rounded-lg text-[13px] font-bold border', level === l ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-slate-200 text-slate-600')}
                >
                  {l || 'All Levels'}
                </button>
              ))}
            </div>
          </div>

          {courses === null ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-4xl mb-3">📚</p>
              <h4 className="font-bold text-ink-900">No courses match your search</h4>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {courses.map((c) => (
                <Link key={c.id} href={`/universities/${c.university?.slug}#courses`} className="bg-white border border-slate-200 rounded-2xl p-[18px] hover:shadow-card hover:-translate-y-1 transition-all">
                  {c.tag && (
                    <span className={cn('inline-block text-[10px] font-extrabold text-white px-2.5 py-1 rounded-md mb-2.5', TAG_COLORS[c.tag] || 'bg-slate-500')}>
                      {TAG_LABELS[c.tag] || c.tag}
                    </span>
                  )}
                  <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold mb-3">{c.title.slice(0, 1)}</div>
                  <h4 className="font-bold text-[14.5px] text-ink-900 leading-snug mb-1">{c.title}</h4>
                  <p className="text-[12px] text-slate-500 mb-2">{c.university?.name}</p>
                  <StarRating rating={c.rating} reviews={c.totalReviews} size={12} />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-slate-200">
                    <span className="font-extrabold text-primary-700 text-[14.5px]">{formatCurrency(c.fee)}</span>
                    <span className="flex items-center gap-1 text-[12px] text-slate-500 font-semibold"><Clock size={12} /> {c.duration}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
