/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        royal: {
          ivory: '#FFFFF0',
          pearl: '#FDFCF5',
          cream: '#FFFDD0',
          nude: '#E3BC9A',
          powder: '#FADADD',
          champagne: '#F7E7CE',
          gold: '#D4AF37',
          goldLight: '#F4E4BC',
          brown: '#5C4033',
        },
        dark: {
          velvet: '#1A1110',
          brown: '#2C1B18',
          champagne: '#B68E6E',
          gold: '#D4AF37',
          goldLight: '#FFD700',
          rose: '#B76E79',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}