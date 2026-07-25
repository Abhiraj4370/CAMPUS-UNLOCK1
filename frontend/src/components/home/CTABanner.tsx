import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="max-w-[1260px] mx-auto px-6 pb-6">
      <div className="bg-gradient-to-r from-teal-500 to-primary-600 rounded-3xl px-8 py-8 flex flex-wrap items-center justify-between gap-5 text-white">
        <div className="flex items-center gap-4">
          <span className="w-[52px] h-[52px] rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={26} />
          </span>
          <div>
            <h3 className="text-white text-[19px] font-extrabold mb-0.5">Not Sure Which Course is Right for You?</h3>
            <p className="text-white/85 text-[13.5px]">Get free career guidance from our expert mentors.</p>
          </div>
        </div>
        <Link href="/contact" className="bg-white text-primary-700 font-bold text-sm px-5 py-3 rounded-lg hover:bg-slate-50 whitespace-nowrap">
          Talk to Mentor →
        </Link>
      </div>
    </section>
  );
}
