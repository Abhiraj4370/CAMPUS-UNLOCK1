import Link from 'next/link';
import { Target, Users, ShieldCheck, Heart } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const VALUES = [
  { icon: Target, title: 'Our Mission', desc: 'Make quality online education discoverable and comparable, so every student can make an informed choice.' },
  { icon: ShieldCheck, title: 'Verified Information', desc: 'Every university listed is checked for UGC entitlement and current NAAC accreditation before it goes live.' },
  { icon: Users, title: 'Expert Guidance', desc: 'Our mentor network has collectively guided thousands of students to the right program for their goals.' },
  { icon: Heart, title: 'Student First', desc: 'We never accept payment to rank a university higher — recommendations are based on fit, not fees.' },
];

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="bg-gradient-to-br from-sky-50 to-violet-50 border-b border-slate-200 py-14">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <p className="text-[12px] text-slate-500 mb-3"><Link href="/" className="hover:text-primary-600">Home</Link> / About Us</p>
            <h1 className="text-[30px] font-extrabold text-ink-900 mb-3">Helping Students Choose With Confidence</h1>
            <p className="text-slate-600 text-[15.5px] leading-relaxed">
              Campus Unlock is India&apos;s platform for discovering, comparing and enrolling in UGC-approved online
              universities. We built it because choosing an online degree used to mean juggling a dozen browser tabs
              and cold-calling admissions offices — we thought there had to be a better way.
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-6 py-14 grid sm:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4">
              <span className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0"><v.icon size={20} /></span>
              <div>
                <h4 className="font-bold text-[15px] text-ink-900 mb-1">{v.title}</h4>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[1260px] mx-auto px-6 pb-16">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl px-8 py-10 text-center text-white">
            <h3 className="text-white text-[22px] font-extrabold mb-2">Ready to find your fit?</h3>
            <p className="text-white/85 text-[14px] mb-5">Browse 200+ universities or talk to a mentor for free guidance.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/universities" className="bg-white text-primary-700 font-bold text-sm px-5 py-3 rounded-lg">Browse Universities</Link>
              <Link href="/contact" className="border border-white/40 text-white font-bold text-sm px-5 py-3 rounded-lg">Talk to a Mentor</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
