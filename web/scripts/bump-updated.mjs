/**
 * Sets "Last updated" to today on every post whose text changed in this branch and whose date was left alone.
 * Run from web/: node --experimental-strip-types --no-warnings scripts/bump-updated.mjs [base-ref]
 * In CI it runs on every PR that touches content/posts (.github/workflows/post-dates.yml).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { bumpUpdated } from "../lib/post-dates.ts";

const base = process.argv[2] ?? "origin/develop";
const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const today = new Date().toISOString().slice(0, 10);
// Where this branch left develop: a post that develop changed since is not changed by this branch.
const fork = git("merge-base", base, "HEAD").trim();
const files = git("diff", "--relative", "--name-only", "--diff-filter=M", `${fork}...HEAD`, "--", "content/posts").split("\n").filter((f) => f.endsWith(".mdx"));
for (const file of files) {
  const next = bumpUpdated(git("show", `${fork}:web/${file}`), readFileSync(file, "utf8"), today);
  if (next !== null) {
    writeFileSync(file, next);
    console.log(`updated date: ${file}`);
  }
}
if (!files.length) console.log("no edited posts");
