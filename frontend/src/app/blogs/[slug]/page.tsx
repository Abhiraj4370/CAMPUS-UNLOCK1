'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import api, { resolveFileUrl } from '@/lib/api';
import type { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    api.get<{ post: BlogPost }>(`/blogs/${slug}`).then((d) => setPost(d.post)).catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) {
    return (<><AnnouncementBar /><Header /><LoadingSpinner label="Loading post…" className="min-h-[50vh]" /><Footer /></>);
  }
  if (post === null) {
    return (
      <>
        <AnnouncementBar /><Header />
        <div className="text-center py-24">
          <h2 className="text-xl font-bold text-ink-900 mb-2">Post not found</h2>
          <Link href="/blogs" className="text-primary-600 font-bold">← Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="max-w-[760px] mx-auto px-6 py-10">
        <p className="text-[12px] text-slate-500 mb-3">
          <Link href="/" className="hover:text-primary-600">Home</Link> / <Link href="/blogs" className="hover:text-primary-600">Blog</Link> / {post.title}
        </p>
        <span className="text-[11px] font-extrabold text-primary-600 uppercase tracking-wide">{post.category}</span>
        <h1 className="text-[28px] font-extrabold text-ink-900 mt-2 mb-2 leading-tight">{post.title}</h1>
        <p className="text-slate-500 text-[13px] mb-6">{formatDate(post.publishedAt)} · by {post.author?.name || 'Campus Unlock Team'}</p>
        <div className="aspect-[16/8] rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 flex items-center justify-center mb-7 overflow-hidden">
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveFileUrl(post.cover)} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <Newspaper size={40} className="text-primary-400" />
          )}
        </div>
        <div className="text-[15.5px] text-slate-700 leading-[1.85] whitespace-pre-line">{post.body}</div>
        <Link href="/blogs" className="inline-block mt-8 border border-slate-200 rounded-lg px-4 py-2.5 text-[13.5px] font-bold text-ink-900 hover:border-primary-400">
          ← Back to Blog
        </Link>
      </main>
      <Footer />
    </>
  );
}
