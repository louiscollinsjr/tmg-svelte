// svelte.config.js
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

loadEnvConfig(process.cwd());

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		csrf: {
			checkOrigin: false,
		},
	}
};

export default config;