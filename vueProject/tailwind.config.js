/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee var(--duration, 1s) linear infinite'
        // marquee: 'marquee 25s linear infinite',
        // marquee2: 'marquee2 25s linear infinite'
      },
      keyframes: {
        marquee: {
          to: { transform: 'translateX(-50%)' }
        }
        // marquee: {
        //   '0%': { transform: 'translateX(0%)' },
        //   '100%': { transform: 'translateX(-100%)' }
        // },
        // marquee2: {
        //   '0%': { transform: 'translateX(100%)' },
        //   '100%': { transform: 'translateX(0%)' }
        // }
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        tahiti: {
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        martinique: {
          50: '#f3f4fb',
          100: '#e5e5f4',
          200: '#d0d1ed',
          300: '#b0b3e0',
          400: '#8a8bd0',
          500: '#726ec3',
          600: '#655bb5',
          700: '#5e50a5',
          800: '#524687',
          900: '#3b345f', // oscuro
          950: '#2d2843'
        },
        victoria: {
          50: '#f9f7fd',
          100: '#f1edfa',
          200: '#e5def6',
          300: '#d0c4ee',
          400: '#b49ee2',
          500: '#9678d4',
          600: '#7e5bc2',
          700: '#6a48a8',
          800: '#5e4190', // claro
          900: '#4a3370',
          950: '#2f1b50'
        }

      }
    }
  },
  darkMode: 'class'
  // plugins: [require('daisyui')],
  // daisyui: {
  //   themes: ['light', 'dark', 'cupcake', 'cmyk', 'sunset', 'night']
  // }

}
