import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4e6',
          100: '#ffe4c2',
          200: '#ffc98a',
          300: '#ffa34d',
          400: '#ff8020',
          500: '#ff6600',
          600: '#e55c00',
          700: '#bf4d00',
          800: '#993d00',
          900: '#7a3100',
          950: '#3d1800',
        },
        accent: {
          50: '#fff0f0',
          100: '#ffdcdc',
          200: '#ffb3b3',
          300: '#ff8080',
          400: '#f55050',
          500: '#ee2d24',
          600: '#d42720',
          700: '#b01e18',
          800: '#8c1812',
          900: '#70120e',
          950: '#3d0907',
        },
      },
      fontFamily: {
        sans: ['var(--font-work-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-rubik)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
