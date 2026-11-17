/**
 * Adds a 301 redirect for every post file renamed (slug changed) or warns about deleted ones.
 * Run from web/: node --experimental-strip-types --no-warnings scripts/slug-redirects.mjs [base-ref]
 * Compares HEAD with the base branch (default origin/develop), so commit first when running by hand.
 * In CI it runs on every PR that touches content/posts (.github/workflows/slug-redirects.yml).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { planRedirects } from "../lib/slug-redirects.ts";

const base = process.argv[2] ?? "origin/develop";
const diff = execFileSync(
  "git",
  ["diff", "-M50%", "--relative", "--name-status", "--diff-filter=RD", `${base}...HEAD`, "--", "content/posts"],
  { encoding: "utf8" },
);
const changes = diff
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split("\t"))
  .filter(([, oldFile]) => oldFile?.endsWith(".mdx"))
  .map(([status, oldFile, newFile]) => ({ status: status[0], oldFile, newFile }));

const file = "content/redirects.json";
const { redirects, added, updated, removed, warnings } = planRedirects(changes, JSON.parse(readFileSync(file, "utf8")));
if (added.length || updated.length || removed.length) writeFileSync(file, JSON.stringify(redirects, null, 2) + "\n");

const ci = process.env.GITHUB_ACTIONS === "true";
for (const a of added) console.log(`added redirect: ${a}`);
for (const u of updated) console.log(`updated redirect: ${u}`);
for (const r of removed) console.log(`removed redirect that hid a live page: ${r}`);
for (const w of warnings) console.log(ci ? `::warning::${w}` : `warning: ${w}`);
if (!changes.length) console.log("no renamed or deleted posts");
