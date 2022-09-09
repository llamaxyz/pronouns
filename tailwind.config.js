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
        ui: {
          black: '#111813',
          blue: '#4BB1FB',
          charleston: '#282D2A',
          green: '#4BFB9C',
          purple: '#A637FD',
          silver: '#AFAFAF',
          space: '#414642',
          sulphur: '#FBDF4B',
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
