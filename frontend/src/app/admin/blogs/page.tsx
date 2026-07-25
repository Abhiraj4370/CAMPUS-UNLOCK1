'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { useToast } from '@/components/ui/Toast';
import api, { resolveFileUrl } from '@/lib/api';
import type { BlogPost, PaginatedResponse } from '@/types';
import { formatDate } from '@/lib/utils';

const EMPTY_FORM = { title: '', category: 'Guides', excerpt: '', body: '', isPublished: true, cover: '' };

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const { showToast } = useToast();

  const load = () => api.get<PaginatedResponse<BlogPost>>('/blogs', { limit: 100 }).then((d) => setPosts(d.items)).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, category: p.category, excerpt: p.excerpt, body: p.body, isPublished: p.isPublished, cover: p.cover || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) { await api.put(`/blogs/${editing.id}`, form); showToast('Post updated', 'success'); }
      else { await api.post('/blogs', form); showToast('Post published', 'success'); }
      setModalOpen(false);
      load();
    } catch {
      showToast('Could not save post.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoverSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const { url } = await api.upload(file);
      setForm((prev: any) => ({ ...prev, cover: url }));
      showToast('Cover image uploaded', 'success');
    } catch {
      showToast('Could not upload cover image.', 'error');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (p: BlogPost) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try { await api.del(`/blogs/${p.id}`); showToast('Post deleted', 'success'); load(); }
    catch { showToast('Could not delete post.', 'error'); }
  };

  const columns: Column<BlogPost>[] = [
    { header: 'Title', accessor: (p) => <strong>{p.title}</strong> },
    { header: 'Category', accessor: (p) => p.category },
    { header: 'Published', accessor: (p) => formatDate(p.publishedAt) },
    { header: 'Status', accessor: (p) => <Badge tone={p.isPublished ? 'green' : 'gray'}>{p.isPublished ? 'Published' : 'Draft'}</Badge> },
  ];

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-extrabold text-ink-900">Blog Posts</h1>
        <Button size="sm" onClick={openAdd}><Plus size={15} /> New Post</Button>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable
          columns={columns} rows={posts || []} rowKey={(p) => p.id} loading={posts === null}
          actions={(p) => (
            <>
              <Link href={`/blogs/${p.slug}`} target="_blank" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Eye size={13} /></Link>
              <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(p)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center"><Trash2 size={13} /></button>
            </>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Post' : 'New Post'} maxWidth="640px">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-bold block mb-1">Cover Image</label>
            <div className="flex items-center gap-3">
              {form.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveFileUrl(form.cover)} alt="" className="w-16 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
              ) : (
                <span className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0"><Upload size={16} /></span>
              )}
              <label className="flex-1 cursor-pointer">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold border border-slate-200 rounded-lg px-3 py-2 hover:border-primary-400">
                  {uploadingCover ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {form.cover ? 'Replace cover' : 'Upload cover'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} disabled={uploadingCover} />
              </label>
            </div>
          </div>
          <div><label className="text-[12px] font-bold block mb-1">Title</label><input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[12px] font-bold block mb-1">Category</label>
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Guides</option><option>Careers</option><option>News</option><option>Scholarships</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-[13px] font-semibold mt-6"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
          </div>
          <div><label className="text-[12px] font-bold block mb-1">Excerpt</label><textarea rows={2} required className={inputClass} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Body</label><RichTextEditor value={form.body} onChange={(v) => setForm({ ...form, body: v })} placeholder="Write your post…" /></div>
          <div className="flex gap-3 mt-1">
            <Button type="submit" loading={submitting} fullWidth>Save Post</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
