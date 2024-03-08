/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['forest'],
  },
}

