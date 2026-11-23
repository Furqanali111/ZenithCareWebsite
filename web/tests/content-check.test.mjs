import test, { after } from "node:test";
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

test("the top section must end exactly where MDX ends it", () => {
  const post = (front, body = "Hello\n") => ({ ...mdx("x"), text: front + body });
  ok(post("---\ntitle: T\n--- \t\n"));
  ok(post("---\r\ntitle: T\r\n---\r\n"));
  refused(post("---\ntitle: T\n--- \n", "{x}\n"));
  refused(post("---\ntitle: \"T {globalThis.PWN=1}\"\n---x\n"));
  refused(post("---\ntitle: T\n----\n"));
  refused(post("---\ntitle: T\n---\xa0\n"));
  refused(post("---\n# a\r---\r\rexport const p = (globalThis.PWN=1)\r\r\n---\n"));
  refused(post("---\ntitle: T\nzz: [a,\r---\r, \"{x}\"]\n---\n"));
});

test("only plain Callout, BookCall and Toc tags pass", () => {
  for (const b of ['<Callout tone="info">hi</Callout>', "<Callout>x</Callout >", "<Toc />", "<Toc/>", "<BookCall />"]) ok(mdx(b + "\n"));
  for (const b of ["<Callout .constructor/>", "<Callout . constructor>x</Callout . constructor>", "<Toc\n.constructor/>", "<Callout :x/>", "> <Callout\n> .constructor/>"]) refused(mdx(b + "\n"));
});

test("files that steer module loading are refused", () => {
  for (const path of ["web/content/package.json", "web/content/node_modules/gray-matter/package.json", "web/content/.hidden/x.json", "web/content/posts/TSConfig.json", "web/content/NODE_MODULES/x.json"]) {
    refused({ path, status: "M", mode: "100644", text: "{}" });
  }
});

// End to end in a throwaway repo: the head is a commit that is never checked out.
const repo = mkdtempSync(join(tmpdir(), "check-content-"));
const git = (...a) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false", ...a], { cwd: repo, encoding: "utf8", input: "" }).trim();
const put = (p, text) => (mkdirSync(join(repo, p, ".."), { recursive: true }), writeFileSync(join(repo, p), text), git("add", p));
const run = (head, base = "base") => spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", join(web, "scripts/check-content.mjs"), base, head], { cwd: repo, encoding: "utf8" });
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
after(() => rmSync(repo, { recursive: true, force: true }));

test("check-content.mjs: an edit passes, a move out of content or a symlink fails", () => {
  const edit = run(commitOn(() => put("web/content/posts/a.mdx", "---\ntitle: A\n---\nHello again\n")));
  assert.deepEqual([edit.status, edit.stdout], [0, ""]);
  const baseSha = git("rev-parse", "base");
  assert.deepEqual([run(baseSha).status, run(baseSha).stdout], [0, ""]);
  // A head that is not a full commit id would silently compare nothing.
  for (const head of ["", "HEAD", baseSha.slice(0, 7)]) assert.equal(run(head).status, 1, head);

  // A tag named like the start of a blob id must not decide which file gets read.
  const bad = commitOn(() => put("web/content/posts/a.mdx", "---\ntitle: A\n---\n{process.env.X}\n"));
  git("tag", git("rev-parse", `${bad}:web/content/posts/a.mdx`).slice(0, 7), git("rev-parse", "base:web/content/posts/a.mdx"));
  assert.equal(run(bad).status, 1);

  const moved = run(commitOn(() => (mkdirSync(join(repo, "web/app"), { recursive: true }), git("mv", "web/content/posts/a.mdx", "web/app/a.mdx"))));
  assert.equal(moved.status, 1);
  assert.match(moved.stdout, /web\/app\/a\.mdx: /);

  const link = run(commitOn(() => git("update-index", "--add", "--cacheinfo", `120000,${execFileSync("git", ["hash-object", "-w", "--stdin"], { cwd: repo, input: "a.mdx" }).toString().trim()},web/content/posts/l.mdx`)));
  assert.equal(link.status, 1);
  assert.match(link.stdout, /l\.mdx: .*link/);
});

test("check-content.mjs: checks what merging would change, not only what the branch changed", () => {
  const post = (body) => () => put("web/content/posts/a.mdx", `---\ntitle: A\n---\n${body}\n`);
  const unusual = "Your private copy has an unusual history. Ask Furqan to look.\n";
  const check = (head, base) => {
    const { status, stdout } = run(head, base);
    return [status, stdout];
  };

  // Both sides merged the same two commits, but the head kept only one: its diff can be empty while merging undoes the other.
  const one = commitOn(post("Hello one"));
  const two = commitOn(() => put("web/lib/x.ts", "reviewed"));
  git("merge", "-q", "--no-edit", one);
  const develop = git("rev-parse", "HEAD");
  for (const kept of [one, two]) {
    const crossed = git("commit-tree", `${kept}^{tree}`, "-p", one, "-p", two, "-m", "c");
    assert.deepEqual(check(crossed, develop), [1, unusual]);
  }
  assert.deepEqual(check(git("commit-tree", "base^{tree}", "-m", "c"), develop), [1, unusual]);

  // Develop moved a file out of content, so an edit of the old file would land in the new one.
  const moved = commitOn(() => (mkdirSync(join(repo, "web/lib"), { recursive: true }), git("mv", "web/content/posts/a.mdx", "web/lib/a.mdx")));
  const [status, reasons] = check(commitOn(post("Hello again")), moved);
  assert.equal(status, 1);
  assert.match(reasons, /^web\/lib\/a\.mdx: /);

  // A branch behind a moved develop is normal, and a reason found by both looks is given once.
  assert.deepEqual(check(commitOn(() => put("web/content/b.json", "{}")), develop), [0, ""]);
  assert.equal(check(commitOn(() => put("web/content/b.json", "{")), develop)[1].trim().split("\n").length, 1);

  // A conflict cannot be merged, so the build reports it. What the branch itself holds is still checked.
  assert.deepEqual(check(commitOn(post("Hello two")), develop), [0, ""]);
  assert.match(check(commitOn(post("{x}")), develop)[1], /curly bracket/);
});
