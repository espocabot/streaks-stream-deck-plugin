import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
	"com.espocabot.streaks.sdPlugin",
	"manifest.json",
);

let lastVersion = "0.1.0.0";

try {
	const tag = execSync("git describe --tags --abbrev=0").toString().trim();
	lastVersion = tag.replace(/^v/, "");
} catch {}

const [major, minor, patch, build] = lastVersion.split(".").map(Number);

const nextVersion = `${major}.${minor}.${patch}.${build + 1}`;

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
manifest.Version = nextVersion;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(nextVersion);
