'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { ApiClientError } from '@/lib/api';

const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-colors';

export default function SignInPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const loggedIn = await login(form.email, form.password);
      showToast('Welcome back!', 'success');
      router.push(loggedIn.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not log in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-sky-500 to-indigo-700 text-white p-12">
        <Link href="/"><Logo dark size={32} /></Link>
        <div>
          <h1 className="text-white text-[30px] font-extrabold leading-tight mb-3">Welcome back to your college journey.</h1>
          <p className="text-white/85 text-[15px] max-w-[380px]">Pick up right where you left off — your shortlist, applications and recommendations are waiting.</p>
        </div>
        <div className="flex gap-8">
          <div><div className="text-2xl font-extrabold">200+</div><div className="text-[11.5px] text-white/70">Universities</div></div>
          <div><div className="text-2xl font-extrabold">50K+</div><div className="text-[11.5px] text-white/70">Students</div></div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden mb-6"><Link href="/"><Logo size={32} /></Link></div>
          <h2 className="text-[22px] font-extrabold text-ink-900 mb-1">Log in</h2>
          <p className="text-slate-500 text-[13.5px] mb-5">
            New to Campus Unlock? <Link href="/auth/register" className="text-primary-600 font-bold">Create an account</Link>
          </p>

          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3.5 mb-5 text-[12.5px] text-primary-700 leading-relaxed">
            <strong>Demo logins:</strong><br />
            Student — student@campusunlock.com / student123<br />
            Admin — admin@campusunlock.com / admin123
          </div>

          {error && <p className="text-red-600 text-[13px] font-semibold mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Email address</label>
              <input type="email" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Password</label>
              <input type="password" required className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" loading={submitting} fullWidth>Log In →</Button>
          </form>

          <p className="text-center mt-5 text-[12.5px] text-slate-400">
            Administrators log in here too — you&apos;ll land on the admin panel automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
