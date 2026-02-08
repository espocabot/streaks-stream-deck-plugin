import { build } from "bun";

export async function buildUI() {
	const isProd = process.env.NODE_ENV === "production";

	await build({
		entrypoints: ["src/validate-api-token.ts"],
		outdir: "com.espocabot.streaks.sdPlugin/ui",
		target: "browser",
		format: "iife",
		define: {
			__API_BASE_URL__: JSON.stringify(
				isProd ? "https://api.espocabot.com" : "http://localhost:3000",
			),
		},
	});
}
