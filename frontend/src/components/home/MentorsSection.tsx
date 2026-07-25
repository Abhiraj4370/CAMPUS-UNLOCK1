'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { resolveFileUrl } from '@/lib/api';
import type { Mentor } from '@/types';
import { initials } from '@/lib/utils';
import { Users } from 'lucide-react';

export function MentorsSection() {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    api.get<{ items: Mentor[] }>('/mentors').then((d) => setMentors(d.items)).catch(() => setMentors([]));
  }, []);

  if (!mentors.length) return null;

  return (
    <section className="max-w-[1260px] mx-auto px-6 py-14">
      <div className="text-center mb-9">
        <h2 className="text-[26px] font-extrabold text-ink-900">Talk to a Verified Mentor</h2>
        <p className="text-slate-500 text-[14.5px] mt-1">Free 1:1 guidance from counsellors who've helped thousands of students</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mentors.slice(0, 4).map((m) => (
          <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-card transition-shadow">
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveFileUrl(m.photo)} alt={m.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
            ) : (
              <span className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-violet-600 text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                {initials(m.name)}
              </span>
            )}
            <h4 className="font-bold text-[14.5px] text-ink-900">{m.name}</h4>
            <p className="text-[12px] text-slate-500 mb-2">{m.designation}</p>
            {m.specialty && <span className="inline-block bg-slate-100 text-slate-600 text-[10.5px] font-bold px-2.5 py-1 rounded-full mb-3">{m.specialty}</span>}
            <div className="flex items-center justify-center gap-1 text-[11.5px] text-slate-500 font-semibold mb-4">
              <Users size={12} /> {m.studentsHelped.toLocaleString('en-IN')}+ students helped
            </div>
            <Link href="/contact" className="block border border-slate-200 rounded-xl py-2.5 text-[13px] font-bold text-ink-900 hover:border-primary-500 hover:text-primary-600">
              Book a Session
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
