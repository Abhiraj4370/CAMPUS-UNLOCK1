'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import api, { resolveFileUrl } from '@/lib/api';
import type { Mentor } from '@/types';
import { initials } from '@/lib/utils';

const EMPTY_FORM = { name: '', designation: '', specialty: '', bio: '', experienceYears: 3, studentsHelped: 500, isActive: true, photo: '' };

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Mentor | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { showToast } = useToast();

  const load = () => api.get<{ items: Mentor[] }>('/mentors').then((d) => setMentors(d.items)).catch(() => setMentors([]));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (m: Mentor) => {
    setEditing(m);
    setForm({
      name: m.name, designation: m.designation, specialty: m.specialty || '', bio: m.bio || '',
      experienceYears: m.experienceYears, studentsHelped: m.studentsHelped, isActive: m.isActive,
      photo: m.photo || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) { await api.put(`/mentors/${editing.id}`, form); showToast('Mentor updated', 'success'); }
      else { await api.post('/mentors', form); showToast('Mentor added', 'success'); }
      setModalOpen(false);
      load();
    } catch {
      showToast('Could not save mentor.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (m: Mentor) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    try { await api.del(`/mentors/${m.id}`); showToast('Mentor removed', 'success'); load(); }
    catch { showToast('Could not remove mentor.', 'error'); }
  };

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const { url } = await api.upload(file);
      setForm((prev: any) => ({ ...prev, photo: url }));
      showToast('Photo uploaded', 'success');
    } catch {
      showToast('Could not upload photo.', 'error');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const columns: Column<Mentor>[] = [
    {
      header: 'Photo',
      accessor: (m) =>
        m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolveFileUrl(m.photo)} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
        ) : (
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-violet-600 text-white flex items-center justify-center text-[11px] font-bold">
            {initials(m.name)}
          </span>
        ),
    },
    { header: 'Name', accessor: (m) => <strong>{m.name}</strong> },
    { header: 'Designation', accessor: (m) => m.designation },
    { header: 'Specialty', accessor: (m) => m.specialty || '—' },
    { header: 'Students Helped', accessor: (m) => m.studentsHelped.toLocaleString('en-IN') },
    { header: 'Status', accessor: (m) => <Badge tone={m.isActive ? 'green' : 'gray'}>{m.isActive ? 'Active' : 'Hidden'}</Badge> },
  ];

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-extrabold text-ink-900">Mentors</h1>
        <Button size="sm" onClick={openAdd}><Plus size={15} /> Add Mentor</Button>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable
          columns={columns}
          rows={mentors || []}
          rowKey={(m) => m.id}
          loading={mentors === null}
          actions={(m) => (
            <>
              <button onClick={() => openEdit(m)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(m)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center"><Trash2 size={13} /></button>
            </>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Mentor' : 'Add Mentor'} maxWidth="460px">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-bold block mb-1">Photo</label>
            <div className="flex items-center gap-3">
              {form.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveFileUrl(form.photo)} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0" />
              ) : (
                <span className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0"><Upload size={16} /></span>
              )}
              <label className="flex-1 cursor-pointer">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold border border-slate-200 rounded-lg px-3 py-2 hover:border-primary-400">
                  {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {form.photo ? 'Replace photo' : 'Upload photo'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} disabled={uploadingPhoto} />
              </label>
            </div>
          </div>
          <div><label className="text-[12px] font-bold block mb-1">Name</label><input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Designation</label><input required className={inputClass} value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Specialty</label><input className={inputClass} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Bio</label><textarea rows={2} className={inputClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[12px] font-bold block mb-1">Years of Experience</label><input type="number" className={inputClass} value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} /></div>
            <div><label className="text-[12px] font-bold block mb-1">Students Helped</label><input type="number" className={inputClass} value={form.studentsHelped} onChange={(e) => setForm({ ...form, studentsHelped: e.target.value })} /></div>
          </div>
          <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active / Visible</label>
          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={submitting} fullWidth>Save Mentor</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
