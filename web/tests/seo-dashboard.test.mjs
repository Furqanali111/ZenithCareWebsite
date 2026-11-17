import test from "node:test";
import assert from "node:assert/strict";
import {
  parseSitemap, internalLinks, siteIssues, toCsv, pendingLabels, appendHistory, validateHistoryEntry, foldSearchRows, expectedCtr, schemaTypes, snapshotOf, foldPageRows,
} from "../lib/seo-site-checks.ts";

const HOST = "thezcs.com";
// Titles and descriptions are unique per path unless a test sets them, so only the check under test fires.
const row = (over) => ({ path: "/a", kind: "Page", title: `T ${over.path ?? "/a"}`, description: `D ${over.path ?? "/a"}`, keyword: "", noindex: false, ...over });
const ctx = (over) => ({ sitemap: new Set(["/", "/a", "/b"]), redirects: [], host: HOST, ...over });
const codes = (m, path) => (m.get(path) ?? []).map((i) => i.code);

test("sitemap: keeps own-host paths, drops others, trims slashes", () => {
  const xml = "<urlset><url><loc>https://thezcs.com/</loc></url><url><loc>https://www.thezcs.com/a/</loc></url><url><loc>https://evil.com/x</loc></url></urlset>";
  assert.deepEqual([...parseSitemap(xml, HOST)].sort(), ["/", "/a"]);
});

test("links: internal only, no images, query and hash stripped", () => {
  const md = "[a](/a?x=1#y) [b](https://thezcs.com/b/) [ext](https://other.com/c) ![img](/pic) [m](mailto:x@y.z) [h](#top) <a href=\"/c\">c</a>";
  assert.deepEqual(internalLinks(md, HOST).sort(), ["/a", "/b", "/c"]);
});

test("duplicates: title, description and keyword, noindex pages ignored", () => {
  const rows = [
    row({ path: "/a", title: "Same", description: "Same d", keyword: "ccm" }),
    row({ path: "/b", title: "same ", description: "Same d", keyword: "CCM" }),
    row({ path: "/c", title: "Same", noindex: true }),
  ];
  const m = siteIssues(rows, ctx());
  assert.deepEqual(codes(m, "/a").sort(), ["dup-desc", "dup-keyword", "dup-title"]);
  assert.ok(!codes(m, "/c").some((c) => c.startsWith("dup-")));
});

test("links: broken, redirected and self links; skipped when the sitemap is unknown", () => {
  const body = "[ok](/b) [gone](/nope) [moved](/old) [self](/a) [file](/guide.pdf) [feed](/sitemap.xml)";
  const withMap = siteIssues([row({ body })], ctx({ redirects: [{ from: "/old", to: "/b" }] }));
  assert.deepEqual(codes(withMap, "/a").sort(), ["link-broken", "link-redirect"]);
  const noMap = siteIssues([row({ body })], ctx({ sitemap: null, redirects: [{ from: "/old", to: "/b" }] }));
  assert.deepEqual(codes(noMap, "/a"), ["link-redirect"]);
});

test("sitemap and canonical gaps", () => {
  const m = siteIssues(
    [row({ path: "/a", noindex: true }), row({ path: "/z" }), row({ path: "/b", canonical: "https://thezcs.com/a" }), row({ path: "/", canonical: "https://other.com/x" })],
    ctx(),
  );
  assert.deepEqual(codes(m, "/a"), ["noindex-in-sitemap"]);
  assert.deepEqual(codes(m, "/z"), ["not-in-sitemap"]);
  assert.deepEqual(codes(m, "/b"), ["canonical-other"]);
  assert.deepEqual(codes(m, "/"), ["canonical-external"]);
});

test("images without alt text are flagged", () => {
  const m = siteIssues([row({ body: "![](img) ![good](img)" })], ctx());
  assert.deepEqual(codes(m, "/a"), ["img-alt"]);
});

test("csv: quotes, doubles quotes, defuses formulas", () => {
  assert.equal(toCsv(["a", "b"], [["x,y", 'say "hi"'], ["=SUM(A1)", 3]]), '"a","b"\r\n"x,y","say ""hi"""\r\n"\'=SUM(A1)","3"\r\n');
});

test("pending: reads the page from edit commit subjects", () => {
  const set = pendingLabels(["fix(seo): update SEO text for ccm-billing", "fix(seo): update SEO text for /about\n\nbody", "chore(seo): record SEO score snapshot 2026-11-20", "feat: other"]);
  assert.deepEqual([...set].sort(), ["/about", "ccm-billing"]);
});

test("history: appends, replaces the same day, keeps order and the cap", () => {
  const e = (date, average) => ({ date, average, rows: 60, noKeyword: 1, noDescription: 0 });
  let t = '{\r\n  "entries": []\r\n}\r\n';
  t = appendHistory(t, e("2026-11-20", 50));
  t = appendHistory(t, e("2026-11-10", 40));
  t = appendHistory(t, e("2026-11-20", 55));
  const d = JSON.parse(t).entries;
  assert.deepEqual(d.map((x) => [x.date, x.average]), [["2026-11-10", 40], ["2026-11-20", 55]]);
  assert.ok(t.includes("\r\n"));
  assert.equal(JSON.parse(appendHistory(t, e("2026-12-01", 1), 2)).entries.length, 2);
});

test("history: bad snapshots are refused", () => {
  assert.equal(validateHistoryEntry({ date: "20-11-2026", average: 50, rows: 1, noKeyword: 0, noDescription: 0 }).ok, false);
  assert.equal(validateHistoryEntry({ date: "2026-11-20", average: 101, rows: 1, noKeyword: 0, noDescription: 0 }).ok, false);
  assert.equal(validateHistoryEntry({ date: "2026-11-20", average: 50, rows: 1.5, noKeyword: 0, noDescription: 0 }).ok, false);
  assert.equal(validateHistoryEntry({ date: "2026-11-20", average: 50, rows: 60, noKeyword: 2, noDescription: 0 }).ok, true);
});

