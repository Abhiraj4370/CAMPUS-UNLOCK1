'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from './Logo';

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] bg-slate-900/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-white shadow-lg2 p-6 flex flex-col gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <Logo size={30} />
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={onClose} className="px-2 py-3 text-[15px] font-semibold text-slate-700 border-b border-slate-100">
            {link.label}
          </Link>
        ))}
        <div className="mt-6 flex flex-col gap-3">
          {user ? (
            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={onClose} className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-center font-bold py-3 rounded-xl">
              {user.role === 'ADMIN' ? 'Admin Panel' : 'My Dashboard'}
            </Link>
          ) : (
            <>
              <Link href="/auth/signin" onClick={onClose} className="border border-slate-200 text-center font-bold py-3 rounded-xl">
                Login
              </Link>
              <Link href="/programs" onClick={onClose} className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-center font-bold py-3 rounded-xl">
                Apply Now
              </Link>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
