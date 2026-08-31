export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#080608',
          800: '#0D070A',
          700: '#120A10',
          600: '#1A0F16',
        },
        cherry: {
          900: '#3B0715',
          800: '#720D25',
          700: '#A51235',
        },
        rose: {
          400: '#FF5C8A',
          300: '#F28BA8',
          200: '#FFD1DC',
        },
        muted: '#A8A0A5',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Inter', '"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cherry: '0 0 0 1px rgba(255,92,138,0.35), 0 18px 50px -20px rgba(165,18,53,0.75)',
        glow: '0 0 32px -6px rgba(255,92,138,0.5)',
        poster: '0 24px 60px -24px rgba(0,0,0,0.9)',
      },
      transitionTimingFunction: {
        cine: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(6%, -4%, 0) scale(1.12)' },
        },
        driftAlt: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '50%': { transform: 'translate3d(-7%, 5%, 0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        drift: 'drift 26s ease-in-out infinite',
        'drift-alt': 'driftAlt 34s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
}
