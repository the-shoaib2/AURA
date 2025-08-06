import vue from '@vitejs/plugin-vue';
import { posix as pathPosix, resolve } from 'path';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgLoader from 'vite-svg-loader';

import { vitestConfig } from '@aura/vitest-config/frontend';
import icons from 'unplugin-icons/vite';
import iconsResolver from 'unplugin-icons/resolver';
import components from 'unplugin-vue-components/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import legacy from '@vitejs/plugin-legacy';
import browserslist from 'browserslist';

const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/';

const { NODE_ENV } = process.env;

const browsers = browserslist.loadConfig({ path: process.cwd() });

const packagesDir = resolve(__dirname, '..', '..');

const alias = [
	{ find: '@', replacement: resolve(__dirname, 'src') },
	{ find: 'stream', replacement: 'stream-browserify' },
	{
		find: /^@aura\/chat(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@aura', 'chat', 'src$1'),
	},
	{
		find: /^@aura\/api-requests(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@aura', 'api-requests', 'src$1'),
	},
	{
		find: /^@aura\/composables(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@aura', 'composables', 'src$1'),
	},
	{
		find: /^@aura\/constants(.+)$/,
		replacement: resolve(packagesDir, '@aura', 'constants', 'src$1'),
	},
	{
		find: /^@aura\/design-system(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@aura', 'design-system', 'src$1'),
	},
	{
		find: /^@aura\/i18n(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@aura', 'i18n', 'src$1'),
	},
	{
		find: /^@aura\/stores(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@aura', 'stores', 'src$1'),
	},
	{
		find: /^@aura\/utils(.+)$/,
		replacement: resolve(packagesDir, '@aura', 'utils', 'src$1'),
	},
	...['orderBy', 'camelCase', 'cloneDeep', 'startCase'].map((name) => ({
		find: new RegExp(`^lodash.${name}$`, 'i'),
		replacement: `lodash/${name}`,
	})),
	{
		find: /^lodash\.(.+)$/,
		replacement: 'lodash/$1',
	},
	{
		// For sanitize-html
		find: 'source-map-js',
		replacement: resolve(__dirname, 'src/source-map-js-shim'),
	},
];

const plugins: UserConfig['plugins'] = [
	icons({
		compiler: 'vue3',
		autoInstall: true,
	}),
	components({
		dts: './src/components.d.ts',
		resolvers: [
			(componentName) => {
				if (componentName.startsWith('aura'))
					return { name: componentName, from: '@aura/design-system' };
			},
			iconsResolver({
				prefix: 'Icon',
			}),
		],
	}),
	viteStaticCopy({
		targets: [
			{
				src: pathPosix.resolve('node_modules/web-tree-sitter/tree-sitter.wasm'),
				dest: resolve(__dirname, 'dist'),
			},
			{
				src: pathPosix.resolve('node_modules/curlconverter/dist/tree-sitter-bash.wasm'),
				dest: resolve(__dirname, 'dist'),
			},
		],
	}),
	vue(),
	svgLoader({
		svgoConfig: {
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							// disable a default plugin
							cleanupIds: false,
							// preserve viewBox for scalability
							removeViewBox: false,
						},
					},
				},
			],
		},
	}),
	legacy({
		modernTargets: browsers,
		modernPolyfills: true,
		renderLegacyChunks: false,
	}),
	{
		name: 'Insert config script',
		transformIndexHtml: (html, ctx) => {
			const replacement = ctx.server
				? '' // Skip when using Vite dev server
				: '<script src="/{{REST_ENDPOINT}}/config.js"></script>';

			return html.replace('%CONFIG_SCRIPT%', replacement);
		},
	},
	// For sanitize-html
	nodePolyfills({
		include: ['fs', 'path', 'url', 'util', 'timers'],
	}),
];

const { RELEASE: release } = process.env;
const target = browserslistToEsbuild(browsers);

export default mergeConfig(
	defineConfig({
		define: {
			// This causes test to fail but is required for actually running it
			// ...(NODE_ENV !== 'test' ? { 'global': 'globalThis' } : {}),
			...(NODE_ENV === 'development' ? { 'process.env': {} } : {}),
			BASE_PATH: `'${publicPath}'`,
		},
		plugins,
		resolve: { alias },
		base: publicPath,
		envPrefix: ['VUE', 'aura_ENV_FEAT'],
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: [
						'',
						'@use "@/aura-theme-variables.scss" as *;',
						'@use "@aura/design-system/css/mixins" as mixins;',
					].join('\n'),
				},
			},
		},
		build: {
			minify: !!release,
			sourcemap: !!release,
			target,
		},
		optimizeDeps: {
			esbuildOptions: {
				target,
			},
		},
		worker: {
			format: 'es',
		},
	}),
	vitestConfig,
);
