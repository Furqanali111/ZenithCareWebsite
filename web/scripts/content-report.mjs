/**
 * Content health report for the SEO manager. Run: pnpm content:report [days]
 * Lists published posts to refresh (not updated in `days`, default 180) and
 * basic problems: long SEO title or description, duplicate titles, no cover
 * alt text. Read-only. Orphan posts are in `pnpm links:report`.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const days = Number(process.argv[2] ?? 180);
const dir = join(dirname(fileURLToPath(import.meta.url)), "../content/posts");
const day = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));
const posts = readdirSync(dir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => ({ slug: f.slice(0, -4), ...matter(readFileSync(join(dir, f), "utf8")).data }))
  .filter((p) => !p.draft);

const now = Date.now();
const ageDays = (p) => Math.floor((now - new Date(day(p.updatedAt) || day(p.publishedAt))) / 864e5);

const stale = posts.filter((p) => ageDays(p) >= days).sort((a, b) => ageDays(b) - ageDays(a));
console.log(`\n${stale.length} of ${posts.length} posts not updated in ${days}+ days (oldest first):`);
for (const p of stale) console.log(`  ${String(ageDays(p)).padStart(4)}d  /resources/${p.slug}`);

const problems = [];
const titles = new Map();
for (const p of posts) {
  const t = p.metaTitle || p.title || "";
  titles.set(t, [...(titles.get(t) ?? []), p.slug]);
  if (t.length > 60) problems.push(`${p.slug}: SEO title is ${t.length} characters (60 or fewer)`);
  if ((p.description ?? "").length > 160) problems.push(`${p.slug}: description is ${p.description.length} characters (160 or fewer)`);
}
const noAlt = posts.filter((p) => p.coverImage && !p.coverAlt).length;
for (const [t, slugs] of titles) if (slugs.length > 1) problems.push(`duplicate SEO title "${t}": ${slugs.join(", ")}`);

console.log(`\n${problems.length} problems:`);
for (const x of problems) console.log(`  ${x}`);
console.log(`\nInfo: ${noAlt} posts use the title as cover alt text (set "Cover image alt text" to describe the image).`);
