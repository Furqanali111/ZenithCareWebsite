/**
 * Ping IndexNow (Bing, Yandex, Seznam, Naver, Yep) with every URL in the
 * live sitemap. Google does not use IndexNow.
 *
 * Run AFTER the key file is live on production:
 *   pnpm indexnow
 *   pnpm indexnow -- --dry-run
 *
 * shortcut: fetches production sitemap.xml instead of importing sitemap.ts,
 * so we don't pull Next/MDX into a Node script. Revisit if we ever ship a
 * second origin whose sitemap we also need to notify.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "cdd29e58c720c0425061517e14e13024";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const hosted = readFileSync(join(webRoot, "public", `${KEY}.txt`), "utf8").trim();
if (hosted !== KEY) {
  throw new Error(
    `IndexNow key file mismatch: public/${KEY}.txt must contain only the key.`,
  );
}

const dryRun = process.argv.includes("--dry-run");
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thezcs.com")
  .replace(/\/$/, "")
  .replace(/^(https?:\/\/)www\./, "$1");
const host = new URL(base).host;
const keyLocation = `${base}/${KEY}.txt`;

const keyRes = await fetch(keyLocation);
if (!keyRes.ok) {
  console.error(
    `Key file is not live at ${keyLocation} (${keyRes.status}). Deploy this branch first, then rerun.`,
  );
  process.exit(1);
}
const liveKey = (await keyRes.text()).trim();
if (liveKey !== KEY) {
  console.error(
    `Live key file body does not match KEY. Expected ${KEY}, got ${liveKey.slice(0, 64)}.`,
  );
  process.exit(1);
}

const sitemapUrl = `${base}/sitemap.xml`;
const sitemapRes = await fetch(sitemapUrl);
if (!sitemapRes.ok) {
  console.error(`Could not fetch ${sitemapUrl} (${sitemapRes.status}).`);
  process.exit(1);
}
const xml = await sitemapRes.text();
const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
  .map((m) => m[1])
  .filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });

if (urls.length === 0) {
  console.error(`No same-host URLs in ${sitemapUrl}.`);
  process.exit(1);
}

const payload = { host, key: KEY, keyLocation, urlList: urls };

console.log(`IndexNow host=${host} urls=${urls.length} dryRun=${dryRun}`);
if (dryRun) {
  for (const url of urls) console.log(`  ${url}`);
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

const text = await res.text();
if (res.status !== 200 && res.status !== 202) {
  console.error(`IndexNow failed: HTTP ${res.status}\n${text}`);
  process.exit(1);
}

console.log(`IndexNow accepted: HTTP ${res.status} (${urls.length} URLs)`);
