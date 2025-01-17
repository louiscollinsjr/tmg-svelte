/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'luckiest': ['"Luckiest Guy"', 'cursive'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'opensans': ['"Open Sans"', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'sourceserif': ['"Source Serif Pro"', 'serif'],
        'tirobangla': ['"Tiro Bangla"', 'serif'],
      },
    },
  },
  plugins: [],
}
