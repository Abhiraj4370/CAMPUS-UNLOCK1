'use client';

import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({ columns, rows, rowKey, actions, emptyMessage = 'No records yet.', loading }: Props<T>) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-[13.2px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="text-left text-[11.3px] uppercase tracking-wide text-slate-500 font-extrabold px-3 py-2.5 border-b border-slate-200">
                {col.header}
              </th>
            ))}
            {actions && <th className="border-b border-slate-200 px-3 py-2.5" />}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-10 text-center text-slate-400">Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-10 text-center text-slate-400">{emptyMessage}</td></tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col.header} className={`px-3 py-3 border-b border-slate-100 text-ink-900 ${col.className || ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
                {actions && <td className="px-3 py-3 border-b border-slate-100"><div className="flex items-center gap-1.5">{actions(row)}</div></td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
