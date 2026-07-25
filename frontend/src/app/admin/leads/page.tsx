'use client';

import { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Lead, PaginatedResponse } from '@/types';
import { STATUS_LABELS, timeAgo } from '@/lib/utils';

const STATUS_OPTIONS = ['NEW', 'IN_PROGRESS', 'RESOLVED'];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const { showToast } = useToast();

  const load = () => api.get<PaginatedResponse<Lead>>('/leads', { limit: 100 }).then((d) => setLeads(d.items)).catch(() => setLeads([]));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/leads/${id}/status`, { status });
      showToast('Status updated', 'success');
      load();
    } catch {
      showToast('Could not update status.', 'error');
    }
  };

  const columns: Column<Lead>[] = [
    { header: 'Name', accessor: (l) => <strong>{l.name}</strong> },
    { header: 'Contact', accessor: (l) => <span>{l.email}<br /><span className="text-slate-400 text-[11px]">{l.phone}</span></span> },
    { header: 'Purpose', accessor: (l) => l.purpose.replace('_', ' ') },
    { header: 'University', accessor: (l) => l.university?.name || '—' },
    { header: 'Time', accessor: (l) => timeAgo(l.createdAt) },
    {
      header: 'Status',
      accessor: (l) => (
        <select
          defaultValue={l.status}
          onChange={(e) => updateStatus(l.id, e.target.value)}
          className="text-[12px] font-bold border border-slate-200 rounded-lg px-2 py-1.5"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-[20px] font-extrabold text-ink-900 mb-5">Leads</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable columns={columns} rows={leads || []} rowKey={(l) => l.id} loading={leads === null} emptyMessage="No leads yet." />
      </div>
    </div>
  );
}
