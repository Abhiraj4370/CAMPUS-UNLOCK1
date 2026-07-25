'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import type { University } from '@/types';
import { formatCurrency, TYPE_LABELS } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';

const ROWS: { label: string; render: (u: University) => React.ReactNode }[] = [
  { label: 'Established', render: (u) => u.establishedYear },
  { label: 'University Type', render: (u) => TYPE_LABELS[u.type] || u.type },
  { label: 'Location', render: (u) => u.location },
  { label: 'NAAC Accreditation', render: (u) => u.naacGrade },
  { label: 'Total Courses', render: (u) => `${u.totalCourses}+` },
  { label: 'Total Students', render: (u) => `${(u.totalStudents / 1000).toFixed(1)}k+` },
  { label: 'Placement Rate', render: (u) => u.placementRate },
  { label: 'Avg. Fees', render: (u) => formatCurrency(u.avgFees) },
];

export function ComparisonTable({ universities, onRemove }: { universities: University[]; onRemove: (id: string) => void }) {
  return (
    <div className="overflow-x-auto scrollbar-thin border border-slate-200 rounded-2xl">
      <table className="w-full border-collapse min-w-[720px]">
        <thead>
          <tr>
            <th className="text-left p-4 bg-slate-50 min-w-[160px] text-[13px] font-bold text-slate-500">Overview</th>
            {universities.map((u) => (
              <th key={u.id} className="p-4 bg-slate-50 text-left align-top min-w-[180px]">
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => onRemove(u.id)} className="self-end text-slate-400 hover:text-red-500">
                    <X size={15} />
                  </button>
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[13px]">
                    {u.name.slice(0, 2).toUpperCase()}
                  </span>
                  <Link href={`/universities/${u.slug}`} className="font-bold text-[13.5px] text-ink-900 hover:text-primary-600 leading-snug">
                    {u.name}
                  </Link>
                  <span className="text-[11.5px] text-slate-500">{u.location}</span>
                  <StarRating rating={u.rating} size={12} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-t border-slate-100">
              <td className="p-4 font-bold text-[13px] text-slate-600 whitespace-nowrap">{row.label}</td>
              {universities.map((u) => (
                <td key={u.id} className="p-4 text-[13.3px] text-ink-900">{row.render(u)}</td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-slate-100">
            <td className="p-4" />
            {universities.map((u) => (
              <td key={u.id} className="p-4">
                <Link href={`/universities/${u.slug}`} className="inline-block border border-slate-200 rounded-lg px-3.5 py-2 text-[12.5px] font-bold text-ink-900 hover:border-primary-500 hover:text-primary-600">
                  View Details
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
