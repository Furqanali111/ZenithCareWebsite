import test from "node:test";
import assert from "node:assert/strict";
import { buildRobots } from "../lib/robots.ts";
import { parseCustomJsonLd } from "../lib/custom-jsonld.ts";
import { htmlToMarkdown } from "../lib/html-to-markdown.ts";
import { validateEdit, patchFrontmatter, patchPageSeo, applyEdit, editFile } from "../lib/seo-edit.ts";
import { analyze } from "../lib/seo-analysis.ts";

const BASE = "https://thezcs.com";
const ROBOTS = "User-agent: *\nAllow: /\nDisallow: /keystatic\nDisallow: /api/keystatic\n";

test("robots: a good file passes and gets the sitemap line added", () => {
  const out = buildRobots(ROBOTS, BASE);
  assert.match(out, /Sitemap: https:\/\/thezcs\.com\/sitemap\.xml/);
  assert.equal(buildRobots(`${ROBOTS}Sitemap: https://thezcs.com/other.xml\n`, BASE).match(/Sitemap/g).length, 1);
});

test("robots: blocking the site, an AI crawler, or dropping the editor rules fails", () => {
  assert.throws(() => buildRobots(`${ROBOTS}Disallow: /\n`, BASE), /whole site/);
  assert.throws(() => buildRobots(`${ROBOTS}\nUser-agent: GPTBot\nDisallow: /private\n`, BASE), /AI crawler/);
  assert.throws(() => buildRobots("User-agent: *\nAllow: /\n", BASE), /\/keystatic/);
  assert.throws(() => buildRobots(`${ROBOTS}Noindex: /x\n`, BASE), /not allowed/);
  // GPTBot with only an Allow, or an empty Disallow, is fine.
  assert.doesNotThrow(() => buildRobots(`${ROBOTS}\nUser-agent: GPTBot\nAllow: /\n`, BASE));
});

test("custom JSON-LD: accepts one object or a list, adds @context, rejects bad input", () => {
  const one = parseCustomJsonLd('{"@type":"Event","name":"Webinar"}', "x");
  assert.equal(one[0]["@context"], "https://schema.org");
  assert.equal(parseCustomJsonLd('[{"@type":"HowTo"},{"@type":["Thing","Product"]}]', "x").length, 2);
  assert.deepEqual(parseCustomJsonLd("  ", "x"), []);
  assert.throws(() => parseCustomJsonLd("{not json", "/about"), /\/about.*not valid JSON/);
  assert.throws(() => parseCustomJsonLd('{"name":"no type"}', "x"), /@type/);
  assert.throws(() => parseCustomJsonLd('["text"]', "x"), /must be an object/);
});

