'use client';

import { FormEvent, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import type { LeadPurpose } from '@/types';

interface Props {
  universityId?: string;
  universityName?: string;
  purpose?: LeadPurpose;
  title?: string;
  onSuccess?: () => void;
}

export function LeadCaptureForm({ universityId, universityName, purpose = 'ADMISSION', title = 'Admission Enquiry', onSuccess }: Props) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/leads', { ...form, purpose, universityId });
      showToast('Enquiry submitted! Our team will reach out soon.', 'success');
      setForm({ name: '', email: '', phone: '', message: '' });
      onSuccess?.();
    } catch {
      showToast('Could not submit right now — please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <h3 className="font-bold text-[16px] text-ink-900">{title}</h3>
      {universityName && <p className="text-[12.5px] text-slate-500 -mt-2">For {universityName}</p>}
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
        <input type="tel" required className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Message (Optional)</label>
        <textarea rows={3} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <Button type="submit" loading={submitting} fullWidth>Submit Enquiry</Button>
    </form>
  );
}
