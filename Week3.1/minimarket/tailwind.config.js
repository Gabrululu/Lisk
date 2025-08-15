/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  darkMode: 'class', // 👈 para toggle manual
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui','Segoe UI','Roboto','Helvetica','Arial','Noto Sans','Apple Color Emoji','Segoe UI Emoji'],
      },
    },
  },
  plugins: [],
}

