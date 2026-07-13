import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        foreground: '#191c1e',
        'on-surface-variant': '#434655',
        primary: {
          DEFAULT: '#2563eb',
          dark: '#004ac6',
          foreground: '#ffffff',
          container: '#eeefff',
        },
        secondary: {
          DEFAULT: '#505f76',
          container: '#d0e1fb',
          foreground: '#54647a',
        },
        surface: {
          DEFAULT: '#f7f9fb',
          container: '#eceef0',
          'container-low': '#f2f4f6',
          'container-lowest': '#ffffff',
          'container-high': '#e6e8ea',
        },
        outline: {
          DEFAULT: '#737686',
          variant: '#c3c6d7',
          nav: '#e2e8f0',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          foreground: '#93000a',
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
        'row-hover': '#f1f5f9',
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
