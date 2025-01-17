import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

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
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
