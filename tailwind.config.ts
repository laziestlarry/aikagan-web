import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,js,jsx,mdx}',
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kagan: {
          black: '#0a0a0b',
          darker: '#111113',
          dark: '#1a1a1f',
          card: '#222228',
          border: '#2a2a33',
          muted: '#6b6b7b',
          light: '#c4c4cf',
          white: '#f0f0f5',
          gold: '#c9923a',
          'gold-light': '#e0b04a',
          'gold-dark': '#a07528',
          amber: '#f59e0b',
          accent: '#3b82f6',
          'accent-glow': 'rgba(59,130,246,0.25)',
          success: '#22c55e',
          warn: '#eab308',
          error: '#ef4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,146,58,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(201,146,58,0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
