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
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'$data': './src/data',
			'$lib': './src/lib',
		},
	},
	extensions: ['.svelte', '.svx']
};

export default config;
