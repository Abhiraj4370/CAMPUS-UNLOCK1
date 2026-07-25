'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';
interface ToastItem { id: number; message: string; variant: ToastVariant }

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-sky-400" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'animate-toast-in flex items-center gap-2 rounded-xl bg-ink-900 text-white text-sm font-medium px-4 py-3 shadow-lg2 min-w-[240px]'
            )}
          >
            {ICONS[t.variant]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-white/60 hover:text-white">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>.');
  return ctx;
}
