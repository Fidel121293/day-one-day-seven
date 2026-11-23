// Entry program for the "Day One, Day Seven" TikTok bounty (Node 22, stdlib only).
//
// The entry itself is the video: it lives on TikTok, and this repository only
// has to hand its address to the grader. So this program does one thing —
// copy VIDEO.json from the repository root into the output directory,
// where the gate reads it. Before copying, it sanity-checks that the file
// parses and actually carries a url, so a broken hand-in fails loudly here
// instead of silently at grading time.
//
// Local dry run (mirrors the grader's environment variables):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'VIDEO.json');
const target = join(outputDir, 'VIDEO.json');

let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json is missing or unreadable at ${source}: ${(err as Error).message}`);
  process.exit(1);
}

const url = (parsed as { url?: unknown }).url;
if (typeof url !== 'string' || url.length === 0) {
  console.error('VIDEO.json must be an object with a non-empty "url" string.');
  process.exit(1);
}

// The gate only accepts a full TikTok video address — short share links
// (vm.tiktok.com, vt.tiktok.com, tiktok.com/t/...) and the starter's
// placeholder are refused — so reject those shapes here, at hand-in time.
if (!/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/.test(url)) {
  console.error(`VIDEO.json url is not a full TikTok video address: ${url}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);
