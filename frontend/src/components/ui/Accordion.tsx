'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem { question: string; answer: ReactNode }

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-[14.5px] text-ink-900 hover:bg-slate-50"
            >
              {item.question}
              <ChevronDown size={18} className={cn('text-slate-400 transition-transform flex-shrink-0', open && 'rotate-180')} />
            </button>
            {open && <div className="px-5 pb-4 text-[13.5px] text-slate-600 leading-relaxed">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
