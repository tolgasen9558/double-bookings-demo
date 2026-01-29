/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}" ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sk: {
          orange: '#FF9F1C',
          green: '#2D6A4F',
          dark: '#1A202C',
          light: '#F7FAFC',
          border: '#E2E8F0',
          text: '#2C3E50'
        }
      },
    },
  },
  plugins: [],
}