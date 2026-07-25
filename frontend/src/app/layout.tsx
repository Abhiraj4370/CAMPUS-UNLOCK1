import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { ToastProvider } from '@/components/ui/Toast';

const display = localFont({
  src: '../fonts/PlusJakartaSans-Variable.ttf',
  variable: '--font-display',
  display: 'swap',
  weight: '500 800',
});

const body = localFont({
  src: '../fonts/Inter-Variable.ttf',
  variable: '--font-body',
  display: 'swap',
  weight: '400 700',
});

export const metadata: Metadata = {
  title: 'Campus Unlock — Find, Compare & Choose The Best Online University',
  description:
    'Compare 200+ UGC-approved online universities and 5000+ courses across MBA, BBA, MCA, BCA and more. Get free 1:1 guidance from verified mentors — only on Campus Unlock.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-white text-slate-800 antialiased">
        <AuthProvider>
          <ComparisonProvider>
            <ToastProvider>{children}</ToastProvider>
          </ComparisonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
