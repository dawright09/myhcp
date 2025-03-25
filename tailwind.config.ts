import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dfff',
          300: '#7cc3ff',
          400: '#36a4ff',
          500: '#0078ff', // Main brand color
          600: '#005ecc',
          700: '#0047a5',
          800: '#003380',
          900: '#002966',
        },
        secondary: {
          50: '#f5f6ff',
          100: '#ebeeff',
          200: '#d8ddff',
          300: '#b4bcff',
          400: '#8c8fff',
          500: '#6366f1', // Secondary brand color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: '#FF6B00', // Orange accent color
        neutral: {
          850: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}
export default config 