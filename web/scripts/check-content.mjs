/**
 * Prints one reason per line for every change in <head-sha> (against <base-ref>) that is not plain content, and exits 1.
 * Run from web/: node --experimental-strip-types --no-warnings scripts/check-content.mjs <base-ref> <head-sha>
 * In CI the head is only fetched, never checked out, so everything is read from git objects, not the working tree.
 */
import { execFileSync } from "node:child_process";
import { checkFile } from "../lib/content-check.ts";

const [base, head] = process.argv.slice(2);
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });
// -z keeps odd file names intact; no external diff or textconv so repo config cannot run anything.
const tokens = git("diff", "--raw", "-z", "-M", "--no-ext-diff", "--no-textconv", "--no-color", `${base}...${head}`, "--").split("\0");

const reasons = [];
const add = (file) => {
  const reason = checkFile(file);
  if (reason) reasons.push(reason);
};
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
if (reasons.length) {
  console.log(reasons.join("\n"));
  process.exitCode = 1;
}
