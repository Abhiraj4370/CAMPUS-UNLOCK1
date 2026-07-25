'use client';

import { UNIVERSITY_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface Filters {
  type: string;
  sort: string;
}

export function FilterSidebar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-24">
      <h4 className="font-bold text-[14px] text-ink-900 mb-3">University Type</h4>
      <div className="flex flex-col gap-1.5 mb-6">
        {UNIVERSITY_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange({ ...filters, type: t.value })}
            className={cn(
              'text-left px-3 py-2 rounded-lg text-[13.3px] font-semibold transition-colors',
              filters.type === t.value ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h4 className="font-bold text-[14px] text-ink-900 mb-3">Sort By</h4>
      <div className="flex flex-col gap-1.5">
        {[
          { value: 'rating', label: 'Highest Rated' },
          { value: 'fees_asc', label: 'Fees: Low to High' },
          { value: 'fees_desc', label: 'Fees: High to Low' },
          { value: 'name', label: 'Name A–Z' },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => onChange({ ...filters, sort: s.value })}
            className={cn(
              'text-left px-3 py-2 rounded-lg text-[13.3px] font-semibold transition-colors',
              filters.sort === s.value ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
