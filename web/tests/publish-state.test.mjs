import test from "node:test";
import assert from "node:assert/strict";
import { editBranch, failureReason, pillView, publishState } from "../lib/publish-state.ts";

const NOW = Date.parse("2026-11-23T12:00:00Z");
const ago = (minutes) => new Date(NOW - minutes * 60_000).toISOString();
const SHA = "a".repeat(40);
const NEW = "b".repeat(40);
const bot = { login: "github-actions[bot]", type: "Bot" };
const comment = (reason, { sha = SHA, user = bot } = {}) => ({ user, body: `<!-- publish-failed:${sha} -->\n${reason}` });
const open = (minutes) => ({ state: "open", created_at: ago(minutes), merged_at: null });
const closed = { state: "closed", created_at: ago(30), merged_at: null };
const merged = (minutes) => ({ state: "closed", created_at: ago(minutes + 5), merged_at: ago(minutes) });
const state = (over) => publishState({ pr: null, ahead: 1, headSha: SHA, comments: [], now: NOW, ...over });

const STUCK = { kind: "stuck", reason: "This is taking longer than usual. Ask Furqan to look." };
const FAILED = { kind: "failed", reason: "Publishing failed. Ask Furqan to look." };

test("publish state: nothing opened yet", () => {
  assert.deepEqual(state({ ahead: 0 }), { kind: "clean" });
  assert.deepEqual(state({ ahead: 2 }), { kind: "ready" });
});

test("publish state: open is publishing, and stuck after 15 minutes", () => {
  assert.deepEqual(state({ pr: open(1) }), { kind: "publishing" });
  assert.deepEqual(state({ pr: open(15) }), { kind: "publishing" });
  assert.deepEqual(state({ pr: open(16) }), STUCK);
});

test("publish state: a failure on an open one is failed, until a newer save", () => {
  const comments = [comment("a.mdx: bad.")];
  assert.deepEqual(state({ pr: open(20), comments }), { kind: "failed", reason: "a.mdx: bad." });
  assert.deepEqual(state({ pr: open(1), comments, headSha: NEW }), { kind: "publishing" });
});

test("publish state: closed with a failure for this commit is failed, after a new save ready", () => {
  const comments = [comment("a.mdx: bad.")];
  assert.deepEqual(state({ pr: closed, comments }), { kind: "failed", reason: "a.mdx: bad." });
  assert.deepEqual(state({ pr: closed, comments, headSha: NEW }), { kind: "ready" });
  assert.deepEqual(state({ pr: closed, comments: [comment("")] }), FAILED);
});

test("publish state: closed by a person is ready, or clean with nothing left", () => {
  assert.deepEqual(state({ pr: closed }), { kind: "ready" });
  assert.deepEqual(state({ pr: closed, ahead: 0 }), { kind: "clean" });
});

test("publish state: merged is published for 10 minutes, and later saves are ready", () => {
  assert.deepEqual(state({ pr: merged(5), ahead: 0 }), { kind: "published" });
  assert.deepEqual(state({ pr: merged(11), ahead: 0 }), { kind: "clean" });
  assert.deepEqual(state({ pr: merged(5), ahead: 1 }), { kind: "ready" });
  // An old failure comment on something that was published in the end does not matter.
  assert.deepEqual(state({ pr: merged(5), ahead: 0, comments: [comment("old")] }), { kind: "published" });
});

test("failure reason: only the bot, only this commit, only at the start", () => {
  assert.equal(failureReason([comment("x", { user: { login: "someone", type: "User" } })], SHA), null);
  assert.equal(failureReason([comment("x", { user: { login: "github-actions[bot]", type: "User" } })], SHA), null);
  assert.equal(failureReason([comment("x", { user: { login: "vercel[bot]", type: "Bot" } })], SHA), null);
  assert.equal(failureReason([comment("x", { user: null })], SHA), null);
  assert.equal(failureReason([comment("x", { sha: NEW })], SHA), null);
  assert.equal(failureReason([{ user: bot, body: `hello\n<!-- publish-failed:${SHA} -->\nx` }], SHA), null);
  assert.equal(failureReason([{ user: bot, body: null }], SHA), null);
  assert.equal(failureReason([], SHA), null);
});

test("failure reason: the newest one, cleaned and capped", () => {
  assert.equal(failureReason([comment("first"), comment("second"), comment("x", { sha: NEW })], SHA), "second");
  assert.equal(failureReason([comment("  a.mdx: bad.\r\nb.mdx: \u0007worse.\n")], SHA), "a.mdx: bad. b.mdx: worse.");
  assert.equal(failureReason([comment("x".repeat(5000))], SHA), "x".repeat(1000));
  assert.equal(failureReason([comment(" \n ")], SHA), FAILED.reason);
});

test("edit branch: the lowercase login as it is, so it equals what the publish workflow compares", () => {
  assert.equal(editBranch("content", "Furqanali111"), "feature/content-furqanali111");
  assert.equal(editBranch("seo-edits", "A_Very-Long_Login-That-Is-Over-Thirty"), "feature/seo-edits-a_very-long_login-that-is-over-thirty");
});

test("pill: published shows only after this tab saw it publishing, until the next edit", () => {
  assert.deepEqual(pillView({ kind: "published" }, false), { text: "No changes to publish.", button: null, saw: false });
  assert.deepEqual(pillView({ kind: "clean" }, false), { text: "No changes to publish.", button: null, saw: false });
  const p = pillView({ kind: "publishing" }, false);
  assert.deepEqual(p, { text: "Publishing. This takes a few minutes.", button: null, saw: true });
  assert.deepEqual(pillView({ kind: "published" }, p.saw), { text: "Published. Live in a few minutes.", button: "Reload", saw: true });
  assert.deepEqual(pillView({ kind: "clean" }, true), { text: "Published. Live in a few minutes.", button: "Reload", saw: true });
  assert.deepEqual(pillView({ kind: "ready" }, true), { text: "Your changes are private until you publish.", button: "Publish", saw: false });
});

test("pill: failed offers Publish again, stuck only explains", () => {
  assert.deepEqual(pillView(FAILED, true), { text: FAILED.reason, button: "Publish again", saw: true });
  assert.deepEqual(pillView(STUCK, false), { text: STUCK.reason, button: null, saw: false });
});
