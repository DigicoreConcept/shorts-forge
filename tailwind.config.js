/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EF5350',
        'primary-light': '#FFCDD2',
        'primary-dark': '#B71C1C',
        secondary: '#C62828',
        'secondary-light': '#FFEBEE',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        bg: '#FFEBEE',
        'bg-secondary': '#FFF5F5',
        card: '#FFFFFF',
        'card-hover': '#FFF0F0',
        border: '#FFCDD2',
        'border-light': '#EF9090',
        'text-main': '#1A1A1A',
        'text-muted': '#616161',
        'text-subtle': '#9E9E9E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
