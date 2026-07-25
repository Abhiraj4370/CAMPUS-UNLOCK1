'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Setting } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api.get<{ settings: Setting }>('/admin/settings').then((d) => setSettings(d.settings)).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSubmitting(true);
    try {
      await api.put('/admin/settings', settings);
      showToast('Settings saved', 'success');
    } catch {
      showToast('Could not save settings.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!settings) return <LoadingSpinner />;

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]';

  return (
    <div>
      <h1 className="text-[20px] font-extrabold text-ink-900 mb-5">Site Settings</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-[480px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="text-[12.5px] font-bold block mb-1.5">Site Name</label>
            <input className={inputClass} value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
          </div>
          <div>
            <label className="text-[12.5px] font-bold block mb-1.5">Support Email</label>
            <input type="email" className={inputClass} value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
          </div>
          <div>
            <label className="text-[12.5px] font-bold block mb-1.5">Support Phone</label>
            <input className={inputClass} value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} />
          </div>
          <div>
            <label className="text-[12.5px] font-bold block mb-1.5">Address</label>
            <input className={inputClass} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
          </div>
          <Button type="submit" loading={submitting}>Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
