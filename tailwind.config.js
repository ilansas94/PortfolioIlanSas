/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './Essets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(240, 249, 255)',
          100: 'rgb(224, 242, 254)',
          200: 'rgb(186, 230, 253)',
          300: 'rgb(125, 211, 252)',
          400: 'rgb(56, 189, 248)',
          500: 'rgb(14, 165, 233)',
          600: 'rgb(2, 132, 199)',
          700: 'rgb(3, 105, 161)',
          800: 'rgb(7, 89, 133)',
          900: 'rgb(12, 74, 110)'
        },
        neutral: {
          50: 'rgb(248, 250, 252)',
          100: 'rgb(241, 245, 249)',
          200: 'rgb(226, 232, 240)',
          300: 'rgb(203, 213, 225)',
          400: 'rgb(148, 163, 184)',
          500: 'rgb(100, 116, 139)',
          600: 'rgb(71, 85, 105)',
          700: 'rgb(51, 65, 85)',
          800: 'rgb(30, 41, 59)',
          900: 'rgb(15, 23, 42)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
