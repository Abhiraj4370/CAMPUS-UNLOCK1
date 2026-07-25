'use client';

import { FormEvent, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { ApiClientError } from '@/lib/api';

const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-colors';

export function AuthModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(signinForm.email, signinForm.password);
      showToast('Welcome back!', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not log in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(registerForm);
      showToast('Account created!', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={mode === 'signin' ? 'Log In' : 'Create Account'}>
      {error && <p className="text-red-600 text-[13px] font-semibold mb-3">{error}</p>}
      {mode === 'signin' ? (
        <form onSubmit={handleSignin} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Email</label>
            <input type="email" required className={inputClass} value={signinForm.email} onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Password</label>
            <input type="password" required className={inputClass} value={signinForm.password} onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })} />
          </div>
          <Button type="submit" loading={submitting} fullWidth>Log In</Button>
          <p className="text-center text-[12.5px] text-slate-500">
            New here?{' '}
            <button type="button" onClick={() => setMode('register')} className="text-primary-600 font-bold">Create an account</button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Full Name</label>
            <input required className={inputClass} value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Email</label>
            <input type="email" required className={inputClass} value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Password</label>
            <input type="password" required minLength={6} className={inputClass} value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
          </div>
          <Button type="submit" loading={submitting} fullWidth>Create Account</Button>
          <p className="text-center text-[12.5px] text-slate-500">
            Already registered?{' '}
            <button type="button" onClick={() => setMode('signin')} className="text-primary-600 font-bold">Log in</button>
          </p>
        </form>
      )}
    </Modal>
  );
}
