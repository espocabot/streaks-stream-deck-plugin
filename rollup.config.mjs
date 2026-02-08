import path from "node:path";
import url from "node:url";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "com.espocabot.streaks.sdPlugin";

const isProd = process.env.NODE_ENV === "production";
const API_URL = isProd ? "https://api.espocabot.com" : "http://localhost:3000";

const replacePlugin = replace({
	preventAssignment: true,
	__API_BASE_URL__: JSON.stringify(API_URL),
});

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: "src/plugin.ts",
	output: {
		file: `${sdPlugin}/bin/plugin.js`,
		sourcemap: isWatching,
		sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
			return url.pathToFileURL(
				path.resolve(path.dirname(sourcemapPath), relativeSourcePath),
			).href;
		},
	},
	plugins: [
		replacePlugin,
		{
			name: "watch-externals",
			buildStart: function () {
				this.addWatchFile(`${sdPlugin}/manifest.json`);
			},
		},
		typescript({
			mapRoot: isWatching ? "./" : undefined,
		}),
		nodeResolve({
			browser: false,
			exportConditions: ["node"],
			preferBuiltins: true,
		}),
		commonjs(),
		!isWatching && terser(),
		{
			name: "emit-module-package-file",
			generateBundle() {
				this.emitFile({
					fileName: "package.json",
					source: `{ "type": "module" }`,
					type: "asset",
				});
			},
		},
	],
};

const uiConfig = {
	input: "src/validate-api-token.ts",
	output: {
		file: `${sdPlugin}/ui/validate-api-token.js`,
		format: "iife",
		sourcemap: isWatching,
	},
	plugins: [
		replacePlugin,
		typescript(),
		nodeResolve({
			browser: true, // UI roda em WebView
		}),
		commonjs(),
		!isWatching && terser(),
	],
};

export default [config, uiConfig];