test("search data: folds queries per page, weights position by impressions, ignores other hosts", () => {
  const rows = [
    { keys: ["https://thezcs.com/a", "ccm billing"], clicks: 4, impressions: 100, position: 3 },
    { keys: ["https://thezcs.com/a", "ccm"], clicks: 0, impressions: 300, position: 7 },
    { keys: ["https://thezcs.com/", "zenith"], clicks: 1, impressions: 10, position: 1 },
    { keys: ["https://other.com/a", "x"], clicks: 9, impressions: 9, position: 1 },
  ];
  const f = foldSearchRows(rows, HOST, 1);
  assert.deepEqual(Object.keys(f).sort(), ["/", "/a"]);
  assert.equal(f["/a"].clicks, 4);
  assert.equal(f["/a"].impressions, 400);
  assert.equal(f["/a"].position, 6);
  assert.equal(f["/a"].ctr, 0.01);
  assert.deepEqual(f["/a"].queries.map((q) => q.query), ["ccm"]);
});

test("links: a link to a hidden page is flagged as noindex, not broken", () => {
  const m = siteIssues([row({ path: "/a", body: "[x](/b)" }), row({ path: "/b", noindex: true })], ctx({ sitemap: new Set(["/", "/a"]) }));
  assert.deepEqual(codes(m, "/a"), ["link-noindex"]);
});

test("pending labels: a batch commit names every page on its own line", () => {
  const set = pendingLabels(["fix(seo): update SEO text for 2 pages\n\nupdate SEO text for /about\nupdate SEO text for ccm-billing","fix(seo): update SEO text for 3 pages"]);
  assert.deepEqual([...set].sort(), ["/about", "ccm-billing"]);
});

test("links through a whole-section redirect are flagged as redirects, not broken", () => {
  const m = siteIssues([row({ path: "/a", body: "[x](/old/page)" })], ctx({ sitemap: new Set(["/", "/a"]), prefixRedirects: [{ from: "/old", to: "/new" }] }));
  assert.deepEqual(codes(m, "/a"), ["link-redirect"]);
  assert.match(m.get("/a")[0].text, /\/new\/page/);
});

test("expected CTR falls with position, and two pages sharing a search are marked as competing", () => {
  assert.ok(expectedCtr(1) > expectedCtr(4) && expectedCtr(4) > expectedCtr(14));
  const rows = [
    { keys: ["https://thezcs.com/a", "ccm billing"], clicks: 1, impressions: 50, position: 5 },
    { keys: ["https://thezcs.com/b", "ccm billing"], clicks: 1, impressions: 40, position: 9 },
    { keys: ["https://thezcs.com/b", "rare"], clicks: 0, impressions: 5, position: 9 },
  ];
  const f = foldSearchRows(rows, HOST);
  assert.deepEqual(f["/a"].competes, [{ query: "ccm billing", path: "/b" }]);
  assert.equal(f["/b"].competes.length, 1);
});

test("orphan: a live page nothing links to is flagged, menu links count, and an unread page switches the check off", () => {
  const rows = [
    row({ path: "/", links: ["/a"] }),
    row({ path: "/a", links: ["/"] }),
    row({ path: "/lonely", links: ["/"] }),
    row({ path: "/hidden", noindex: true, links: [] }),
  ];
  const m = siteIssues(rows, ctx({ sitemap: null }));
  assert.deepEqual(codes(m, "/lonely"), ["orphan"]);
  assert.deepEqual(codes(m, "/a"), []);
  assert.deepEqual(codes(m, "/hidden"), []); // hidden pages are not expected to be linked
  const unread = siteIssues([...rows.slice(0, 3), row({ path: "/x" })], ctx({ sitemap: null }));
  assert.deepEqual(codes(unread, "/lonely"), []);
});

test("schema types are read from every JSON-LD block, nested and in @graph", () => {
  const html = `<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization"},{"@type":["WebPage","FAQPage"],"mainEntity":[{"@type":"Question"}]}]}</script><script type="application/ld+json">{bad</script>`;
  assert.deepEqual(schemaTypes(html).sort(), ["(invalid JSON-LD)", "FAQPage", "Organization", "Question", "WebPage"]);
  assert.deepEqual(schemaTypes("<p>none</p>"), []);
});

test("snapshots carry every page score, and a bad page map is refused", () => {
  const s = snapshotOf([{ path: "/a", score: 80, keyword: "k", description: "d" }, { path: "/b", score: 40, keyword: "", description: "" }], "2026-11-23");
  assert.deepEqual([s.average, s.rows, s.noKeyword, s.noDescription, s.pages["/b"]], [60, 2, 1, 1, 40]);
  assert.equal(validateHistoryEntry(s).ok, true);
  assert.equal(validateHistoryEntry({ ...s, pages: { "../x": 5 } }).ok, false);
  assert.equal(validateHistoryEntry({ ...s, pages: { "/a": 101 } }).ok, false);
});

test("previous period totals are folded per page path", () => {
  const f = foldPageRows([{ keys: ["https://thezcs.com/a/"], clicks: 3, impressions: 90, position: 8 }, { keys: ["https://other.com/a"], clicks: 9, impressions: 9, position: 1 }], HOST);
  assert.deepEqual(f, { "/a": { clicks: 3, impressions: 90, position: 8 } });
});
