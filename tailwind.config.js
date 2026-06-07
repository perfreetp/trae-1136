/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3A5C',
          light: '#2a4f7a',
          dark: '#142d49',
        },
        accent: {
          DEFAULT: '#E67E22',
          light: '#f39c12',
          dark: '#d35400',
        },
        sidebar: '#2C3E50',
        content: '#F0F2F5',
      },
    },
  },
  plugins: [],
};
