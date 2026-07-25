'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function Modal({ open, onClose, title, children, maxWidth = '480px' }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; maxWidth?: string }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-h-[88vh] overflow-y-auto p-6 shadow-lg2"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink-900">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100">
              <X size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
