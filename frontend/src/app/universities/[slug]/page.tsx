'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, ShieldCheck, Users, BookOpen, Heart, Scale, Download, Star } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StarRating } from '@/components/ui/StarRating';
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm';
import { AuthModal } from '@/components/forms/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useComparison } from '@/hooks/useComparison';
import { useToast } from '@/components/ui/Toast';
import api, { resolveFileUrl } from '@/lib/api';
import type { University, Widget } from '@/types';
import { cn, formatCurrency, TYPE_LABELS, initials, formatDate } from '@/lib/utils';

const TABS = ['overview', 'courses', 'fees', 'placements', 'reviews', 'contact'] as const;
type Tab = (typeof TABS)[number];

// Fallback shown only if the admin-managed widget list (fetched below) is empty —
// kept in place rather than removed so the section still has content out of the box.
const FEATURES = [
  { icon: '🔄', title: 'Flexible Learning', desc: 'Study at your own pace from anywhere' },
  { icon: '🏅', title: 'Industry Recognition', desc: 'UGC entitled & industry approved degrees' },
  { icon: '👩‍🏫', title: 'Expert Faculty', desc: 'Learn from industry experts and academicians' },
  { icon: '💼', title: 'Placement Support', desc: '100% placement assistance support' },
];

export default function UniversityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [university, setUniversity] = useState<University | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('overview');
  const [shortlisted, setShortlisted] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const { isComparing, toggleCompare } = useComparison();
  const { showToast } = useToast();

  useEffect(() => {
    api.get<{ university: University }>(`/universities/${slug}`).then((d) => setUniversity(d.university)).catch(() => setUniversity(null));
  }, [slug]);

  useEffect(() => {
    api.get<{ items: Widget[] }>('/widgets', { type: 'FEATURE' }).then((d) => setWidgets(d.items)).catch(() => setWidgets([]));
  }, []);

  if (university === undefined) {
    return (
      <>
        <AnnouncementBar /><Header />
        <LoadingSpinner label="Loading university…" className="min-h-[50vh]" />
        <Footer />
      </>
    );
  }

  if (university === null) {
    return (
      <>
        <AnnouncementBar /><Header />
        <div className="text-center py-24">
          <h2 className="text-xl font-bold text-ink-900 mb-2">University not found</h2>
          <Link href="/universities" className="text-primary-600 font-bold">← Browse Universities</Link>
        </div>
        <Footer />
      </>
    );
  }

  const comparing = isComparing(university.id);

  const doShortlist = async () => {
    try {
      const res = await api.post<{ shortlisted: boolean }>(`/universities/${university.id}/shortlist`);
      setShortlisted(res.shortlisted);
      showToast(res.shortlisted ? 'Added to shortlist' : 'Removed from shortlist');
    } catch {
      showToast('Could not update shortlist.', 'error');
    }
  };

  const handleShortlist = () => {
    if (!user) { setAuthOpen(true); return; }
    doShortlist();
  };

  const handleCompare = () => {
    const { added, limitReached } = toggleCompare(university.id);
    if (limitReached) showToast('You can compare up to 4 universities.', 'info');
    else showToast(added ? 'Added to comparison' : 'Removed from comparison');
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="bg-slate-50 border-b border-slate-200 py-3">
          <div className="max-w-[1260px] mx-auto px-6 text-[12px] text-slate-500">
            <Link href="/" className="hover:text-primary-600">Home</Link> / <Link href="/universities" className="hover:text-primary-600">Universities</Link> / {university.name}
          </div>
        </div>

        <div className="max-w-[1260px] mx-auto px-6 pt-6">
          <div className="relative h-[220px] rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-700 overflow-hidden flex items-end p-5">
            {university.banner && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveFileUrl(university.banner)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative flex gap-2 flex-wrap">
              {university.ugcEntitled && <span className="bg-white/95 text-[11px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1"><ShieldCheck size={12} /> UGC Entitled</span>}
              <span className="bg-white/95 text-[11px] font-extrabold px-3 py-1.5 rounded-full">🏅 NAAC {university.naacGrade}</span>
              {university.aicteApproved && <span className="bg-white/95 text-[11px] font-extrabold px-3 py-1.5 rounded-full">✅ AICTE Approved</span>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-card px-6 py-5 -mt-10 relative z-10 flex flex-wrap gap-5 items-center">
            {university.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveFileUrl(university.logo)} alt={university.name} className="w-16 h-16 rounded-2xl object-cover shadow-md flex-shrink-0" />
            ) : (
              <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl flex-shrink-0">
                {university.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="flex-1 min-w-[220px]">
              <h1 className="text-[22px] font-extrabold text-ink-900 mb-1">{university.name}</h1>
              <StarRating rating={university.rating} reviews={university.totalReviews} />
              <p className="text-slate-500 text-[13px] mt-1.5 max-w-[520px]">{university.about.slice(0, 130)}…</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-[13.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5">
                Apply Now
              </button>
              {university.brochureUrl && (
                <a href={university.brochureUrl} className="border border-slate-200 font-bold text-[13.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5">
                  <Download size={14} /> Brochure
                </a>
              )}
              <button onClick={handleCompare} className={cn('border font-bold text-[13.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5', comparing ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-slate-200')}>
                <Scale size={14} /> {comparing ? 'In Compare' : 'Compare'}
              </button>
              <button onClick={handleShortlist} className={cn('w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center', shortlisted && 'text-red-500')}>
                <Heart size={16} className={cn(shortlisted && 'fill-red-500')} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <StatMini icon={<Calendar size={16} />} value={String(university.establishedYear)} label="Est. Year" />
            <StatMini icon={<ShieldCheck size={16} />} value={university.ugcEntitled ? 'Yes' : 'No'} label="UGC Entitled" />
            <StatMini icon={<BookOpen size={16} />} value={`${university.totalCourses}+`} label="Courses" />
            <StatMini icon={<Users size={16} />} value={`${(university.totalStudents / 1000).toFixed(0)}k+`} label="Students" />
          </div>

          <div className="flex gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin mb-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-3 text-[13.5px] font-bold whitespace-nowrap border-b-2 -mb-px capitalize',
                  tab === t ? 'text-primary-700 border-primary-600' : 'text-slate-500 border-transparent hover:text-ink-900'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.7fr_1fr] gap-7 pb-16">
            <div>
              {tab === 'overview' && (
                <div className="grid sm:grid-cols-[1.5fr_1fr] gap-5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="font-bold text-[16px] text-ink-900 mb-2">About {university.name}</h3>
                    <p className="text-slate-600 text-[13.8px] leading-relaxed">{university.about}</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h4 className="font-bold text-[14px] text-ink-900 mb-3">Highlights</h4>
                    <ul className="flex flex-col gap-2 text-[13px] text-slate-700">
                      {['UGC Entitled Online Degrees', 'AICTE Approved Programs', `NAAC ${university.naacGrade} Accredited`, 'Placement Assistance', '24/7 Student Support'].map((h) => (
                        <li key={h} className="flex items-start gap-2">✅ {h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'courses' && (
                <div id="courses" className="bg-white border border-slate-200 rounded-2xl p-5 overflow-x-auto">
                  <h3 className="font-bold text-[16px] text-ink-900 mb-3">All Courses</h3>
                  <table className="w-full text-[13.3px]">
                    <thead>
                      <tr className="text-left text-[11px] uppercase text-slate-500 font-extrabold">
                        <th className="pb-2">Course</th><th className="pb-2">Duration</th><th className="pb-2">Fee</th><th className="pb-2">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(university.courses || []).map((c) => (
                        <tr key={c.id} className="border-t border-slate-100">
                          <td className="py-2.5 font-bold text-ink-900">{c.title}</td>
                          <td className="py-2.5">{c.duration}</td>
                          <td className="py-2.5">{formatCurrency(c.fee)}</td>
                          <td className="py-2.5"><StarRating rating={c.rating} showValue size={12} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'fees' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 overflow-x-auto">
                  <h3 className="font-bold text-[16px] text-ink-900 mb-3">Fee Structure</h3>
                  <table className="w-full text-[13.3px]">
                    <thead>
                      <tr className="text-left text-[11px] uppercase text-slate-500 font-extrabold">
                        <th className="pb-2">Program</th><th className="pb-2">Duration</th><th className="pb-2">Total Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(university.courses || []).map((c) => (
                        <tr key={c.id} className="border-t border-slate-100">
                          <td className="py-2.5">{c.title}</td><td className="py-2.5">{c.duration}</td><td className="py-2.5 font-bold">{formatCurrency(c.fee)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[11.5px] text-slate-400 mt-3">*Fees shown are indicative and may vary by scholarship eligibility.</p>
                </div>
              )}

              {tab === 'placements' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-bold text-[16px] text-ink-900 mb-3">Placement Highlights</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatMini icon={<Star size={16} />} value={university.placementRate} label="Placement Rate" />
                    <StatMini icon={<Users size={16} />} value="150+" label="Recruiters" />
                    <StatMini icon={<BookOpen size={16} />} value={`${(university.totalStudents / 1000).toFixed(0)}k+`} label="Alumni" />
                    <StatMini icon={<Calendar size={16} />} value={String(university.establishedYear)} label="Est. Year" />
                  </div>
                </div>
              )}

              {tab === 'reviews' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-bold text-[16px] text-ink-900 mb-4">Student Reviews</h3>
                  <div className="flex flex-col gap-4">
                    {(university.reviews || []).length === 0 && <p className="text-slate-400 text-sm">No reviews yet.</p>}
                    {(university.reviews || []).map((r) => (
                      <div key={r.id} className="flex gap-3">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                          {initials(r.user?.name || 'U')}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-[13.3px]">{r.user?.name}</strong>
                            <StarRating rating={r.rating} showValue={false} size={12} />
                          </div>
                          <div className="text-[11px] text-slate-400 mb-1">{r.courseName} · {formatDate(r.createdAt)}</div>
                          <p className="text-[13px] text-slate-600">{r.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'contact' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 text-[13.5px]">
                  <div className="flex items-center gap-2"><MapPin size={15} className="text-slate-400" /> {university.location}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5" id="enquiry-form">
                <LeadCaptureForm universityId={university.id} universityName={university.name} />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="font-bold text-[14px] text-ink-900 mb-3">Why Choose {university.name.split(' ')[0]}?</h4>
                <div className="flex flex-col gap-3">
                  {(widgets.length > 0 ? widgets.map((w) => ({ icon: w.icon, title: w.title, desc: w.description || '' })) : FEATURES).map((f) => (
                    <div key={f.title} className="flex gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-[15px] flex-shrink-0">{f.icon}</span>
                      <div>
                        <strong className="text-[12.5px] block">{f.title}</strong>
                        <span className="text-[11px] text-slate-500">{f.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-5 text-center text-white">
                <h4 className="font-bold text-[15px] text-white mb-1">Ready to Start Your Journey?</h4>
                <p className="text-white/85 text-[12.5px] mb-3">Join {university.totalStudents}+ students already learning here.</p>
                <button onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-primary-700 font-bold text-[13px] px-4 py-2.5 rounded-lg">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={doShortlist} />
    </>
  );
}

function StatMini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-3.5 text-center">
      <div className="flex justify-center text-primary-500 mb-1">{icon}</div>
      <div className="font-extrabold text-[16px] text-ink-900">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
