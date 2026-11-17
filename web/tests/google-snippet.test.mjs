import test from "node:test";
import assert from "node:assert/strict";
import { applyTitleTemplate, clip, slugify } from "../lib/google-snippet.ts";

test("title template fills title and site, and leaves the bare site name alone", () => {
  assert.equal(applyTitleTemplate("%title% | %site%", "CCM Billing", "Zenith Care Solutions"), "CCM Billing | Zenith Care Solutions");
  assert.equal(applyTitleTemplate("%site%: %title% (%title%)", "A", "Z"), "Z: A (A)");
  assert.equal(applyTitleTemplate("%title% | %site%", "Zenith Care Solutions", "Zenith Care Solutions"), "Zenith Care Solutions");
});

test("slugify makes a url piece from a heading", () => {
  assert.equal(slugify("CCM Consent Requirements: What's New?"), "ccm-consent-requirements-what-s-new");
  assert.equal(slugify("  --Hello  World--  "), "hello-world");
  assert.equal(slugify(""), "");
});

test("clip leaves short text, cuts long text at a word, never exceeds the limit", () => {
  assert.equal(clip("Short  text", 60), "Short text");
  const long = "How Remote Care Management Works for busy practices and their billing teams everywhere";
  const out = clip(long, 40);
  assert.ok(out.endsWith("..."));
  assert.ok(out.length <= 40);
  assert.ok(!/\s\.\.\.$/.test(out));
  assert.equal(clip("x".repeat(100), 20).length, 20); // no spaces: hard cut
});
