import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy-assets-to';
import cleaner from 'rollup-plugin-cleaner';

const production = !process.env.ROLLUP_WATCH;

function workbox(config) {
	return {
		name: 'workbox',
            async writeBundle() {
            let build = require('workbox-build');
            const { count, size } = await build.generateSW(config);
            console.log(count, size);
        }
	};
}

export default {
    input: 'src/index.js',
	output: {
		file: 'docs/index.js',
        format: 'es',
		sourcemap: true
	},
	plugins: [
        production && cleaner({  // Only remove ./build when building for production.
            targets: [
              './docs/'
            ]
        }),
        copy({
            assets: [
                './manifest.json',
                './assets',
                './src/index.html'
            ],
            outputDir: 'docs'
        }),
        resolve(),
        production && terser(), // Minify, but only in production.
        babel({
            exclude: 'node_modules/**',
        }),
        workbox({
            swDest: './docs/sw.js',
            globDirectory: './docs',
            globPatterns: [
                "**/*.{js,html,json,png,ttf,css}"
            ],
            skipWaiting: true,
            ignoreURLParametersMatching: [/.*/],
            templatedURLs: {
                '/': ['index.html']
            },
        }),
    ],
};
