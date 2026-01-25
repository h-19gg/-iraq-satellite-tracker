/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Noto Sans Arabic"', 'Tajawal', 'sans-serif'],
      },
      colors: {
        // ألوان علم العراق
        'iraq-red': '#CE1126',
        'iraq-green': '#007A3D',
        'iraq-black': '#000000',
        'iraq-white': '#FFFFFF',
        
        // ألوان فضائية إضافية
        'space-blue': '#0f172a',
        'satellite-cyan': '#06b6d4',
        'orbit-purple': '#8b5cf6',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}