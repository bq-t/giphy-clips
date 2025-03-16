/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#1F1F1F',
      },
      fontFamily: {
        jost: ["Jost", 'serif'],
      },
    },
  },
  plugins: [],
}

