/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
        },
        teal: {
          500: '#14B8A6', 600: '#0D9488',
        },
        ink: { 900: '#0B1220' },
        navy: { 900: '#0F172A' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(120deg, #0EA5E9, #4F46E5)',
        'grad-brand-2': 'linear-gradient(120deg, #14B8A6, #2563EB)',
      },
      boxShadow: {
        card: '0 8px 24px rgba(20,30,70,0.08)',
        lg2: '0 20px 48px rgba(20,30,70,0.14)',
      },
      borderRadius: {
        xl2: '22px',
      },
    },
  },
  plugins: [],
};
