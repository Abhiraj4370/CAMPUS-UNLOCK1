'use client';

import { Search } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar({ placeholder = 'Search for universities, courses, degrees...', className }: { placeholder?: string; className?: string }) {
  const [q, setQ] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/universities?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-card">
        <Search size={18} className="ml-2 text-slate-400 flex-shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
        />
        <button type="submit" className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:brightness-105 flex-shrink-0">
          Search
        </button>
      </div>
    </form>
  );
}
