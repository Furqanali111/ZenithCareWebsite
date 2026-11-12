/**
 * Lists published posts that no other post links to (orphans), for internal
 * link planning. Counts /resources/<slug> links in post bodies and the
 * hand-picked "related" field. Run: pnpm links:report
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../content/posts");
const posts = readdirSync(dir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => ({ slug: f.slice(0, -4), ...matter(readFileSync(join(dir, f), "utf8")) }))
  .filter((p) => !p.data.draft);

const inbound = new Map(posts.map((p) => [p.slug, new Set()]));
for (const p of posts) {
  const targets = [
    ...[...p.content.matchAll(/\/resources\/([a-z0-9-]+)/g)].map((m) => m[1]),
    ...(p.data.related ?? []),
  ];
  for (const t of targets) if (t !== p.slug) inbound.get(t)?.add(p.slug);
}

const orphans = posts.filter((p) => inbound.get(p.slug).size === 0);
console.log(`${orphans.length} of ${posts.length} posts have no inbound links from other posts:`);
for (const p of orphans) console.log(`  /resources/${p.slug}  (${p.data.category ?? "no category"})`);
