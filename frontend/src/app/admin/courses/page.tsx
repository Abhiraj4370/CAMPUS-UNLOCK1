'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Course, University, PaginatedResponse } from '@/types';
import { formatCurrency } from '@/lib/utils';

const EMPTY_FORM = { title: '', universityId: '', duration: '2 Years', fee: 100000, rating: 4.5, tag: '', level: 'Postgraduate' };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    api.get<PaginatedResponse<Course>>('/courses', { limit: 100 }).then((d) => setCourses(d.items)).catch(() => setCourses([]));
  };
  useEffect(() => {
    load();
    api.get<PaginatedResponse<University>>('/universities', { limit: 100 }).then((d) => setUniversities(d.items)).catch(() => {});
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FORM, universityId: universities[0]?.id || '' }); setModalOpen(true); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({ title: c.title, universityId: c.universityId, duration: c.duration, fee: c.fee, rating: c.rating, tag: c.tag || '', level: c.level });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/courses/${editing.id}`, form);
        showToast('Course updated', 'success');
      } else {
        await api.post('/courses', form);
        showToast('Course added', 'success');
      }
      setModalOpen(false);
      load();
    } catch {
      showToast('Could not save course.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c: Course) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    try {
      await api.del(`/courses/${c.id}`);
      showToast('Course deleted', 'success');
      load();
    } catch {
      showToast('Could not delete course.', 'error');
    }
  };

  const columns: Column<Course>[] = [
    { header: 'Course', accessor: (c) => <strong>{c.title}</strong> },
    { header: 'University', accessor: (c) => c.university?.name || '—' },
    { header: 'Duration', accessor: (c) => c.duration },
    { header: 'Fee', accessor: (c) => formatCurrency(c.fee) },
    { header: 'Rating', accessor: (c) => `★ ${c.rating}` },
  ];

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-extrabold text-ink-900">Courses</h1>
        <Button size="sm" onClick={openAdd}><Plus size={15} /> Add Course</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable
          columns={columns}
          rows={courses || []}
          rowKey={(c) => c.id}
          loading={courses === null}
          actions={(c) => (
            <>
              <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(c)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center"><Trash2 size={13} /></button>
            </>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Course' : 'Add Course'} maxWidth="480px">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div><label className="text-[12px] font-bold block mb-1">Course Title</label><input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">University</label>
            <select className={inputClass} value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}>
              {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[12px] font-bold block mb-1">Duration</label><input className={inputClass} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
            <div><label className="text-[12px] font-bold block mb-1">Fee (₹)</label><input type="number" className={inputClass} value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[12px] font-bold block mb-1">Level</label>
              <select className={inputClass} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option>
              </select>
            </div>
            <div><label className="text-[12px] font-bold block mb-1">Tag</label>
              <select className={inputClass} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                <option value="">None</option><option value="bestseller">Bestseller</option><option value="popular">Popular</option><option value="trending">Trending</option><option value="top_rated">Top Rated</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={submitting} fullWidth>Save Course</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
