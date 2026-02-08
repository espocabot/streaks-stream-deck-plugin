import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
	"com.espocabot.streaks.sdPlugin",
	"manifest.json",
);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

const [major, minor, patch, build] = manifest.Version.split(".").map(Number);

const nextVersion = `${major}.${minor}.${patch}.${build + 1}`;

manifest.Version = nextVersion;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(nextVersion);
