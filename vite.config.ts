import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sveltePhosphorOptimize } from "phosphor-svelte/vite";

export default defineConfig({
	plugins: [
		sveltePhosphorOptimize(),
		sveltekit(),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	ssr: {
		noExternal: ['@inlang/paraglide-js'],
		external: ['mongoose']
	},
	build: {
		rollupOptions: {
			external: ['mongoose']
		}
	}
});
