/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0eeff',
          100: '#e0dcff',
          200: '#c4baff',
          300: '#a08eff',
          400: '#7c5fff',
          500: '#5c35f5',
          600: '#4a1fe8',
          700: '#3b12cc',
          800: '#2d0fa6',
          900: '#1e0a7a',
          950: '#130660',
        },
        dark: {
          900: '#07051a',
          800: '#0d0929',
          700: '#13103a',
          600: '#1a164d',
          500: '#221e60',
        },
        gold: {
          400: '#f5c842',
          500: '#e6b820',
          600: '#cc9f00',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(92,53,245,0.35) 0%, transparent 70%), linear-gradient(180deg, #07051a 0%, #0d0929 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #5c35f5 0%, #3b12cc 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
