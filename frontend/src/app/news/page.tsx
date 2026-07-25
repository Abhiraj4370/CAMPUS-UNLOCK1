'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/lib/api';
import type { BlogPost, PaginatedResponse } from '@/types';
import { formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/** Reuses the Blog model filtered to the "Careers"/"Guides" categories as a lightweight news feed. */
export default function NewsPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<BlogPost>>('/blogs', { limit: 24 }).then((d) => setPosts(d.items)).catch(() => setPosts([]));
  }, []);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="bg-slate-50 border-b border-slate-200 py-7">
          <div className="max-w-[1260px] mx-auto px-6">
            <p className="text-[12px] text-slate-500 mb-2"><Link href="/" className="hover:text-primary-600">Home</Link> / News</p>
            <h1 className="text-[26px] font-extrabold text-ink-900 mb-1">Education News &amp; Updates</h1>
            <p className="text-slate-600 text-[14.5px]">Admission deadlines, scholarship announcements and platform updates.</p>
          </div>
        </div>
        <div className="max-w-[760px] mx-auto px-6 py-10">
          {posts === null ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((p) => (
                <Link key={p.id} href={`/blogs/${p.slug}`} className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-card transition-shadow">
                  <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0"><Megaphone size={18} /></span>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-primary-600 uppercase">{p.category}</span>
                    <h4 className="font-bold text-[14.5px] text-ink-900 leading-snug my-1">{p.title}</h4>
                    <p className="text-[12px] text-slate-500">{formatDate(p.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
