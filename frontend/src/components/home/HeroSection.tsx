'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Users, BookOpen, Star, ShieldCheck, Sparkles, Percent, Headset, Plane, Leaf } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';

const POPULAR = ['Online MBA', 'BCA', 'MCA', 'BBA', 'Data Science', 'AI & ML'];

const TRUST_ITEMS = [
  { icon: ShieldCheck, tone: 'bg-primary-100 text-primary-600', title: '100% Trusted', desc: 'Verified Universities' },
  { icon: Headset, tone: 'bg-violet-100 text-violet-600', title: 'Expert Mentors', desc: 'Guidance & Support' },
  { icon: Percent, tone: 'bg-teal-100 text-teal-600', title: 'Compare Easily', desc: 'Find the Best Fit' },
  { icon: Sparkles, tone: 'bg-orange-100 text-orange-600', title: 'Best Offers', desc: 'Save More on Education' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-50 w-full box-border">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-11 items-center pt-8 sm:pt-14 pb-10">
        <div className="w-full max-w-full overflow-hidden">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-700 text-[12px] sm:text-[12.5px] font-bold px-3 py-1.5 rounded-full">
            <Star size={14} className="fill-primary-600" /> India&apos;s #1 Online Education Platform
          </span>

          <h1 className="text-3xl sm:text-[38px] md:text-[48px] font-extrabold leading-[1.2] md:leading-[1.1] mt-4 text-ink-900 break-words">
            Find, Compare &amp; Choose
            <br />
            The <span className="text-gradient">Best Online University</span>
          </h1>

          <p className="text-[15px] sm:text-[16.5px] text-slate-600 max-w-[480px] mt-3">
            Discover top universities, compare courses, connect with expert mentors and achieve your dream career.
          </p>

          <div className="w-full mt-6 max-w-xl">
            <SearchBar className="w-full" />
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-5 text-[12.5px] sm:text-[13px] text-slate-500">
            <span className="font-semibold w-full sm:w-auto mb-1 sm:mb-0">Trending Searches:</span>
            {POPULAR.map((p) => (
              <Link
                key={p}
                href={`/universities?q=${encodeURIComponent(p)}`}
                className="bg-white border border-slate-200 rounded-full px-3 py-1 font-bold text-slate-600 hover:border-primary-400 hover:text-primary-600"
              >
                {p}
              </Link>
            ))}
          </div>
        </div>

        {/* --- Right Side Image Section with Decorative Background --- */}
        {/* Yahan wrapper se 'overflow-hidden' hata diya gaya hai taaki badges na katen */}
        <div className="relative mt-4 lg:mt-0 w-full">

          {/* Main Background Container */}
          <div className="relative rounded-[32px] aspect-[4/3.3] flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-purple-50/50 shadow-sm border border-white overflow-hidden">

            {/* Dashed Line Background */}
            <svg className="absolute w-full h-full text-slate-200 z-0 opacity-60" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 220 C 150 50, 250 280, 360 80" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 8" />
              <path d="M20 80 C 100 200, 300 20, 380 250" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
            </svg>

            {/* Top Right Airplane with Trail */}
            <div className="absolute top-[18%] right-[22%] z-10">
              <svg className="absolute -left-[60px] top-[15px] w-[70px] h-[50px] text-blue-400 opacity-50" viewBox="0 0 70 50" fill="none">
                <path d="M0 50 Q 30 25, 60 5" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
              </svg>
              <div className="text-blue-500 animate-bounce relative" style={{ animationDuration: '4s' }}>
                <Plane size={32} className="transform rotate-45 opacity-90" fill="currentColor" />
              </div>
            </div>

            {/* Bottom Left Plant (Leaf) */}
            <div className="absolute bottom-[15%] left-[15%] text-emerald-400 z-0">
              <Leaf size={42} className="transform -rotate-12 opacity-80" fill="currentColor" />
            </div>

            {/* Bottom Right Sparkles */}
            <div className="absolute bottom-[25%] right-[15%] text-amber-400 z-0 animate-pulse">
              <Sparkles size={38} className="opacity-90" fill="currentColor" />
            </div>

            {/* Ladki ki image */}
            <Image
              src="/hero-girl.png"
              alt="Girl studying online with laptop"
              fill
              className="object-contain drop-shadow-2xl z-10 p-2"
              priority
            />
          </div>

          {/* Floating Badges - Inki position thodi andar (inward) adjust kar di gayi hai */}
          <FloatingBadge icon={<GraduationCap size={17} />} tone="bg-primary-100 text-primary-600" value="250+" label="Universities" className="top-[4%] left-[4%] sm:left-[2%] z-20" />
          <FloatingBadge icon={<BookOpen size={17} />} tone="bg-violet-100 text-violet-600" value="5000+" label="Online Courses" className="top-[40%] left-0 sm:-left-3 z-20" />
          <FloatingBadge icon={<Users size={17} />} tone="bg-emerald-100 text-emerald-600" value="50K+" label="Happy Students" className="top-[8%] right-0 sm:-right-3 z-20" />
          <FloatingBadge icon={<Star size={17} />} tone="bg-amber-100 text-amber-600" value="4.8/5" label="Average Rating" className="bottom-[6%] right-2 sm:right-4 z-20" />
        </div>
      </div>

      <div className="max-w-[1260px] mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-card px-5 sm:px-6 py-5 sm:py-6 grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_ITEMS.map((t) => (
            <div key={t.title} className="flex items-center gap-4">
              <span className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${t.tone}`}>
                <t.icon size={18} />
              </span>
              <div>
                <div className="font-bold text-[14px] sm:text-[13.5px] text-ink-900">{t.title}</div>
                <div className="text-[12.5px] sm:text-[11.5px] text-slate-500">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({ icon, tone, value, label, className }: { icon: React.ReactNode; tone: string; value: string; label: string; className: string }) {
  return (
    <div className={`hidden sm:flex absolute bg-white rounded-2xl shadow-lg2 px-4 py-3 items-center gap-2.5 ${className}`}>
      <span className={`w-9 h-9 rounded-full flex items-center justify-center ${tone}`}>{icon}</span>
      <div className="text-[12.5px] leading-tight">
        <div className="font-extrabold text-ink-900">{value}</div>
        <div className="text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );
}