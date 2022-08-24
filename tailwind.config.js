/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mx,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Using https://color-name.com to generate color names
        neutral: colors.neutral,
        avocado: '#56850D',
        'malachite-green': '#4BFB9C',
        ui: {
          black: '#111813',
          onyx: '#3B3835',
          silver: '#AFAFAF',
          space: '#414642',
          sulphur: '#FBDF4B',
          charleston: '#282D2A',
        },
        warm: '#e1d7d5',
        cool: '#d5d7e1',
      },
      screens: {
        xxxs: '425px',
        xxs: '475px',
        xs: '520px',
      },
      fontFamily: {
        sans: ['Aeonik', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        marquee: 'marquee 200s linear infinite',
        marquee2: 'marquee2 200s linear infinite',
        'fade-in-1': '0.5s ease 0.05s 1 normal forwards running fadeIn',
        'fade-in-2': '0.5s ease 0.15s 1 normal forwards running fadeIn',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
