/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wellness: {
          green: '#22c55e',
          'green-light': '#86efac',
          'green-dark': '#15803d',
        }
      },
    },
  },
  plugins: [],
}
