/**
 * Site-wide checks and small helpers for /seo-dashboard. Pure functions, no imports, so the node
 * tests can run them. The per-page score lives in seo-analysis.ts. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */

import { LINK } from "./seo-analysis.ts"; // the .ts extension lets the node tests load this file

export type CheckRow = {
  path: string;
  kind: "Post" | "Page";
  title: string;
  description: string;
  keyword: string;
  noindex: boolean;
  /** Canonical address set in the editor, if any. */
  canonical?: string;
  /** Page text as markdown, when it could be read. */
  body?: string;
};

export type SiteContext = {
  /** Paths in the live sitemap. null when the sitemap could not be read: the checks that need it are skipped. */
  sitemap: Set<string> | null;
  redirects: { from: string; to: string }[];
  /** The site's own host, for example thezcs.com. */
  host: string;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** Paths in a sitemap.xml. Any address on another host is ignored. */
export function parseSitemap(xml: string, host: string): Set<string> {
  const out = new Set<string>();
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    try {
      const u = new URL(m[1].replace(/&amp;/g, "&"));
      if (u.host.replace(/^www\./, "") === host.replace(/^www\./, "")) out.add(trimSlash(u.pathname));
    } catch {
      // Not a URL: ignored.
    }
  }
  return out;
}

/** Internal link targets in markdown or HTML-like text: paths only, no query or hash, no images. */
export function internalLinks(text: string, host: string): string[] {
  const found = new Set<string>();
  const add = (raw: string) => {
    let href = raw.trim();
    if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    if (/^https?:\/\//i.test(href) || href.startsWith("//")) {
      try {
        const u = new URL(href.startsWith("//") ? `https:${href}` : href);
        if (u.host.replace(/^www\./, "") !== host.replace(/^www\./, "")) return;
        href = u.pathname;
      } catch {
        return;
      }
    }
    if (!href.startsWith("/")) return; // relative links are not used on this site
    found.add(trimSlash(href.split(/[?#]/)[0]));
  };
  for (const m of text.matchAll(LINK)) add(m[1]);
  for (const m of text.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)) add(m[1]);
  return [...found];
}

export type SiteIssue = { level: "fix" | "warn"; code: string; text: string };

/** Problems that need more than one page to see: duplicates, broken links, sitemap and canonical gaps. */
export function siteIssues(rows: CheckRow[], ctx: SiteContext): Map<string, SiteIssue[]> {
  const issues = new Map<string, SiteIssue[]>(rows.map((r) => [r.path, []]));
  const add = (path: string, i: SiteIssue) => issues.get(path)?.push(i);
  const indexable = rows.filter((r) => !r.noindex);

  const group = (pick: (r: CheckRow) => string) => {
    const g = new Map<string, CheckRow[]>();
    for (const r of indexable) {
      const k = norm(pick(r));
      if (k) g.set(k, [...(g.get(k) ?? []), r]);
    }
    return [...g.values()].filter((x) => x.length > 1);
  };
  const others = (list: CheckRow[], me: CheckRow) => list.filter((r) => r !== me).map((r) => r.path).join(", ");
  for (const list of group((r) => r.title))
    for (const r of list) add(r.path, { level: "warn", code: "dup-title", text: `Same SEO title as ${others(list, r)}.` });
  for (const list of group((r) => r.description))
    for (const r of list) add(r.path, { level: "warn", code: "dup-desc", text: `Same meta description as ${others(list, r)}.` });
  for (const list of group((r) => r.keyword))
    for (const r of list) add(r.path, { level: "warn", code: "dup-keyword", text: `Same focus keyword as ${others(list, r)}. These pages compete for one search.` });

  const redirected = new Map(ctx.redirects.map((r) => [trimSlash(r.from), trimSlash(r.to)]));
  for (const r of rows) {
    if (r.body) {
      for (const target of internalLinks(r.body, ctx.host)) {
        if (target === r.path || /\.[a-z0-9]{2,5}$/i.test(target)) continue; // files (pdf, images, xml) are not sitemap pages
        if (redirected.has(target)) add(r.path, { level: "warn", code: "link-redirect", text: `Links to ${target}, which redirects to ${redirected.get(target)}. Link straight to the new address.` });
        else if (ctx.sitemap && !ctx.sitemap.has(target) && !/^\/(api|keystatic|_next)\b/.test(target))
          add(r.path, { level: "fix", code: "link-broken", text: `Links to ${target}, which is not in the sitemap. It may be broken, noindexed or an unlisted page.` });
      }
      const noAlt = (r.body.match(/!\[\]\([^)]*\)/g) ?? []).length;
      if (noAlt) add(r.path, { level: "warn", code: "img-alt", text: `${noAlt} image${noAlt > 1 ? "s have" : " has"} no alt text.` });
    }
    if (ctx.sitemap) {
      const inMap = ctx.sitemap.has(trimSlash(r.path));
      if (!r.noindex && !inMap) add(r.path, { level: "warn", code: "not-in-sitemap", text: "Indexable but missing from the sitemap." });
      if (r.noindex && inMap) add(r.path, { level: "fix", code: "noindex-in-sitemap", text: "Hidden from Google but listed in the sitemap." });
    }
    if (r.canonical) {
      let path: string | null = null;
      try {
        const u = new URL(r.canonical);
        path = u.host.replace(/^www\./, "") === ctx.host.replace(/^www\./, "") ? trimSlash(u.pathname) : null;
      } catch {
        path = null;
      }
      if (path === null) add(r.path, { level: "warn", code: "canonical-external", text: `Canonical points to another site (${r.canonical}). This page will not rank itself.` });
      else if (path !== trimSlash(r.path)) add(r.path, { level: "warn", code: "canonical-other", text: `Canonical points to ${path}, so Google will index that page instead of this one.` });
    }
  }
  return issues;
}

/** Spreadsheet-safe CSV: quotes everything and defuses cells a spreadsheet would run as a formula. */
export function toCsv(header: string[], rows: (string | number | boolean)[][]): string {
  const cell = (v: string | number | boolean) => {
    const s = String(v);
    return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  return [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

/** Titles of open edit PRs: commit subjects are "fix(seo): update SEO text for <slug or path>". */
export function pendingLabels(commitMessages: string[]): Set<string> {
  const out = new Set<string>();
  for (const m of commitMessages) {
    const hit = m.split("\n")[0].match(/^fix\(seo\): update SEO text for (\S+)$/);
    if (hit) out.add(hit[1]);
  }
  return out;
}

export type HistoryEntry = { date: string; average: number; rows: number; noKeyword: number; noDescription: number };

/** Adds one snapshot to the history file text. The same day is replaced, the list is capped. */
export function appendHistory(jsonText: string, entry: HistoryEntry, keep = 156): string {
  const eol = jsonText.includes("\r\n") ? "\r\n" : "\n";
  const data = JSON.parse(jsonText) as { entries: HistoryEntry[] };
  data.entries = [...data.entries.filter((e) => e.date !== entry.date), entry].sort((a, b) => a.date.localeCompare(b.date)).slice(-keep);
  return JSON.stringify(data, null, 2).replace(/\n/g, eol) + eol;
}

export function validateHistoryEntry(raw: unknown): { ok: true; entry: HistoryEntry } | { ok: false; error: string } {
  const e = raw as Record<string, unknown> | null;
  const n = (x: unknown) => typeof x === "number" && Number.isInteger(x) && x >= 0 && x <= 100000;
  if (!e || typeof e.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !n(e.average) || (e.average as number) > 100 || !n(e.rows) || !n(e.noKeyword) || !n(e.noDescription))
    return { ok: false, error: "Bad snapshot." };
  return { ok: true, entry: { date: e.date, average: e.average as number, rows: e.rows as number, noKeyword: e.noKeyword as number, noDescription: e.noDescription as number } };
}

export type GscRow = { keys: string[]; clicks: number; impressions: number; position: number };
export type PageSearch = { clicks: number; impressions: number; ctr: number; position: number; queries: { query: string; clicks: number; impressions: number; position: number }[] };

/** Search Console rows with dimensions [page, query] folded into one summary per page path. */
export function foldSearchRows(rows: GscRow[], host: string, topQueries = 5): Record<string, PageSearch> {
  const out: Record<string, PageSearch & { weighted: number }> = {};
  for (const r of rows) {
    let path: string;
    try {
      const u = new URL(r.keys[0]);
      if (u.host.replace(/^www\./, "") !== host.replace(/^www\./, "")) continue;
      path = trimSlash(u.pathname);
    } catch {
      continue;
    }
    const p = (out[path] ??= { clicks: 0, impressions: 0, ctr: 0, position: 0, queries: [], weighted: 0 });
    p.clicks += r.clicks;
    p.impressions += r.impressions;
    p.weighted += r.position * r.impressions;
    p.queries.push({ query: r.keys[1], clicks: r.clicks, impressions: r.impressions, position: r.position });
  }
  for (const p of Object.values(out)) {
    p.ctr = p.impressions ? p.clicks / p.impressions : 0;
    p.position = p.impressions ? p.weighted / p.impressions : 0;
    p.queries = p.queries.sort((a, b) => b.impressions - a.impressions).slice(0, topQueries);
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { clicks: v.clicks, impressions: v.impressions, ctr: v.ctr, position: v.position, queries: v.queries }]));
}
