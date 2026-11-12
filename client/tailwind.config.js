/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pw: {
          orange: '#F26B21',
          'orange-dark': '#D95F2B',
          'orange-light': '#FFF2EA',
          black: '#171717',
          dark: '#111111',
          cream: '#F5EBDD',
          'cream-light': '#FAF5EE',
          'cream-dark': '#EADBC8',
          teal: '#3a8a76',
          'teal-light': '#EBF5F2',
          'teal-dark': '#286354',
          brown: '#3d2308',
          'brown-light': '#664219',
          purple: '#451a75',
          'purple-light': '#F4EEFC'
        }
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Open Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
