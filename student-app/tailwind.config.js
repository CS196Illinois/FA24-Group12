/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // adjust to match your file structure
  ],
  theme: {
    extend: {
      colors: {
        'uiuc-orange': '#F47C20',
        'uiuc-blue': '#132F5C',
      },
    },
  },
  plugins: [],
};
