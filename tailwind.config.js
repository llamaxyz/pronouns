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
      },
      screens: {
        xs: '520px',
      },
      fontFamily: {
        sans: ['VCR-OSD-MONO', ...defaultTheme.fontFamily.sans],
        heading: ['"Judera-Ring"', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        marquee: 'marquee 200s linear infinite',
        marquee2: 'marquee2 200s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
