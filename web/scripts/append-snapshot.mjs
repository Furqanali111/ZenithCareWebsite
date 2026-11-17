/**
 * Adds one SEO score snapshot (the JSON from /api/seo-snapshot) to content/seo-history.json.
 * Run from web/: node --experimental-strip-types --no-warnings scripts/append-snapshot.mjs <snapshot.json>
 * Used by .github/workflows/seo-snapshot.yml.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { appendHistory, validateHistoryEntry } from "../lib/seo-site-checks.ts";

const v = validateHistoryEntry(JSON.parse(readFileSync(process.argv[2], "utf8")));
if (!v.ok) {
  console.error(`The snapshot is not valid: ${v.error}`);
  process.exit(1);
}
const file = "content/seo-history.json";
writeFileSync(file, appendHistory(readFileSync(file, "utf8"), v.entry));
console.log(`recorded ${v.entry.date}: average ${v.entry.average} over ${v.entry.rows} pages`);
