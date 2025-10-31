import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: './dist',
			fallback: './404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes("dev") ? "" : "/psychopy-app",
			assets: process.argv.includes("dev") ? "" : "https://teparsons.github.io/psychopy-app",
			relative: true
		}
	}
};

export const prerender = true;
export default config;