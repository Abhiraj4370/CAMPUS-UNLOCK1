'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { resolveFileUrl } from '@/lib/api';
import type { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import { Newspaper } from 'lucide-react';

export function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.get<{ items: BlogPost[] }>('/blogs', { limit: 3 }).then((d) => setPosts(d.items)).catch(() => setPosts([]));
  }, []);

  if (!posts.length) return null;

  return (
    <section className="max-w-[1260px] mx-auto px-6 py-14">
      <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
        <div>
          <h2 className="text-[26px] font-extrabold text-ink-900">Latest From the Blog</h2>
          <p className="text-slate-500 text-[14.5px] mt-1">Guides and career advice to help you choose well</p>
        </div>
        <Link href="/blogs" className="text-primary-600 font-bold text-sm hover:underline">View All Posts →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {posts.map((p) => (
          <Link key={p.id} href={`/blogs/${p.slug}`} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all">
            <div className="aspect-[16/10] bg-gradient-to-br from-sky-100 to-violet-100 flex items-center justify-center overflow-hidden">
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveFileUrl(p.cover)} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <Newspaper size={28} className="text-primary-400" />
              )}
            </div>
            <div className="p-4">
              <span className="text-[11px] font-extrabold text-primary-600 uppercase tracking-wide">{p.category}</span>
              <h4 className="font-bold text-[14.5px] text-ink-900 mt-1.5 mb-2 leading-snug line-clamp-2">{p.title}</h4>
              <p className="text-[11.5px] text-slate-500">{formatDate(p.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
