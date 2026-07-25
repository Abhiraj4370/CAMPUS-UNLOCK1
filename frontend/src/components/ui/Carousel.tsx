'use client';

import { ReactNode, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Carousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      <div ref={trackRef} className="flex gap-5 overflow-x-auto scrollbar-thin scroll-smooth pb-2 snap-x">
        {children}
      </div>
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-card border border-slate-200 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-card border border-slate-200 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
