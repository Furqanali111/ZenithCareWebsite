import test from "node:test";
import assert from "node:assert/strict";
import { bumpUpdated } from "../lib/post-dates.ts";

const post = (updated, body, extra = "") => `---\ntitle: "T"\nupdatedAt: '${updated}'\n${extra}---\n${body}\n`;

test("a text change with an untouched date sets the date to today", () => {
  const out = bumpUpdated(post("2026-01-01", "Old text."), post("2026-01-01", "New text."), "2026-11-23");
  assert.match(out, /^updatedAt: "2026-11-23"$/m);
  assert.match(out, /New text\./);
});

test("no change to the date: a new post, a metadata-only edit, a date set by hand, or today already", () => {
  assert.equal(bumpUpdated(null, post("2026-01-01", "x"), "2026-11-23"), null);
  assert.equal(bumpUpdated(post("2026-01-01", "Same."), post("2026-01-01", "Same.", "description: new\n"), "2026-11-23"), null);
  assert.equal(bumpUpdated(post("2026-01-01", "A."), post("2026-05-05", "B."), "2026-11-23"), null);
  assert.equal(bumpUpdated(post("2026-11-23", "A."), post("2026-11-23", "B."), "2026-11-23"), null);
});
