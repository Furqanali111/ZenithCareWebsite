/**
 * Prints one reason per line for every change that is not plain content, and exits 1. It looks at what <head-sha>
 * changed and at what merging it into <base-ref> would change.
 * Run from web/: node --experimental-strip-types --no-warnings scripts/check-content.mjs <base-ref> <head-sha>
 * In CI the head is only fetched, never checked out, so everything is read from git objects, not the working tree.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { checkFile } from "../lib/content-check.ts";

const [base, head] = process.argv.slice(2);
// An empty head would silently compare HEAD with itself and pass, so insist on a full commit id.
if (!base || !/^[0-9a-f]{40}$/.test(head ?? "")) {
  console.log("The check was not given a starting point and a full commit id, so it could not look at your changes.");
  process.exit(1);
}
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });
// For the two commands where exit 1 is an answer, not an error.
const ask = (...args) => {
  const { status, stdout } = spawnSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28 });
  if (status !== 0 && status !== 1) throw new Error(`git ${args[0]} failed`);
  return { yes: status === 0, out: stdout.trim() };
};

// With several merge bases a diff uses one and a merge uses all, so what is checked would not be what is merged.
const bases = ask("merge-base", "--all", base, head);
if (!/^[0-9a-f]{40}$/.test(bases.out)) {
  console.log("Your private copy has an unusual history. Ask Furqan to look.");
  process.exit(1);
}

const reasons = new Set();
const add = (file) => {
  const reason = checkFile(file);
  if (reason) reasons.add(reason);
};
function checkDiff(...range) {
  // -z keeps odd file names intact; no external diff or textconv so repo config cannot run anything.
  // --no-abbrev: a short id could be read as a tag or branch of the same name instead of the file.
  const tokens = git("diff", "--raw", "-z", "--no-abbrev", "-M", "--no-ext-diff", "--no-textconv", "--no-color", ...range, "--").split("\0");
  for (let i = 0; i < tokens.length - 1; ) {
    const [, newMode, , newSha, status] = tokens[i++].split(" ");
    const paths = [tokens[i++]];
    if (status[0] === "R" || status[0] === "C") paths.push(tokens[i++]);
    // The old name of a rename counts as a deletion: the file leaves a place it must be allowed to leave.
    if (paths.length > 1) add({ path: paths[0], status: "D", mode: "" });
    const path = paths.at(-1);
    let text;
    if (status[0] !== "D" && /\.(mdx|json)$/.test(path)) {
      try {
        text = git("cat-file", "blob", newSha);
      } catch {}
    }
    add({ path, status: status[0], mode: newMode, text });
  }
}
checkDiff(`${base}...${head}`);
// A conflict cannot be merged, and the build job reports it.
const merged = ask("merge-tree", "--write-tree", base, head);
if (merged.yes) checkDiff(base, merged.out);

if (reasons.size) {
  console.log([...reasons].join("\n"));
  process.exitCode = 1;
}
