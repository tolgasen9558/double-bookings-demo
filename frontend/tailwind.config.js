/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}" ],
  theme: {
    extend: {
      colors: {
        sk: { orange: '#FE9901', green: '#1F613F', text: '#2C3E50' }
      },
    },
  },
  plugins: [],
}