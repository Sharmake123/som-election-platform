/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{pages,components,utils}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0D47A1',
        'brand-light-blue': '#1976D2',
        'brand-accent': '#42A5F5',
        'brand-dark': '#1A237E',
      },
    },
  },
  plugins: [],
}