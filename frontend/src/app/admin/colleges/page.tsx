'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import api, { resolveFileUrl } from '@/lib/api';
import type { University, PaginatedResponse } from '@/types';
import { formatCurrency, TYPE_LABELS } from '@/lib/utils';

const EMPTY_FORM = {
  name: '', type: 'PRIVATE', location: '', establishedYear: 2015, about: '', rating: 4.5,
  avgFees: 100000, accreditation: 'A+', naacGrade: 'A+', totalCourses: 20, totalStudents: 5000,
  totalFaculty: 100, placementRate: '85%', isFeatured: false, isActive: true,
  logo: '', banner: '',
};

export default function AdminCollegesPage() {
  const [universities, setUniversities] = useState<University[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<University | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    api.get<PaginatedResponse<University>>('/universities', { limit: 100 }).then((d) => setUniversities(d.items)).catch(() => setUniversities([]));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (u: University) => {
    setEditing(u);
    setForm({
      name: u.name, type: u.type, location: u.location, establishedYear: u.establishedYear, about: u.about,
      rating: u.rating, avgFees: u.avgFees, accreditation: u.accreditation, naacGrade: u.naacGrade,
      totalCourses: u.totalCourses, totalStudents: u.totalStudents, totalFaculty: u.totalFaculty,
      placementRate: u.placementRate, isFeatured: u.isFeatured, isActive: u.isActive,
      logo: u.logo || '', banner: u.banner || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/universities/${editing.id}`, form);
        showToast('University updated', 'success');
      } else {
        await api.post('/universities', form);
        showToast('University added', 'success');
      }
      setModalOpen(false);
      load();
    } catch {
      showToast('Could not save university.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (u: University) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await api.del(`/universities/${u.id}`);
      showToast('University deleted', 'success');
      load();
    } catch {
      showToast('Could not delete university.', 'error');
    }
  };

  const handleFileSelect = async (
    e: ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'banner',
    setUploading: (v: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setForm((prev: any) => ({ ...prev, [field]: url }));
      showToast(`${field === 'logo' ? 'Logo' : 'Banner'} uploaded`, 'success');
    } catch {
      showToast('Could not upload image.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const columns: Column<University>[] = [
    {
      header: 'Logo',
      accessor: (u) =>
        u.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolveFileUrl(u.logo)} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
        ) : (
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
            {u.name.slice(0, 2).toUpperCase()}
          </span>
        ),
    },
    { header: 'University', accessor: (u) => <strong>{u.name}</strong> },
    { header: 'Location', accessor: (u) => u.location },
    { header: 'Type', accessor: (u) => <Badge tone="gray">{TYPE_LABELS[u.type]}</Badge> },
    { header: 'Rating', accessor: (u) => `★ ${u.rating}` },
    { header: 'Fees', accessor: (u) => formatCurrency(u.avgFees) },
    { header: 'Status', accessor: (u) => <Badge tone={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge> },
  ];

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-extrabold text-ink-900">Colleges</h1>
        <Button size="sm" onClick={openAdd}><Plus size={15} /> Add College</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable
          columns={columns}
          rows={universities || []}
          rowKey={(u) => u.id}
          loading={universities === null}
          actions={(u) => (
            <>
              <Link href={`/universities/${u.slug}`} target="_blank" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Eye size={13} /></Link>
              <button onClick={() => openEdit(u)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(u)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center"><Trash2 size={13} /></button>
            </>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit College' : 'Add College'} maxWidth="620px">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="text-[12px] font-bold block mb-1">Name</label><input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>

          <div>
            <label className="text-[12px] font-bold block mb-1">Logo</label>
            <div className="flex items-center gap-3">
              {form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveFileUrl(form.logo)} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
              ) : (
                <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0"><Upload size={16} /></span>
              )}
              <label className="flex-1 cursor-pointer">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold border border-slate-200 rounded-lg px-3 py-2 hover:border-primary-400">
                  {uploadingLogo ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {form.logo ? 'Replace logo' : 'Upload logo'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'logo', setUploadingLogo)} disabled={uploadingLogo} />
              </label>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold block mb-1">Banner Image</label>
            <div className="flex items-center gap-3">
              {form.banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveFileUrl(form.banner)} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
              ) : (
                <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0"><Upload size={16} /></span>
              )}
              <label className="flex-1 cursor-pointer">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold border border-slate-200 rounded-lg px-3 py-2 hover:border-primary-400">
                  {uploadingBanner ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {form.banner ? 'Replace banner' : 'Upload banner'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'banner', setUploadingBanner)} disabled={uploadingBanner} />
              </label>
            </div>
          </div>

          <div><label className="text-[12px] font-bold block mb-1">Type</label>
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="GOVERNMENT">Government</option><option value="PRIVATE">Private University</option><option value="DEEMED">Deemed University</option>
            </select>
          </div>
          <div><label className="text-[12px] font-bold block mb-1">Location</label><input required className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Established Year</label><input type="number" className={inputClass} value={form.establishedYear} onChange={(e) => setForm({ ...form, establishedYear: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Rating</label><input type="number" step="0.1" min="0" max="5" className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Avg. Fees (₹)</label><input type="number" className={inputClass} value={form.avgFees} onChange={(e) => setForm({ ...form, avgFees: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Accreditation</label><input className={inputClass} value={form.accreditation} onChange={(e) => setForm({ ...form, accreditation: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">NAAC Grade</label><input className={inputClass} value={form.naacGrade} onChange={(e) => setForm({ ...form, naacGrade: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Total Courses</label><input type="number" className={inputClass} value={form.totalCourses} onChange={(e) => setForm({ ...form, totalCourses: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Total Students</label><input type="number" className={inputClass} value={form.totalStudents} onChange={(e) => setForm({ ...form, totalStudents: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Total Faculty</label><input type="number" className={inputClass} value={form.totalFaculty} onChange={(e) => setForm({ ...form, totalFaculty: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Placement Rate</label><input className={inputClass} value={form.placementRate} onChange={(e) => setForm({ ...form, placementRate: e.target.value })} /></div>
          <div className="col-span-2"><label className="text-[12px] font-bold block mb-1">About</label><textarea rows={3} className={inputClass} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <div className="col-span-2 flex gap-3 mt-2">
            <Button type="submit" loading={submitting} fullWidth>Save College</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
