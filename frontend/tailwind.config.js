/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        surface: {
          DEFAULT: '#0f1117',
          card:    '#161b27',
          border:  '#1e2535',
          hover:   '#1c2333',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                          to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn:   { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
};
