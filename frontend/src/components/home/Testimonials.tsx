'use client';

import { Carousel } from '@/components/ui/Carousel';
import { StarRating } from '@/components/ui/StarRating';
import { initials } from '@/lib/utils';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Priya Sharma', course: 'Online MBA, Amity University', rating: 5, quote: 'Campus Unlock helped me compare six universities side by side — it saved me weeks of research and I found a program that actually fit my budget.' },
  { name: 'Rahul Verma', course: 'B.Tech, LPU Online', rating: 5, quote: 'The free counselling session cleared every doubt I had about placement records before I committed to a program.' },
  { name: 'Anjali Singh', course: 'MCA, Manipal Online', rating: 5, quote: 'Applying through the platform was seamless — from shortlisting to submitting my application felt effortless.' },
  { name: 'Karan Mehta', course: 'Online MBA, NMIMS Global', rating: 4, quote: "The scholarship finder alone paid for itself — I hadn't realised I qualified for a merit waiver until Campus Unlock flagged it." },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-14">
      <div className="max-w-[1260px] mx-auto px-6">
        <div className="text-center mb-9">
          <h2 className="text-[26px] font-extrabold text-ink-900">What Our Students Say</h2>
          <p className="text-slate-500 text-[14.5px] mt-1">Real stories from students who found their fit through Campus Unlock</p>
        </div>
        <Carousel>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-6 min-w-[300px] max-w-[320px] flex-shrink-0 snap-start">
              <Quote size={22} className="text-primary-200 mb-2" />
              <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4 line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
              <StarRating rating={t.rating} showValue={false} size={13} />
              <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-slate-100">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {initials(t.name)}
                </span>
                <div>
                  <div className="font-bold text-[13px] text-ink-900">{t.name}</div>
                  <div className="text-[11.5px] text-slate-500">{t.course}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
