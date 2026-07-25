'use client';

import { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface AdminUser {
  id: string; name: string; email: string; phone?: string; interestArea?: string; createdAt: string;
  _count: { shortlist: number; applications: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);

  useEffect(() => {
    api.get<{ items: AdminUser[] }>('/admin/users').then((d) => setUsers(d.items)).catch(() => setUsers([]));
  }, []);

  const columns: Column<AdminUser>[] = [
    { header: 'Name', accessor: (u) => <strong>{u.name}</strong> },
    { header: 'Email', accessor: (u) => u.email },
    { header: 'Phone', accessor: (u) => u.phone || '—' },
    { header: 'Interest', accessor: (u) => u.interestArea || '—' },
    { header: 'Joined', accessor: (u) => formatDate(u.createdAt) },
    { header: 'Shortlist', accessor: (u) => u._count.shortlist },
    { header: 'Applications', accessor: (u) => u._count.applications },
  ];

  return (
    <div>
      <h1 className="text-[20px] font-extrabold text-ink-900 mb-5">Registered Users</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <DataTable columns={columns} rows={users || []} rowKey={(u) => u.id} loading={users === null} emptyMessage="No registered users yet." />
      </div>
    </div>
  );
}
