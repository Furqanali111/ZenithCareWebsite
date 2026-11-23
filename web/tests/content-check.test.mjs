import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkFile } from "../lib/content-check.ts";

const web = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const mdx = (body, front = "---\ntitle: T\n---\n") => ({ path: "web/content/posts/x.mdx", status: "M", mode: "100644", text: front + body });
const ok = (f) => assert.equal(checkFile(f), null);
const refused = (f) => assert.match(checkFile(f) ?? "", /web\/[^ ]*: /);

test("every current post and each allowed image type is accepted", () => {
  for (const name of readdirSync(join(web, "content/posts")).filter((n) => n.endsWith(".mdx"))) {
    ok({ path: `web/content/posts/${name}`, status: "M", mode: "100644", text: readFileSync(join(web, "content/posts", name), "utf8") });
  }
  for (const ext of ["webp", "jpg", "jpeg", "png", "avif"]) ok({ path: `web/public/resources/a.${ext}`, status: "A", mode: "100644" });
  ok({ path: "web/public/social/a.png", status: "A", mode: "100644" });
  ok({ path: "web/content/faq.json", status: "M", mode: "100644", text: "[]" });
  ok(mdx("Escaped \\{ brace and \\<b> and <Callout type=\"x\">hi</Callout><BookCall /><Toc/>\n"));
  ok(mdx("body\n", "---\r\ntitle: '{x} <y>'\r\n---\r\n"));
  ok({ path: "web/content/posts/gone.mdx", status: "D", mode: "000000" });
});

test("anything that is not plain content is refused", () => {
  for (const path of ["web/content/posts.ts", "web/app/page.tsx", ".github/workflows/x.yml", "web/public/resources/a.svg", "web/content/../app/x.json", "web/public/resources/x.mdx", "web/content/a\nb.json"]) {
    assert.ok(checkFile({ path, status: "M", mode: "100644", text: "[]" }), path);
  }
  assert.equal(checkFile({ path: "web/app/page.tsx", status: "D", mode: "" }) === null, false);
  refused({ path: "web/content/a.json", status: "M", mode: "120000", text: "[]" });
  refused({ path: "web/content/a.json", status: "M", mode: "160000", text: "[]" });
  refused({ path: "web/content/a.json", status: "X", mode: "100644", text: "[]" });
  refused({ path: "web/content/a.json", status: "M", mode: "100644" });
  refused({ path: "web/content/a.json", status: "M", mode: "100644", text: "{nope" });
  assert.doesNotMatch(checkFile({ path: "web/content/a\nb.json", status: "M", mode: "100644", text: "" }), /\n/);
});

test("MDX that could run code is refused", () => {
  const front = (f) => ({ ...mdx("x"), text: f });
  refused(front("---js\n{}\n---\nx"));
  refused(front("---\ntitle: T\n"));
  refused(front("﻿---\ntitle: T\n---\nx"));
  refused(front("title: T\n---\nx"));
  for (const body of ["{process.env.X}", "\\\\{x}", "import x from 'y'", "import\"fs\"", "export*from 'y'", "a\rimport x", "<script>", "<Foo />", "<CalloutX>", "<!-- c -->", "a <b", "\\\\<b>", "<img src=x>", "<http://x.y>"]) {
    refused(mdx(body + "\n"));
  }
  refused(mdx("---{x}\n", "---\nt: 1\n"));
});

// End to end in a throwaway repo: the head is a commit that is never checked out.
const repo = mkdtempSync(join(tmpdir(), "check-content-"));
const git = (...a) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false", ...a], { cwd: repo, encoding: "utf8", input: "" }).trim();
const put = (p, text) => (mkdirSync(join(repo, p, ".."), { recursive: true }), writeFileSync(join(repo, p), text), git("add", p));
const run = (head) => spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", join(web, "scripts/check-content.mjs"), "base", head], { cwd: repo, encoding: "utf8" });
const commitOn = (change) => {
  git("checkout", "-q", "--detach", "base");
  change();
  git("commit", "-q", "-m", "c");
  return git("rev-parse", "HEAD");
};
git("init", "-q");
put("web/content/posts/a.mdx", "---\ntitle: A\n---\nHello\n");
git("add", "-A");
git("commit", "-q", "-m", "base");
git("tag", "base");

test("check-content.mjs: an edit passes, a move out of content or a symlink fails", () => {
  const edit = run(commitOn(() => put("web/content/posts/a.mdx", "---\ntitle: A\n---\nHello again\n")));
  assert.deepEqual([edit.status, edit.stdout], [0, ""]);
  assert.deepEqual([run("base").status, run("base").stdout], [0, ""]);

  const moved = run(commitOn(() => (mkdirSync(join(repo, "web/app"), { recursive: true }), git("mv", "web/content/posts/a.mdx", "web/app/a.mdx"))));
  assert.equal(moved.status, 1);
  assert.match(moved.stdout, /web\/app\/a\.mdx: /);

  const link = run(commitOn(() => git("update-index", "--add", "--cacheinfo", `120000,${execFileSync("git", ["hash-object", "-w", "--stdin"], { cwd: repo, input: "a.mdx" }).toString().trim()},web/content/posts/l.mdx`)));
  assert.equal(link.status, 1);
  assert.match(link.stdout, /l\.mdx: .*link/);
  rmSync(repo, { recursive: true, force: true });
});
