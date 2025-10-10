import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: './dist',
			fallback: './index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: "",
			assets: "",
			relative: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export const prerender = true;
export default config;