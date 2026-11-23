// Neon Dash — hand-in program for the day-one/day-seven bounty.
//
// Reads the VIDEO.json sitting next to this file, checks that its "url"
// is a complete TikTok video address, and copies the file verbatim to
// /output/VIDEO.json. Any problem (missing file, bad JSON, wrong URL
// shape) exits non-zero with the reason on stderr.
//
// Node 22+, standard library only.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  console.error("main.ts: " + message);
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "VIDEO.json");

let raw;
try {
  raw = readFileSync(sourcePath);
} catch {
  fail("cannot read " + sourcePath);
}

let parsed;
try {
  parsed = JSON.parse(raw.toString("utf8"));
} catch {
  fail("VIDEO.json is not valid JSON");
}

const url = parsed && parsed.url;
// A full address only: scheme, www.tiktok.com, an @handle, /video/, digits.
const ADDRESS = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._-]+\/video\/\d+$/;
if (typeof url !== "string" || !ADDRESS.test(url)) {
  fail('"url" must look like https://www.tiktok.com/@handle/video/1234567890');
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/VIDEO.json", raw);
console.log("handed in " + url);
