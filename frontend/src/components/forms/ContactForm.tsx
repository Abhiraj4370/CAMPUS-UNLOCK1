'use client';

import { FormEvent, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-colors';

export function ContactForm() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/leads', { name: form.name, email: form.email, purpose: 'CONTACT', message: `[${form.subject}] ${form.message}` });
      showToast("Message sent! We'll get back to you soon.", 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Could not send your message — please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Full Name</label>
        <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Email Address</label>
        <input type="email" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Subject</label>
        <input required className={inputClass} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Message</label>
        <textarea rows={4} required className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <Button type="submit" loading={submitting} fullWidth>Send Message</Button>
    </form>
  );
}
