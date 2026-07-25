import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { FOOTER_LINKS } from '@/lib/constants';
import { Logo } from './Logo';

const SOCIALS = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-14 pb-6">
      <div className="max-w-[1260px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
          <div>
            <Logo dark size={32} />
            <p className="text-[12.8px] text-slate-400 max-w-[280px] mt-4 leading-relaxed">
              India&apos;s trusted platform to discover, compare and enrol in the best UGC-approved online universities.
            </p>
            <div className="flex gap-2.5 mt-4">
              {SOCIALS.map((s, i) => (
                <a key={i} href={s.href} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700">
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={FOOTER_LINKS.quickLinks} />
          <FooterColumn title="For Students" links={FOOTER_LINKS.forStudents} />

          <div>
            <h5 className="text-white text-[14px] font-bold mb-4">Contact Info</h5>
            <div className="flex items-start gap-2 text-[12.8px] text-slate-400 mb-2.5">
              <Mail size={14} className="mt-0.5 flex-shrink-0" /> support@campusunlock.com
            </div>
            <div className="flex items-start gap-2 text-[12.8px] text-slate-400 mb-2.5">
              <Phone size={14} className="mt-0.5 flex-shrink-0" /> 1800-123-4567
            </div>
            <div className="flex items-start gap-2 text-[12.8px] text-slate-400">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" /> Noida, Uttar Pradesh, India
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-5 text-center text-[12.3px] text-slate-500">
          © 2026 Campus Unlock. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h5 className="text-white text-[14px] font-bold mb-4">{title}</h5>
      <div className="flex flex-col gap-2.5">
        {links.map((l, i) => (
          <Link key={i} href={l.href} className="text-[13.3px] text-slate-400 hover:text-white">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
