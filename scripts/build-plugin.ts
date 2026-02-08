import { build } from "bun";

export async function buildPlugin() {
	const isProd = process.env.NODE_ENV === "production";

	await build({
		entrypoints: ["src/plugin.ts"],
		outdir: "com.espocabot.streaks.sdPlugin/bin",
		target: "node",
		format: "iife",
		define: {
			__API_BASE_URL__: JSON.stringify(
				isProd ? "https://api.espocabot.com" : "http://localhost:3000",
			),
		},
	});
}
