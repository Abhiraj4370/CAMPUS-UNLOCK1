'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface AdminReview {
  id: string; rating: number; comment: string; courseName?: string; createdAt: string;
  user: { name: string }; university: { name: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const { showToast } = useToast();

  const load = () => api.get<{ items: AdminReview[] }>('/reviews/moderation/all').then((d) => setReviews(d.items)).catch(() => setReviews([]));
  useEffect(() => { load(); }, []);

  const handleDelete = async (r: AdminReview) => {
    if (!confirm('Remove this review?')) return;
    try { await api.del(`/reviews/${r.id}`); showToast('Review removed', 'success'); load(); }
    catch { showToast('Could not remove review.', 'error'); }
  };

  const columns: Column<AdminReview>[] = [
    { header: 'Student', accessor: (r) => r.user.name },
    { header: 'University', accessor: (r) => r.university.name },
    { header: 'Rating', accessor: (r) => `★ ${r.rating}` },
    { header: 'Comment', accessor: (r) => <span className="line-clamp-2 max-w-[320px] inline-block">{r.comment}</span> },
    { header: 'Date', accessor: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <h1 className="text-[20px] font-extrabold text-ink-900 mb-5">Reviews</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable
          columns={columns} rows={reviews || []} rowKey={(r) => r.id} loading={reviews === null} emptyMessage="No reviews yet."
          actions={(r) => <button onClick={() => handleDelete(r)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center"><Trash2 size={13} /></button>}
        />
      </div>
    </div>
  );
}
