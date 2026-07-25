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

const INTERESTS = ['engineering', 'management', 'computer_applications', 'data_science', 'commerce', 'not_sure'];
const INTEREST_LABELS: Record<string, string> = {
  engineering: 'Engineering', management: 'Management', computer_applications: 'Computer Applications',
  data_science: 'Data Science / AI', commerce: 'Commerce', not_sure: 'Not sure yet',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', interestArea: 'not_sure' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      showToast('Account created!', 'success');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-sky-500 to-indigo-700 text-white p-12">
        <Link href="/"><Logo dark size={32} /></Link>
        <div>
          <h1 className="text-white text-[30px] font-extrabold leading-tight mb-3">Start your journey to the right university.</h1>
          <p className="text-white/85 text-[15px] max-w-[380px]">Create a free account to shortlist universities, compare courses, and track applications in one place.</p>
        </div>
        <div className="flex gap-5 text-[12.5px] text-white/85 font-semibold">
          <span>✅ Free forever</span><span>✅ No spam</span><span>🔒 Secure</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-6"><Link href="/"><Logo size={32} /></Link></div>
          <h2 className="text-[22px] font-extrabold text-ink-900 mb-1">Create your account</h2>
          <p className="text-slate-500 text-[13.5px] mb-5">
            Already have an account? <Link href="/auth/signin" className="text-primary-600 font-bold">Log in</Link>
          </p>

          {error && <p className="text-red-600 text-[13px] font-semibold mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Full Name</label>
              <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Email Address</label>
              <input type="email" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">I&apos;m interested in</label>
              <select className={inputClass} value={form.interestArea} onChange={(e) => setForm({ ...form, interestArea: e.target.value })}>
                {INTERESTS.map((i) => <option key={i} value={i}>{INTEREST_LABELS[i]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Password</label>
              <input type="password" required minLength={6} className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" loading={submitting} fullWidth>Create Account →</Button>
          </form>
          <p className="text-[11px] text-slate-400 mt-4 text-center">By signing up, you agree to our Terms and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
