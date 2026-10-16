/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burnt: {
          DEFAULT: '#E87532',
          dark: '#D05F20',
          light: '#F48E54',
          50: '#FDF5F0',
          100: '#FCE7DB',
          500: '#E87532',
          600: '#D05F20',
          700: '#B04B13',
        },
        golden: {
          DEFAULT: '#FFC857',
          light: '#FFD782',
          dark: '#E5AF3E',
          50: '#FFFDF5',
          100: '#FFF7DE',
          500: '#FFC857',
        },
        cream: {
          DEFAULT: '#FFF8EE',
          warm: '#FFF4E3',
          light: '#FFFDF9',
          50: '#FFFFFF',
          100: '#FFF8EE',
          200: '#FDEFD6',
        },
        espresso: {
          DEFAULT: '#3B261C',
          dark: '#261811',
          light: '#533628',
          800: '#3B261C',
          900: '#261811',
        },
        peach: {
          DEFAULT: '#F6D5BD',
          soft: '#FBE8DC',
          light: '#FDF1E9',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 10px 30px -5px rgba(232, 117, 50, 0.15)',
        'warm-lg': '0 20px 40px -10px rgba(59, 38, 28, 0.18)',
        'glass': '0 8px 32px 0 rgba(59, 38, 28, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
