'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, BookOpen, Users2, MessageSquareText, Star, Settings, LogOut, Globe, LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const NAV = [
  { section: null, items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    section: 'Manage',
    items: [
      { href: '/admin/colleges', label: 'Colleges', icon: Building2 },
      { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      { href: '/admin/mentors', label: 'Mentors', icon: Users2 },
      { href: '/admin/blogs', label: 'Blog Posts', icon: MessageSquareText },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    section: 'Users & Enquiries',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users2 },
      { href: '/admin/leads', label: 'Leads', icon: MessageSquareText },
    ],
  },
  {
    section: 'Settings',
    items: [
      { href: '/admin/widgets', label: 'Widgets', icon: LayoutGrid },
      { href: '/admin/settings', label: 'Site Settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <aside className="w-[246px] flex-shrink-0 bg-navy-900 text-slate-300 min-h-screen sticky top-0 flex flex-col p-3">
      <div className="px-2.5 py-2 mb-4">
        <Logo dark size={30} />
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {NAV.map((group, gi) => (
          <div key={gi}>
            {group.section && <div className="text-[10.5px] uppercase tracking-wider text-slate-500 font-extrabold px-3 mt-4 mb-1.5">{group.section}</div>}
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.4px] font-semibold mb-0.5 transition-colors',
                    active ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon size={16} /> {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-3 mt-3 flex flex-col gap-1">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.4px] font-semibold text-slate-300 hover:bg-white/5 hover:text-white">
          <Globe size={16} /> View Website
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.4px] font-semibold text-slate-300 hover:bg-white/5 hover:text-white text-left">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
