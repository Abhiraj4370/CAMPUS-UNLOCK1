import { Users, Building2, BookOpen, Headphones } from 'lucide-react';
import { Counter } from '@/components/ui/Counter';

const STATS = [
  { icon: Users, value: 50000, suffix: '+', label: 'Happy Students' },
  { icon: Building2, value: 200, suffix: '+', label: 'Top Universities' },
  { icon: BookOpen, value: 5000, suffix: '+', label: 'Online Courses' },
  { icon: Headphones, value: 100, suffix: '%', label: 'Support' },
];

export function StatsStrip() {
  return (
    <section className="max-w-[1260px] mx-auto px-6 pb-4">
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl px-8 py-9 flex flex-wrap justify-around gap-8 text-white">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-2 text-center">
            <span className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
              <s.icon size={19} />
            </span>
            <span className="text-2xl font-extrabold font-display">
              <Counter value={s.value} suffix={s.suffix} />
            </span>
            <span className="text-[12px] text-white/85 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
