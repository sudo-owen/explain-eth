/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cabin': ['Cabin', 'sans-serif'],
        'sans': ['Cabin', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      keyframes: {
        'eth-pulse': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.7' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'eth-pulse': 'eth-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
