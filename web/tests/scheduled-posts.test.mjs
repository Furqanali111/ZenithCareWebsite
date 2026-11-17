import test from "node:test";
import assert from "node:assert/strict";
import { duePosts } from "../lib/scheduled-posts.ts";

test("due posts: only posts that came due after the live build, not drafts or future ones", () => {
  const posts = [
    { id: "due", publishAt: new Date("2026-11-18") },
    { id: "already-live", publishAt: "2026-11-10" },
    { id: "future", publishAt: "2026-12-01" },
    { id: "draft", publishAt: "2026-11-18", draft: true },
    { id: "none" },
  ];
  assert.deepEqual(duePosts(posts, "2026-11-17", "2026-11-18").map((p) => p.id), ["due"]);
  assert.deepEqual(duePosts(posts, "2026-11-18", "2026-11-18"), []);
});
