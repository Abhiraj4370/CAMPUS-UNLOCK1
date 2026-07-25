'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import api from '@/lib/api';
import type { Course } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { CardSkeleton } from '@/components/ui/LoadingSpinner';
import { cn, formatCurrency, TAG_LABELS } from '@/lib/utils';

const TAG_COLORS: Record<string, string> = {
  bestseller: 'bg-amber-500',
  popular: 'bg-emerald-600',
  trending: 'bg-violet-600',
  top_rated: 'bg-red-600',
};

export function CourseExplorer() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    api.get<{ items: Course[] }>('/courses/trending').then((d) => setCourses(d.items)).catch(() => setCourses([]));
  }, []);

  return (
    <section className="max-w-[1260px] mx-auto px-6 py-14">
      <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
        <div>
          <h2 className="text-[26px] font-extrabold text-ink-900">Featured Online Courses</h2>
          <p className="text-slate-500 text-[14.5px] mt-1">Explore top-rated online programs</p>
        </div>
        <Link href="/programs" className="text-primary-600 font-bold text-sm hover:underline">View All Courses →</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses === null
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : courses.slice(0, 8).map((c) => (
              <Link key={c.id} href={`/universities/${c.university?.slug}#courses`} className="bg-white border border-slate-200 rounded-2xl p-[18px] hover:shadow-card hover:-translate-y-1 transition-all">
                {c.tag && (
                  <span className={cn('inline-block text-[10px] font-extrabold text-white px-2.5 py-1 rounded-md mb-2.5', TAG_COLORS[c.tag] || 'bg-slate-500')}>
                    {TAG_LABELS[c.tag] || c.tag}
                  </span>
                )}
                <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold mb-3">
                  {c.title.slice(0, 1)}
                </div>
                <h4 className="font-bold text-[14.5px] text-ink-900 leading-snug mb-1">{c.title}</h4>
                <p className="text-[12px] text-slate-500 mb-2">{c.university?.name}</p>
                <StarRating rating={c.rating} reviews={c.totalReviews} size={12} />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-slate-200">
                  <span className="font-extrabold text-primary-700 text-[14.5px]">{formatCurrency(c.fee)}</span>
                  <span className="flex items-center gap-1 text-[12px] text-slate-500 font-semibold">
                    <Clock size={12} /> {c.duration}
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
