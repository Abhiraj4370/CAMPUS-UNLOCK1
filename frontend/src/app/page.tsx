'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Category, University } from '@/types';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsStrip } from '@/components/home/StatsStrip';
import { CourseExplorer } from '@/components/home/CourseExplorer';
import { MentorsSection } from '@/components/home/MentorsSection';
import { CTABanner } from '@/components/home/CTABanner';
import { Testimonials } from '@/components/home/Testimonials';
import { BlogPreview } from '@/components/home/BlogPreview';
import { FAQSection } from '@/components/home/FAQSection';

const CATEGORY_COLORS = [
  'bg-violet-100 text-violet-600', 'bg-primary-100 text-primary-600', 'bg-teal-100 text-teal-600',
  'bg-orange-100 text-orange-600', 'bg-emerald-100 text-emerald-600', 'bg-sky-100 text-sky-600',
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<University[]>([]);
  const [totalUniversities, setTotalUniversities] = useState(200);

  useEffect(() => {
    api.get<{ items: Category[] }>('/universities/categories/all')
      .then((d) => setCategories(d.items))
      .catch(() => setCategories([]));

    api.get<{ items: University[] }>('/universities/featured')
      .then((d) => setFeatured(d.items))
      .catch(() => setFeatured([]));

    api.get<{ items: University[]; total: number }>('/universities', { limit: 1 })
      .then((d) => setTotalUniversities(d.total || 200))
      .catch(() => { });
  }, []);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />

        {featured.length > 0 && (
          <section className="max-w-[1260px] mx-auto px-4 sm:px-6 pb-14 overflow-hidden relative">
            <p className="text-center text-[13.5px] text-slate-600 font-semibold mb-5">
              Trusted by <span className="text-primary-600 font-extrabold">{totalUniversities}+</span> Leading Universities
            </p>

            {/* CSS for Marquee Animation */}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 30s linear infinite;
                display: flex;
                width: max-content;
              }
              .animate-marquee:hover {
                animation-play-state: paused; 
              }
            `}</style>

            {/* Scrolling Container */}
            <div className="w-full overflow-hidden">
              <div className="animate-marquee gap-4">
                {/* We map the array twice to create a seamless infinite loop */}
                {[...featured, ...featured].map((u, index) => {

                  // Backend URL set kar rahe hain taaki uploaded images fetch ho sakein
                  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

                  // Check kar rahe hain ki image me 'http' laga hai ya nahi, agar nahi toh backend ka URL aage lagayenge
                  const logoPath = u.logo
                    ? (u.logo.startsWith('http') ? u.logo : `${backendUrl}${u.logo.startsWith('/') ? '' : '/'}${u.logo}`)
                    : '/images/logo-192.png'; // Fallback image

                  return (
                    <Link
                      key={`${u.id}-${index}`} // Ensure unique keys
                      href={`/universities/${u.slug}`}
                      className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 min-w-[240px] hover:border-primary-400 hover:shadow-card transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 relative flex-shrink-0 bg-slate-50 rounded flex items-center justify-center overflow-hidden">
                        {/* Standard HTML img tag use kiya hai external database URLs handle karne ke liye */}
                        <img
                          src={logoPath}
                          alt={u.name}
                          className="object-contain p-1 w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = '/images/logo-192.png';
                          }}
                        />
                      </div>
                      <span className="text-[12.5px] font-bold text-ink-900 leading-tight">
                        {u.name.replace(' Online', '').replace(' Online University', '')}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {categories.length > 0 && (
          <section className="max-w-[1260px] mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
              <div>
                <h2 className="text-[26px] font-extrabold text-ink-900">Explore by Category</h2>
                <p className="text-slate-500 text-[14.5px] mt-1">Discover courses in top domains</p>
              </div>
              <Link href="/programs" className="text-primary-600 font-bold text-sm hover:underline">View All Categories →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {categories.map((cat, i) => (
                <Link key={cat.id} href={`/universities?category=${cat.slug}`} className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:-translate-y-1 hover:shadow-card transition-all">
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mx-auto mb-2.5 ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}>
                    {cat.icon}
                  </span>
                  <h4 className="font-bold text-[13.5px] text-ink-900">{cat.name}</h4>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">{cat.courseCountLabel}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <CourseExplorer />
        <CTABanner />
        <StatsStrip />
        <MentorsSection />
        <Testimonials />
        <BlogPreview />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}