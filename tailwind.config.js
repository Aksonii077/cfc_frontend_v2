/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          from: '#114DFF',
          to: '#3CE5A7',
          'hover-from': '#0d3eb8',
          'hover-to': '#2bc78f',
        }
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #114DFF, #3CE5A7)',
        'primary-gradient-hover': 'linear-gradient(to right, #0d3eb8, #2bc78f)',
      }
    },
  },
  plugins: [],
}