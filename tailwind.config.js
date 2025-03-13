/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        dark: '#121212',
        light: '#fafafa'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'fade-scale': 'fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'rotate-gradient': 'rotateGradient 8s linear infinite',
        'dash-offset': 'dashOffset 2s linear infinite',
        'draw-path': 'drawPath 2s ease-out forwards',
        'flowing-gradient': 'flowingGradient 3s ease infinite',
        'morph-path': 'morphPath 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        flowingGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        drawPath: {
          to: { strokeDashoffset: '0' },
        },
        glowPulse: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 2px rgba(14, 165, 233, 0.3)) drop-shadow(0 0 5px rgba(14, 165, 233, 0.2))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 5px rgba(14, 165, 233, 0.5)) drop-shadow(0 0 10px rgba(14, 165, 233, 0.3))',
          },
        },
        rotateGradient: {
          '0%': {
            background: 'linear-gradient(0deg, var(--tw-gradient-from), var(--tw-gradient-to))',
          },
          '100%': {
            background: 'linear-gradient(360deg, var(--tw-gradient-from), var(--tw-gradient-to))',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      blur: {
        xs: '2px',
      },
      dropShadow: {
        'glow-sm': '0 0 2px rgba(14, 165, 233, 0.3)',
        'glow': '0 0 5px rgba(14, 165, 233, 0.5)',
        'glow-lg': '0 0 10px rgba(14, 165, 233, 0.7)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}