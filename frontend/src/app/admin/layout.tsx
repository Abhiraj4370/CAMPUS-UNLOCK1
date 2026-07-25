'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push('/auth/signin');
    else if (user.role !== 'ADMIN') router.push('/dashboard');
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return <LoadingSpinner label="Loading admin panel…" className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
