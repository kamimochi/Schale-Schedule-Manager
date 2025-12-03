/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 何かを描こうとしたけど忘れた
  theme: {
    extend: {
      colors: {
        schale: {
          blue: '#00AEEF', // 良い感じの色
          dark: '#1a1a2e',
        }
      }
    },
  },
  plugins: [],
}