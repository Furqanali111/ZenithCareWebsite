import test from "node:test";
import assert from "node:assert/strict";
import { analyze, linkSuggestions } from "../lib/seo-analysis.ts";

const status = (r, id) => r.checks.find((c) => c.id === id)?.status;

const good = {
  path: "/resources/ccm-billing-guide",
  title: "CCM Billing Guide for Primary Care Practices",
  description:
    "Learn how CCM billing works for primary care: the CPT codes, time thresholds and consent rules your practice needs to bill Medicare correctly and safely.",
  focusKeyword: "CCM billing",
  body: [
    "CCM billing starts with a signed consent and a care plan.",
    "",
    "## How CCM billing works",
    "",
    "Read the [CMS rules](https://www.cms.gov/ccm), then see [pricing](/pricing) and [how it works](/how-it-works).",
    "",
    "![A care plan on a desk](/a.webp)",
    "",
    Array.from({ length: 8 }, () => "Care teams log each call and update the plan. ".repeat(4)).join("\n\n"),
  ].join("\n"),
};

test("a well-optimised post scores high and passes the keyword checks", () => {
  const r = analyze(good);
  for (const id of ["kw-set", "kw-title", "kw-desc", "kw-url", "kw-first", "kw-headings", "links-in", "links-out", "alt"]) {
    assert.equal(status(r, id), "pass", id);
  }
  assert.ok(r.score >= 85, `score ${r.score}`);
});

test("missing keyword fails one check and skips the rest instead of failing them", () => {
  const r = analyze({ ...good, focusKeyword: "" });
  assert.equal(status(r, "kw-set"), "fail");
  assert.equal(status(r, "kw-title"), "na");
  assert.equal(status(r, "kw-first"), "na");
});

test("pages with text in code skip body checks", () => {
  const r = analyze({ ...good, body: undefined });
  assert.equal(status(r, "words"), "na");
  assert.equal(status(r, "kw-title"), "pass");
});

test("keyword missing from title, description and first paragraph fails", () => {
  const r = analyze({ ...good, title: "Billing guide", description: "Short.", body: "Intro text.\n\nMore." });
  assert.equal(status(r, "kw-title"), "fail");
  assert.equal(status(r, "kw-desc"), "fail");
  assert.equal(status(r, "kw-first"), "fail");
  assert.equal(status(r, "desc-len"), "warn");
});

test("image without alt text fails and an empty page does not crash", () => {
  assert.equal(status(analyze({ ...good, body: "CCM billing.\n\n![](/x.webp)" }), "alt"), "fail");
  assert.equal(analyze({ path: "/", title: "", description: "" }).score, 0);
});

test("endings are matched: billed and bills count as the keyword billing", () => {
  const r = analyze({ ...good, focusKeyword: "bill", title: "How practices get billed for CCM", description: "x" });
  assert.equal(status(r, "kw-title"), "pass");
  assert.equal(status(analyze({ ...good, focusKeyword: "code", title: "Medical coding basics" }), "kw-title"), "pass");
  assert.equal(status(analyze({ ...good, focusKeyword: "process", title: "Billing processes" }), "kw-title"), "pass");
});

test("a synonym satisfies the keyword checks", () => {
  const base = { ...good, title: "Chronic care management fees explained", focusKeyword: "CCM pricing" };
  assert.equal(status(analyze(base), "kw-title"), "fail");
  assert.equal(status(analyze({ ...base, synonyms: ["chronic care management fees"] }), "kw-title"), "pass");
});

test("readability: long sentences and a wall of text are flagged, short text passes", () => {
  assert.equal(status(analyze(good), "read-sentences"), "pass");
  assert.equal(status(analyze(good), "read-paragraphs"), "pass");
  assert.equal(status(analyze(good), "read-ease"), "pass");
  const long = "This sentence keeps going and going without any real stop because the writer never pauses to breathe or to think about the poor reader. ".repeat(30);
  const r = analyze({ ...good, body: long });
  assert.equal(status(r, "read-sentences"), "fail");
  assert.equal(status(r, "read-paragraphs"), "warn");
  assert.equal(status(r, "read-headings"), "warn");
});

test("link suggestions skip pages already linked and rank keyword mentions first", () => {
  const body = "We explain remote patient monitoring. See [pricing](/pricing).";
  const others = [
    { path: "/pricing", title: "Pricing", keyword: "pricing", tags: ["ccm"] },
    { path: "/resources/rpm", title: "RPM", keyword: "remote patient monitoring", tags: [] },
    { path: "/resources/ccm", title: "CCM", tags: ["ccm", "billing"] },
    { path: "/resources/self", title: "Self", tags: ["ccm"] },
    { path: "/resources/other", title: "Other", tags: ["staffing"] },
  ];
  const s = linkSuggestions({ path: "/resources/self", body, tags: ["ccm", "billing"] }, others);
  assert.deepEqual(s.map((x) => x.path), ["/resources/rpm", "/resources/ccm"]);
  assert.match(s[0].reason, /remote patient monitoring/);
});

test("freshness: old content fails, recent passes, density and reading ease do not change the score", () => {
  const old = analyze({ ...good, updatedAt: "2020-01-01" });
  assert.equal(status(old, "fresh"), "fail");
  assert.equal(status(analyze({ ...good, updatedAt: new Date().toISOString().slice(0, 10) }), "fresh"), "pass");
  const stuffed = analyze({ ...good, body: good.body + "\n\n" + "CCM billing ".repeat(200) });
  assert.equal(stuffed.checks.find((c) => c.id === "kw-usage").weight, 0);
  assert.equal(stuffed.checks.find((c) => c.id === "read-ease").weight, 0);
});
