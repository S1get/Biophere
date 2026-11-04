/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Тёплая основа
        cream: { DEFAULT: '#FBF7F1', 50: '#FEFCF9', 100: '#FBF7F1', 200: '#F4ECE1', 300: '#EADDCB' },
        ink: { DEFAULT: '#1D2B30', soft: '#43555B', mute: '#6B7B80' },
        // Фирменная бирюза Биосферы (#0285a2) и зелень (#4caf50)
        teal: {
          50: '#EAF6F8', 100: '#CDEBF0', 200: '#9AD5E0', 300: '#5FB9CA', 400: '#2A9DB4',
          500: '#0285A2', 600: '#036C84', 700: '#08576A', 800: '#0B4655', 900: '#0C3843',
        },
        leaf: {
          50: '#EEF7EE', 100: '#D6EDD7', 200: '#B0DCB2', 300: '#82C686', 400: '#5DB262',
          500: '#4CAF50', 600: '#3B8F3F', 700: '#327235', 800: '#2B5B2E', 900: '#244B27',
        },
        peach: { 100: '#FDEBDD', 200: '#F9D3B6', 300: '#F4B488', 400: '#EE9560', 500: '#E37A3F' },
        alert: { 50: '#FDF0EE', 100: '#FADCD7', 500: '#D94A38', 600: '#BE3B2B', 700: '#9C2F22' },
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(29,43,48,.04), 0 8px 24px -8px rgba(29,43,48,.10)',
        lift: '0 2px 4px rgba(29,43,48,.04), 0 24px 48px -16px rgba(29,43,48,.20)',
        glow: '0 10px 30px -10px rgba(2,133,162,.55)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulse_ring: {
          '0%': { boxShadow: '0 0 0 0 rgba(217,74,56,.55)' },
          '70%': { boxShadow: '0 0 0 10px rgba(217,74,56,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(217,74,56,0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .4s ease-out both',
        'scale-in': 'scale-in .25s cubic-bezier(.2,.7,.2,1) both',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse_ring 2s infinite',
        marquee: 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [],
}
