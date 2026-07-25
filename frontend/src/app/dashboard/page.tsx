'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, Scale, FileText, Search, Home, Trophy, Compass, Settings, LogOut, MapPin } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useComparison } from '@/hooks/useComparison';
import api from '@/lib/api';
import type { University, Application } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { STATUS_LABELS, cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { compareIds } = useComparison();
  const router = useRouter();
  const [shortlist, setShortlist] = useState<University[] | null>(null);
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [recommended, setRecommended] = useState<University[]>([]);
  const [savedSearchCount, setSavedSearchCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api.get<{ items: University[] }>('/universities/me/shortlist').then((d) => setShortlist(d.items)).catch(() => setShortlist([]));
    api.get<{ items: Application[] }>('/auth/applications').then((d) => setApplications(d.items)).catch(() => setApplications([]));
    api.get<{ items: unknown[] }>('/auth/saved-searches').then((d) => setSavedSearchCount(d.items.length)).catch(() => {});
    api.get<{ items: University[] }>('/universities', { limit: 4, sort: 'rating' }).then((d) => setRecommended(d.items)).catch(() => {});
  }, [user]);

  if (loading || !user) return <LoadingSpinner label="Loading dashboard…" className="min-h-screen" />;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:flex flex-col w-[250px] bg-white border-r border-slate-200 p-4 sticky top-0 h-screen">
        <div className="px-2 py-2 mb-4"><Logo size={30} /></div>
        <SidebarLink href="/dashboard" icon={Home} label="Dashboard" active />
        <SidebarLink href="/dashboard#shortlist" icon={Bookmark} label="My Shortlist" />
        <SidebarLink href="/compare" icon={Scale} label="Compare" />
        <SidebarLink href="/dashboard#applications" icon={FileText} label="Applications" />
        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-extrabold px-3 mt-5 mb-1.5">Explore</div>
        <SidebarLink href="/programs" icon={Search} label="Browse Courses" />
        <SidebarLink href="/contact" icon={Trophy} label="Scholarships" />
        <SidebarLink href="/universities" icon={Compass} label="Universities" />
        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-extrabold px-3 mt-5 mb-1.5">Account</div>
        <SidebarLink href="/dashboard#profile" icon={Settings} label="Profile Settings" />
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-full">
        <h1 className="text-[22px] font-extrabold text-ink-900 mb-1">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-[14px] mb-6">Let&apos;s continue your educational journey</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard icon={Bookmark} tone="bg-primary-100 text-primary-600" value={shortlist?.length ?? '—'} label="My Shortlist" />
          <StatCard icon={Scale} tone="bg-red-100 text-red-600" value={compareIds.length} label="Compare List" />
          <StatCard icon={FileText} tone="bg-emerald-100 text-emerald-600" value={applications?.length ?? '—'} label="Applications" />
          <StatCard icon={Search} tone="bg-amber-100 text-amber-700" value={savedSearchCount} label="Saved Searches" />
        </div>

        <section id="shortlist" className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px] text-ink-900">My Shortlist</h3>
            <Link href="/compare" className="text-primary-600 font-bold text-[13px]">Compare →</Link>
          </div>
          {shortlist === null ? (
            <LoadingSpinner />
          ) : shortlist.length === 0 ? (
            <EmptyRow icon="📌" text="You haven't shortlisted any universities yet." linkHref="/universities" linkLabel="Browse universities →" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shortlist.map((u) => <MiniUniCard key={u.id} university={u} />)}
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px] text-ink-900">Recommended for You</h3>
            <Link href="/universities" className="text-primary-600 font-bold text-[13px]">View All</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommended.map((u) => <MiniUniCard key={u.id} university={u} />)}
          </div>
        </section>

        <section id="applications" className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px] text-ink-900">My Applications</h3>
          </div>
          {applications === null ? (
            <LoadingSpinner />
          ) : applications.length === 0 ? (
            <EmptyRow icon="📄" text="No applications yet." linkHref="/universities" linkLabel="Start one →" />
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {applications.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3 text-[13.3px]">
                  <span>{a.course?.title || 'General Application'} — {a.university.name}</span>
                  <span className={cn('text-[11px] font-extrabold px-2.5 py-1 rounded-full',
                    a.status === 'ADMITTED' ? 'bg-emerald-100 text-emerald-700' : a.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700')}>
                    {STATUS_LABELS[a.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon: Icon, label, active }: { href: string; icon: typeof Home; label: string; active?: boolean }) {
  return (
    <Link href={href} className={cn('flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.4px] font-semibold mb-0.5', active ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
      <Icon size={16} /> {label}
    </Link>
  );
}

function StatCard({ icon: Icon, tone, value, label }: { icon: typeof Bookmark; tone: string; value: string | number; label: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <span className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', tone)}><Icon size={16} /></span>
      <div className="text-[22px] font-extrabold text-ink-900">{value}</div>
      <div className="text-[12px] text-slate-500">{label}</div>
    </div>
  );
}

function MiniUniCard({ university }: { university: University }) {
  return (
    <Link href={`/universities/${university.slug}`} className="border border-slate-200 rounded-xl p-3.5 hover:shadow-card transition-shadow">
      <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold mb-2">
        {university.name.slice(0, 2).toUpperCase()}
      </span>
      <h5 className="font-bold text-[12.8px] text-ink-900 leading-snug mb-1 line-clamp-2">{university.name}</h5>
      <div className="flex items-center gap-1 text-[10.5px] text-slate-400 mb-1.5"><MapPin size={10} /> {university.location}</div>
      <StarRating rating={university.rating} size={11} showValue={false} />
    </Link>
  );
}

function EmptyRow({ icon, text, linkHref, linkLabel }: { icon: string; text: string; linkHref: string; linkLabel: string }) {
  return (
    <div className="text-center py-8 text-slate-500">
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-[13.5px]">{text} <Link href={linkHref} className="text-primary-600 font-bold">{linkLabel}</Link></p>
    </div>
  );
}
