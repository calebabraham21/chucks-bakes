/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      gray: {
        50: '#f9f9f9',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
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
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        'bakery-cream': '#fde7ee',
        'bakery-cocoa': '#000000',
        'bakery-light-pink': '#fadadd',
        'bakery-soft-pink': '#ffddeb',
      },
      fontFamily: {
        sans: ['Crimson Text', 'Georgia', 'serif'],
        serif: ['Crimson Text', 'Georgia', 'serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '600',
        semibold: '600',
        bold: '700',
        extrabold: '700',
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

