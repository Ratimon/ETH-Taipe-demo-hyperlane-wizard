import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

const config = {
	preprocess: [
		vitePreprocess(),
		sveltePreprocess({
			// postcss make use of tailwind
			// we ensure it get processed, see postcss.config.cjs
			postcss: true,
		}),
	],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx']
};

export default config;
