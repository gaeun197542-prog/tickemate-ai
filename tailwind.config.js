/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F1B35',
        'navy-light': '#162040',
        'navy-card': '#1A2845',
        accent: '#0ea5e9',
        'accent-bright': '#38bdf8',
      },
    },
  },
  plugins: [],
}

