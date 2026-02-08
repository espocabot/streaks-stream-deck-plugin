import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
	"com.espocabot.streaks.sdPlugin",
	"manifest.json",
);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

let [major, minor, patch, build] = manifest.Version.split(".").map(Number);

function tagExists(version) {
	try {
		execSync(`git rev-parse v${version}`, { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

let nextVersion;

do {
	build += 1;
	nextVersion = `${major}.${minor}.${patch}.${build}`;
} while (tagExists(nextVersion));

manifest.Version = nextVersion;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(nextVersion);
