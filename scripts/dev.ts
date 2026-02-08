import { watch } from "node:fs";
import { $ } from "bun";
import { buildPlugin } from "./build-plugin";
import { buildUI } from "./build-ui";

const PLUGIN_ID = "com.espocabot.streaks";

console.log("🚀 Watch mode started!", new Date());

await buildPlugin();
await buildUI();
console.log("✅ Initial build completed!");

let isBuilding = false;
let needsRebuild = false;

async function rebuild() {
	if (isBuilding) {
		needsRebuild = true;
		return;
	}

	isBuilding = true;
	console.log("🔄 Rebuilding...");

	try {
		await buildPlugin();
		await buildUI();
		console.log("✅ Build completed!");

		console.log("🔄 Restarting Stream Deck plugin...");
		await $`streamdeck restart ${PLUGIN_ID}`.quiet();
		console.log("✅ Plugin restarted!");
	} catch (error) {
		console.error("❌ Build failed:", error);
	} finally {
		isBuilding = false;

		if (needsRebuild) {
			needsRebuild = false;
			setTimeout(rebuild, 100);
		}
	}
}

async function restartPlugin(filename: string) {
	console.log(
		`\n📄 Change detected: ${filename} at ${new Date().toLocaleTimeString()}`,
	);
	console.log("🔄 Restarting Stream Deck plugin...");
	try {
		await $`streamdeck restart ${PLUGIN_ID}`.quiet();
		console.log("✅ Plugin restarted!");
	} catch (error) {
		console.error("❌ Restart failed:", error);
	}
}

watch("./src", { recursive: true }, (_eventType, filename) => {
	if (filename && (filename.endsWith(".ts") || filename.endsWith(".js"))) {
		console.log(
			`\n🔥 Source change: ${filename} at ${new Date().toLocaleTimeString()}`,
		);
		rebuild();
	}
});

watch(
	"./com.espocabot.streaks.sdPlugin",
	{ recursive: true },
	(_eventType, filename) => {
		if (
			filename &&
			(filename.endsWith(".html") ||
				/\.(png|jpg|jpeg|svg|gif)$/i.test(filename))
		) {
			restartPlugin(filename);
		}
	},
);

console.log("👀 Watching for changes in:");
console.log("   - ./src → rebuild + restart");
console.log(
	"   - ./com.espocabot.streaks.sdPlugin (HTML/images) → restart only\n",
);
