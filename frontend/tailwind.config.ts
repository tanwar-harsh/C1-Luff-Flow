import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        primary: {
          DEFAULT: '#2563eb',
          dark: '#004ac6',
          foreground: '#ffffff',
          container: '#eeefff',
        },
        secondary: {
          DEFAULT: '#505f76',
          container: 'var(--color-secondary-container)',
          foreground: 'var(--color-secondary-foreground)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          container: 'var(--color-surface-container)',
          'container-low': 'var(--color-surface-container-low)',
          'container-lowest': 'var(--color-surface-container-lowest)',
          'container-high': 'var(--color-surface-container-high)',
        },
        outline: {
          DEFAULT: 'var(--color-outline)',
          variant: 'var(--color-outline-variant)',
          nav: 'var(--color-outline-nav)',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: 'var(--color-error-container)',
          foreground: 'var(--color-error-foreground)',
        },
        status: {
          open: '#2563eb',
          'in-progress': '#d97706',
          resolved: '#059669',
          closed: '#64748b',
          cancelled: '#e11d48',
        },
        priority: {
          low: '#64748b',
          medium: '#2563eb',
          high: '#d97706',
          critical: '#e11d48',
        },
        'row-hover': 'var(--color-row-hover)',
      },
      fontFamily: {
        sans: ['var(--font-hanken)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'body-md': ['14px', { lineHeight: '20px' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '12px', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      spacing: {
        gutter: '20px',
        margin: '40px',
      },
      maxWidth: {
        content: '1440px',
        form: '640px',
      },
      boxShadow: {
        hover: '0 2px 4px rgba(0, 0, 0, 0.04)',
        modal: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
