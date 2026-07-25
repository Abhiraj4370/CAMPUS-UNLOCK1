'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Widget, WidgetType } from '@/types';

const TYPE_LABELS: Record<WidgetType, string> = { FEATURE: 'Feature Highlight', TRUST_BADGE: 'Trust Badge', STAT: 'Stat Counter' };
const EMPTY_FORM = { widgetType: 'FEATURE' as WidgetType, icon: '⭐', title: '', description: '', position: 1, isActive: true };

export default function AdminWidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Widget | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const load = () => api.get<{ items: Widget[] }>('/widgets/all').then((d) => setWidgets(d.items)).catch(() => setWidgets([]));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (w: Widget) => {
    setEditing(w);
    setForm({ widgetType: w.widgetType, icon: w.icon, title: w.title, description: w.description || '', position: w.position, isActive: w.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) { await api.put(`/widgets/${editing.id}`, form); showToast('Widget updated', 'success'); }
      else { await api.post('/widgets', form); showToast('Widget added', 'success'); }
      setModalOpen(false);
      load();
    } catch {
      showToast('Could not save widget.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (w: Widget) => {
    if (!confirm(`Remove "${w.title}"?`)) return;
    try { await api.del(`/widgets/${w.id}`); showToast('Widget removed', 'success'); load(); }
    catch { showToast('Could not remove widget.', 'error'); }
  };

  const columns: Column<Widget>[] = [
    { header: 'Icon', accessor: (w) => <span className="text-[18px]">{w.icon}</span> },
    { header: 'Title', accessor: (w) => <strong>{w.title}</strong> },
    { header: 'Description', accessor: (w) => <span className="text-slate-500">{w.description || '—'}</span> },
    { header: 'Type', accessor: (w) => <Badge tone="blue">{TYPE_LABELS[w.widgetType]}</Badge> },
    { header: 'Position', accessor: (w) => w.position },
    { header: 'Status', accessor: (w) => <Badge tone={w.isActive ? 'green' : 'gray'}>{w.isActive ? 'Active' : 'Hidden'}</Badge> },
  ];

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-extrabold text-ink-900">Widgets</h1>
          <p className="text-slate-500 text-[13px] mt-1">
            Feature highlights, trust badges and stat counters shown on public pages — e.g. the &ldquo;Why Choose X University?&rdquo;
            panel on every university profile pulls live from the Feature Highlight widgets below.
          </p>
        </div>
        <Button size="sm" onClick={openAdd}><Plus size={15} /> Add Widget</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable
          columns={columns}
          rows={widgets || []}
          rowKey={(w) => w.id}
          loading={widgets === null}
          emptyMessage="No widgets yet — add one to populate site sections like &ldquo;Why Choose X University?&rdquo;."
          actions={(w) => (
            <>
              <button onClick={() => openEdit(w)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(w)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center"><Trash2 size={13} /></button>
            </>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Widget' : 'Add Widget'} maxWidth="440px">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-bold block mb-1">Type</label>
            <select className={inputClass} value={form.widgetType} onChange={(e) => setForm({ ...form, widgetType: e.target.value })}>
              <option value="FEATURE">Feature Highlight</option>
              <option value="TRUST_BADGE">Trust Badge</option>
              <option value="STAT">Stat Counter</option>
            </select>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div><label className="text-[12px] font-bold block mb-1">Icon</label><input className={inputClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⭐" /></div>
            <div><label className="text-[12px] font-bold block mb-1">Title</label><input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          </div>
          <div><label className="text-[12px] font-bold block mb-1">Description</label><input className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="text-[12px] font-bold block mb-1">Display Position</label><input type="number" min="1" className={inputClass} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active / Visible</label>
          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={submitting} fullWidth>Save Widget</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
