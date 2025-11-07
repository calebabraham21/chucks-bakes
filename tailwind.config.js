/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pink & Brown bakery palette
        'bakery-pink': {
          50: '#fff5f7',
          100: '#ffe5ec',
          200: '#ffd1dc',
          300: '#ffb3c6',
          400: '#ff8ba7',
          500: '#ff6b9d',
          600: '#ed5a8a',
          700: '#d63f6f',
          800: '#b22d5a',
          900: '#8e2449',
        },
        'bakery-brown': {
          50: '#f5f0ef',
          100: '#e8dcd9',
          200: '#d1b8b3',
          300: '#b89088',
          400: '#9e6a60',
          500: '#7d4f45',
          600: '#6a3f37',
          700: '#4a2c2a',
          800: '#3b1f1e',
          900: '#2d1716',
        },
        'bakery-cream': '#fde7ee',
        'bakery-cocoa': '#3b1f1e',
        'bakery-light-pink': '#fadadd',
        'bakery-soft-pink': '#ffddeb',
      },
      fontFamily: {
        sans: ['PT Serif', 'Georgia', 'serif'],
        serif: ['Roboto Serif', 'Georgia', 'serif'],
      },
      fontWeight: {
        normal: '600',
        medium: '700',
        semibold: '800',
        bold: '900',
        black: '900',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(74, 53, 40, 0.08), 0 4px 6px -2px rgba(74, 53, 40, 0.03)',
        'soft-lg': '0 10px 40px -10px rgba(74, 53, 40, 0.12), 0 4px 12px -4px rgba(74, 53, 40, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

