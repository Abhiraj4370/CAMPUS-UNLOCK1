'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, BookOpen, Users2, MessageSquareText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { LeadsLineChart, StatusDonutChart } from '@/components/admin/DashboardCharts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardHeader } from '@/components/ui/Card';
import { timeAgo } from '@/lib/utils';

interface Stats {
  totalUniversities: number; totalCourses: number; totalUsers: number; totalLeads: number;
  topUniversities: { id: string; name: string; rating: number; _count: { courses: number; leads: number } }[];
  recentLeads: { id: string; name: string; purpose: string; createdAt: string; university?: { name: string } | null }[];
}
interface ChartData { leadsOverview: { labels: string[]; values: number[] }; statusBreakdown: { labels: string[]; values: number[] } }

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);

  useEffect(() => {
    api.get<Stats>('/admin/stats').then(setStats).catch(() => {});
    api.get<ChartData>('/admin/chart-data').then(setChart).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-ink-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-500 text-[13.5px]">Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
        <Link href="/" target="_blank" className="text-primary-600 font-bold text-[13px]">View Website ↗</Link>
      </div>

      {!stats ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building2} tone="bg-primary-100 text-primary-600" value={stats.totalUniversities} label="Total Universities" />
            <StatCard icon={BookOpen} tone="bg-teal-100 text-teal-600" value={stats.totalCourses} label="Total Courses" />
            <StatCard icon={Users2} tone="bg-violet-100 text-violet-600" value={stats.totalUsers} label="Total Users" />
            <StatCard icon={MessageSquareText} tone="bg-amber-100 text-amber-700" value={stats.totalLeads} label="Total Leads" />
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mb-6">
            <Card>
              <CardHeader><h3 className="font-bold text-[15px] text-ink-900">Leads Overview</h3></CardHeader>
              {chart ? <LeadsLineChart data={chart.leadsOverview} /> : <LoadingSpinner />}
            </Card>
            <Card>
              <CardHeader><h3 className="font-bold text-[15px] text-ink-900">Leads by Status</h3></CardHeader>
              {chart ? <StatusDonutChart data={chart.statusBreakdown} /> : <LoadingSpinner />}
            </Card>
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
            <Card>
              <CardHeader>
                <h3 className="font-bold text-[15px] text-ink-900">Top Universities</h3>
                <Link href="/admin/colleges" className="text-primary-600 font-bold text-[12.5px]">View All</Link>
              </CardHeader>
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-[10.5px] uppercase text-slate-500 font-extrabold"><th className="pb-2">University</th><th className="pb-2">Courses</th><th className="pb-2">Leads</th></tr></thead>
                <tbody>
                  {stats.topUniversities.map((u) => (
                    <tr key={u.id} className="border-t border-slate-100">
                      <td className="py-2.5 font-bold text-ink-900">{u.name}</td>
                      <td className="py-2.5">{u._count.courses}</td>
                      <td className="py-2.5">{u._count.leads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <CardHeader><h3 className="font-bold text-[15px] text-ink-900">Recent Leads</h3></CardHeader>
              <div className="flex flex-col divide-y divide-slate-100">
                {stats.recentLeads.map((l) => (
                  <div key={l.id} className="py-2.5 flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {l.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="text-[12.5px]">
                      <div className="font-bold text-ink-900">{l.name}</div>
                      <div className="text-slate-400">{l.purpose.toLowerCase()} · {timeAgo(l.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, tone, value, label }: { icon: typeof Building2; tone: string; value: number; label: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tone}`}><Icon size={16} /></span>
      <div className="text-[22px] font-extrabold text-ink-900">{value.toLocaleString('en-IN')}</div>
      <div className="text-[12px] text-slate-500">{label}</div>
    </div>
  );
}
