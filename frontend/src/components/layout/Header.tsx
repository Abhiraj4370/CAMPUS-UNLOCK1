'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, ChevronDown, LayoutDashboard, LogOut, Scale } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useComparison } from '@/hooks/useComparison';
import { initials, cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';
import { Logo } from './Logo';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { compareIds } = useComparison();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1260px] mx-auto px-6 h-[70px] flex items-center justify-between gap-6">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[14.3px] font-semibold pb-1.5 border-b-2 border-transparent transition-colors',
                  pathname === link.href ? 'text-ink-900 border-primary-600' : 'text-slate-600 hover:text-ink-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/universities" aria-label="Search" className="hidden sm:flex w-9 h-9 rounded-lg border border-slate-200 items-center justify-center hover:bg-slate-100">
              <Search size={16} />
            </Link>
            <Link href="/compare" aria-label="Compare" className="relative hidden sm:flex w-9 h-9 rounded-lg border border-slate-200 items-center justify-center hover:bg-slate-100">
              <Scale size={16} />
              {compareIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 bg-slate-100 rounded-full pl-1 pr-3 py-1 font-bold text-[13px]"
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-violet-600 text-white flex items-center justify-center text-[11px]">
                    {initials(user.name)}
                  </span>
                  {user.name.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg2 py-2 z-50" onMouseLeave={() => setMenuOpen(false)}>
                    <Link
                      href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard size={15} /> {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-red-600 hover:bg-red-50">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="hidden sm:inline-flex text-[13.5px] font-bold text-slate-600 hover:text-ink-900 px-2">
                  Login
                </Link>
                <Link href="/programs" className="inline-flex bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-[13.5px] px-4 py-2.5 rounded-lg hover:brightness-105">
                  Apply Now
                </Link>
              </>
            )}

            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
