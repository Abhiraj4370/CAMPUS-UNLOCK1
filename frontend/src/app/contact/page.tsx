import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/forms/ContactForm';

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="bg-slate-50 border-b border-slate-200 py-7">
          <div className="max-w-[1260px] mx-auto px-6">
            <p className="text-[12px] text-slate-500 mb-2"><Link href="/" className="hover:text-primary-600">Home</Link> / Contact</p>
            <h1 className="text-[26px] font-extrabold text-ink-900 mb-1">Get in Touch</h1>
            <p className="text-slate-600 text-[14.5px]">We&apos;re here to help you with your education journey.</p>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-start gap-3 border-b border-slate-100 py-4">
              <Phone size={18} className="text-primary-500 mt-0.5" />
              <div><div className="font-bold text-[14px] text-ink-900">Call Us</div><div className="text-slate-500 text-[13px]">1800-123-4567</div></div>
            </div>
            <div className="flex items-start gap-3 border-b border-slate-100 py-4">
              <Mail size={18} className="text-primary-500 mt-0.5" />
              <div><div className="font-bold text-[14px] text-ink-900">Email Us</div><div className="text-slate-500 text-[13px]">support@campusunlock.com</div></div>
            </div>
            <div className="flex items-start gap-3 py-4">
              <MapPin size={18} className="text-primary-500 mt-0.5" />
              <div><div className="font-bold text-[14px] text-ink-900">Visit Us</div><div className="text-slate-500 text-[13px]">Noida, Uttar Pradesh, India</div></div>
            </div>
            <div className="aspect-[16/9] rounded-2xl bg-[repeating-linear-gradient(45deg,#F1F5F9,#F1F5F9_10px,#F8FAFC_10px,#F8FAFC_20px)] border border-slate-200 flex items-center justify-center text-slate-400 font-bold mt-4">
              🗺️ Map Preview
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-[16px] text-ink-900 mb-4">Send us a message</h3>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