test("html to markdown: headings, links, images, tables; nav and scripts dropped", () => {
  const html = `<html><nav><a href="/x">menu</a></nav><main><script>var a=1</script>
    <h1>CCM &amp; RPM <span>services</span></h1><p>Intro with <a href="/pricing">pricing</a> and
    <a href="https://www.cms.gov/x">CMS</a>.</p><img src="/a.png" alt=""><img src="/b.png">
    <img src="/c.png" alt="A care plan"><ul><li>One</li><li>Two</li></ul>
    <table><tr><td>A</td><td>B</td></tr></table></main><footer>foot</footer></html>`;
  const md = htmlToMarkdown(html);
  assert.match(md, /^# CCM & RPM services/);
  assert.match(md, /\[pricing\]\(\/pricing\)/);
  assert.match(md, /!\[\]\(img\)/); // missing alt kept so it can be flagged
  assert.match(md, /!\[A care plan\]\(img\)/);
  assert.doesNotMatch(md, /menu|foot|var a/);
  assert.equal((md.match(/!\[/g) ?? []).length, 2); // the alt="" decorative image is dropped
  assert.match(md, /\n- One\n- Two/);
  const a = analyze({ path: "/x", title: "CCM and RPM services for practices", description: "d", focusKeyword: "intro", body: md });
  assert.equal(a.checks.find((c) => c.id === "alt").status, "fail");
  assert.equal(a.checks.find((c) => c.id === "kw-first").status, "pass");
});

const post = `---
title: 'CCM Consent: What CMS Requires'
metaTitle: CCM Consent Requirements
description: >-
  Practical guide to consent requirements: what must be documented,
  common mistakes, and how a partner handles it.
tags:
  - ccm
  - consent
readingMinutes: 6
---
Body text stays exactly the same.
`;

test("patch frontmatter: replaces folded text, adds and removes keys, leaves the rest", () => {
  const out = patchFrontmatter(post, { description: 'New "quoted" text', focusKeyword: "ccm consent", metaTitle: null, noindex: true });
  assert.match(out, /description: "New \\"quoted\\" text"\ntags:/);
  assert.match(out, /focusKeyword: "ccm consent"/);
  assert.match(out, /noindex: true/);
  assert.doesNotMatch(out, /metaTitle|Practical guide|common mistakes/);
  assert.match(out, /tags:\n {2}- ccm\n {2}- consent\nreadingMinutes: 6/);
  assert.ok(out.endsWith("Body text stays exactly the same.\n"));
  assert.throws(() => patchFrontmatter("no frontmatter", { a: "b" }), /frontmatter/);
});

test("patch frontmatter keeps CRLF files CRLF", () => {
  const out = patchFrontmatter(post.replace(/\n/g, "\r\n"), { description: "x" });
  assert.ok(!/[^\r]\n/.test(out), "a bare LF slipped in");
});

test("patch page SEO: edits one entry, keeps CRLF, errors on a missing page", () => {
  const json = JSON.stringify({ pages: [{ path: "/", title: "Home", description: "d" }, { path: "/about", title: "About", description: "d" }] }, null, 2).replace(/\n/g, "\r\n") + "\r\n";
  const out = patchPageSeo(json, "/about", { title: "About us", description: "New", focusKeyword: "care team", noindex: true });
  const data = JSON.parse(out);
  assert.deepEqual(data.pages[1], { path: "/about", title: "About us", description: "New", focusKeyword: "care team", noindex: true });
  assert.equal(data.pages[0].title, "Home");
  assert.ok(out.endsWith("}\r\n") && !/[^\r]\n/.test(out));
  assert.throws(() => patchPageSeo(json, "/nope", { title: "t", description: "d", focusKeyword: "", noindex: false }), /No SEO entry/);
});

test("validate edit: limits, shapes and bad addresses are refused", () => {
  const ok = { target: { kind: "post", slug: "ccm-consent" }, values: { title: "", description: "A description", focusKeyword: "ccm", noindex: false } };
  assert.equal(validateEdit(ok).ok, true);
  assert.equal(validateEdit({ ...ok, values: { ...ok.values, description: "" } }).ok, false);
  assert.equal(validateEdit({ ...ok, values: { ...ok.values, title: "x".repeat(61) } }).ok, false);
  assert.equal(validateEdit({ ...ok, target: { kind: "post", slug: "../../etc/passwd" } }).ok, false);
  const page = { target: { kind: "page", singleton: "pageSeo", path: "/about" }, values: { title: "x".repeat(61), description: "d", focusKeyword: "", noindex: false } };
  assert.equal(validateEdit(page).ok, false);
  for (const n of [51, 60]) assert.equal(validateEdit({ ...page, values: { ...page.values, title: "x".repeat(n) } }).ok, true);
  assert.equal(validateEdit({ ...page, values: { ...page.values, title: "About" } }).ok, true);
  assert.equal(validateEdit({ ...page, target: { ...page.target, singleton: "x" } }).ok, false);
  assert.equal(validateEdit(null).ok, false);
  assert.equal(editFile(ok.target), "content/posts/ccm-consent.mdx");
  assert.equal(editFile({ kind: "page", singleton: "serviceSeo", path: "/services/a" }), "content/page-seo-services.json");
});

test("apply edit on a post writes a boolean noindex, not a string", () => {
  const edit = validateEdit({ target: { kind: "post", slug: "a" }, values: { title: "T", description: "D", focusKeyword: "", noindex: true } }).edit;
  assert.match(applyEdit(post, edit), /^noindex: true$/m);
});

test("synonyms are written as a YAML list in a post and an array on a page, and removed when empty", () => {
  const v = { title: "T", description: "D", focusKeyword: "k", noindex: false, synonyms: "ccm billing, chronic billing" };
  const out = applyEdit(post, validateEdit({ target: { kind: "post", slug: "a" }, values: v }).edit);
  assert.match(out, /^keywordSynonyms:\n  - "ccm billing"\n  - "chronic billing"$/m);
  const cleared = applyEdit(out, validateEdit({ target: { kind: "post", slug: "a" }, values: { ...v, synonyms: "" } }).edit);
  assert.doesNotMatch(cleared, /keywordSynonyms/);
});
