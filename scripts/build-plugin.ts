import { mkdirSync } from "node:fs";
import { build } from "bun";

export async function buildPlugin() {
	const isProd = process.env.NODE_ENV === "production";

	mkdirSync("com.espocabot.streaks.sdPlugin/bin", { recursive: true });

	const result = await build({
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

	console.log("✅ Plugin built:", result.outputs.map((o) => o.path).join(", "));
}

if (import.meta.main) {
	await buildPlugin();
}
