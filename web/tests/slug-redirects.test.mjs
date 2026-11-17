import test from "node:test";
import assert from "node:assert/strict";
import { planRedirects } from "../lib/slug-redirects.ts";

const empty = { exact: [], prefix: [] };
const rename = (a, b) => ({ status: "R", oldFile: `content/posts/${a}.mdx`, newFile: `content/posts/${b}.mdx` });

test("a renamed post gets a permanent redirect from the old address", () => {
  const p = planRedirects([rename("old-name", "new-name")], empty);
  assert.deepEqual(p.redirects.exact, [{ from: "/resources/old-name", to: "/resources/new-name", permanent: true }]);
});

test("an older redirect is pointed at the newest address, not chained", () => {
  const current = { exact: [{ from: "/resources/a", to: "/resources/b", permanent: true }], prefix: [] };
  const p = planRedirects([rename("b", "c")], current);
  assert.deepEqual(p.redirects.exact.map((r) => [r.from, r.to]), [["/resources/a", "/resources/c"], ["/resources/b", "/resources/c"]]);
});

test("renaming back removes the redirect that would hide the live page", () => {
  const current = { exact: [{ from: "/resources/a", to: "/resources/b", permanent: true }], prefix: [] };
  const p = planRedirects([rename("b", "a")], current);
  assert.deepEqual(p.redirects.exact.map((r) => [r.from, r.to]), [["/resources/b", "/resources/a"]]);
  assert.deepEqual(p.removed, ["/resources/a"]);
});

test("a deleted post only warns, and an existing redirect for it silences the warning", () => {
  const del = { status: "D", oldFile: "content/posts/gone.mdx" };
  assert.equal(planRedirects([del], empty).warnings.length, 1);
  const has = { exact: [{ from: "/resources/gone", to: "/resources", permanent: true }], prefix: [] };
  assert.equal(planRedirects([del], has).warnings.length, 0);
  assert.deepEqual(planRedirects([del], empty).redirects, empty);
});
