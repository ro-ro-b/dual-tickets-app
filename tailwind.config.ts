import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ec7691',
          500: '#df4a6e',
          600: '#cc2d56',
          700: '#ab1f45',
          800: '#8f1d3e',
          900: '#791b3a',
          950: '#430a1d',
        },
        gold: {
          50: '#fdfaf0',
          100: '#faf3d8',
          200: '#f5e5b0',
          300: '#efd27e',
          400: '#e8bc4e',
          500: '#d4af37',
          600: '#b8930f',
          700: '#9a7410',
          800: '#7f5d14',
          900: '#6b4d16',
          950: '#3e2a09',
        },
        primary: '#430a1d',
        'primary-consumer': '#791b3a',
        accent: '#d4af37',
        'primary-admin': '#ec5b13',
        'background-light': '#faf7f3',
        'background-dark': '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Public Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
