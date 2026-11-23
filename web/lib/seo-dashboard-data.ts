import { cookies, headers } from "next/headers";
import { pageSeoEntries, fullTitle } from "@/lib/seo";
import { site } from "@/lib/site";
import { BASE_BRANCH } from "@/lib/repo";
import { getAllPosts, getDashboardPosts, getPostText } from "@/content/posts";
import { analyze, linkSuggestions, type LinkTarget } from "@/lib/seo-analysis";
import { cptCodes, cptPath } from "@/lib/cpt-codes";
import { denialCodes, denialPath } from "@/lib/denial-codes";
import { pageBodies, sitemapPaths, type PageRead } from "@/lib/page-text";
import { pendingLabels, siteIssues, snapshotOf, type CheckRow, type HistoryEntry } from "@/lib/seo-site-checks";
import { indexData, searchData } from "@/lib/seo-gsc";
import { cwvData } from "@/lib/seo-cwv";
import { pendingEdits } from "@/lib/github-save";
import { githubWriter } from "@/lib/github-access";
import type { DashRow } from "@/components/seo-dashboard-table";
import redirectsFile from "@/content/redirects.json";
import historyFile from "@/content/seo-history.json";

/**
 * Everything the SEO dashboard shows, built on the server. Used by the page and by /api/seo-snapshot
 * (the weekly score snapshot), so both always agree. Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
const keystatic = () => (process.env.NODE_ENV === "development" ? "/keystatic" : `/keystatic/branch/${BASE_BRANCH}`);
// Editor deep links. Production opens on develop, where the editor's own popup asks for a branch.
const editHref = (kind: "posts" | "pageSeo" | "serviceSeo", slug?: string) =>
  kind === "posts" ? `${keystatic()}/collection/posts/item/${slug}` : `${keystatic()}/singleton/${kind}`;
const codeEditHref = (collection: "cptCodes" | "denialCodes", slug: string) => `${keystatic()}/collection/${collection}/item/${slug}`;

/** The address of this site as the request reached it, limited to hosts that are ours. */
async function ownOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const known = new URL(site.url).host;
  if (!(host === known || host === `www.${known}` || /^localhost(:\d+)?$/.test(host) || host.endsWith(".vercel.app"))) return site.url;
  const proto = h.get("x-forwarded-proto")?.split(",")[0] ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// Empty JSON arrays infer as never[], so give the files their real shape.
const { exact: redirects, prefix: prefixRedirects } = redirectsFile as { exact: { from: string; to: string }[]; prefix: { from: string; to: string }[] };
const history = (historyFile as { entries: HistoryEntry[] }).entries;

type Extra = {
  sitemap: string[] | null;
  pending: Map<string, NonNullable<DashRow["pending"]>>;
  search: Awaited<ReturnType<typeof searchData>>["pages"];
  index: Awaited<ReturnType<typeof indexData>>["status"];
};

function buildRows(bodies: Record<string, PageRead | null>, extra: Extra): { rows: DashRow[]; unread: number } {
  const host = new URL(site.url).host;
  const live = getAllPosts();
  const lastPages = [...history].reverse().find((e) => e.pages)?.pages;
  // Everything a post could link to: the live posts and the edited pages.
  const targets: LinkTarget[] = [
    ...live.map((p) => ({ path: `/resources/${p.slug}`, title: p.title, keyword: p.focusKeyword, tags: p.tags })),
    ...pageSeoEntries.filter((e) => !e.noindex).map((e) => ({ path: e.path, title: e.title, keyword: e.focusKeyword })),
  ];
  const base: (DashRow & { canonical?: string; body?: string; links?: string[]; unpublished?: boolean })[] = [
    ...getDashboardPosts().map((p) => {
      const path = `/resources/${p.slug}`;
      const title = fullTitle(p.metaTitle || p.title);
      const body = getPostText(p.slug);
      const a = analyze({ path, title, description: p.description, focusKeyword: p.focusKeyword, synonyms: p.keywordSynonyms, body, hasCover: !!p.coverImage, coverAlt: p.coverAlt, updatedAt: p.updatedAt });
      const unpublished = p.status !== "Published";
      return {
        key: path, kind: "Post" as const, name: p.title, path, title, description: p.description,
        keyword: p.focusKeyword ?? "", noindex: !!p.noindex, nofollow: !!p.nofollow,
        status: unpublished ? (p.status as "Draft" | "Scheduled") : undefined,
        score: a.score, checks: a.checks, issues: [], suggestions: linkSuggestions({ path, body, tags: p.tags }, targets),
        bodyRead: true, edit: editHref("posts", p.slug),
        target: { kind: "post" as const, slug: p.slug },
        initial: { title: p.metaTitle ?? "", description: p.description, focusKeyword: p.focusKeyword ?? "", noindex: !!p.noindex, synonyms: (p.keywordSynonyms ?? []).join(", ") },
        canonical: p.canonicalUrl ?? undefined, body, unpublished,
      };
    }),
    ...pageSeoEntries.map((e) => {
      const title = fullTitle(e.title);
      const read = bodies[e.path] ?? undefined;
      const a = analyze({ path: e.path, title, description: e.description, focusKeyword: e.focusKeyword, synonyms: e.keywordSynonyms, body: read?.md });
      return {
        key: e.path, kind: "Page" as const, name: e.path === "/" ? "Home" : e.path, path: e.path, title, description: e.description,
        keyword: e.focusKeyword ?? "", noindex: !!e.noindex, nofollow: !!e.nofollow,
        score: a.score, checks: a.checks, issues: [], suggestions: [], bodyRead: !!read, edit: editHref(e.singleton),
        target: { kind: "page" as const, singleton: e.singleton, path: e.path },
        initial: { title: e.title, description: e.description, focusKeyword: e.focusKeyword ?? "", noindex: !!e.noindex, synonyms: (e.keywordSynonyms ?? []).join(", ") },
        canonical: e.canonicalUrl ?? undefined, body: read?.md, links: read?.links, schema: read?.schema,
      };
    }),
    // CPT and denial code pages: read only here (the code in the title is their keyword), edited in their own collections.
    ...[
      ...cptCodes.map((c) => ({ path: cptPath(c.code), name: `CPT ${c.code}`, title: `CPT ${c.code}: ${c.shortTitle}`, description: c.metaDescription, keyword: `CPT ${c.code}`, edit: codeEditHref("cptCodes", c.code) })),
      ...denialCodes.map((d) => ({ path: denialPath(d.slug), name: `${d.code} denial`, title: `${d.code} Denial: ${d.shortTitle}`, description: d.metaDescription, keyword: `${d.code} denial`, edit: codeEditHref("denialCodes", d.slug) })),
    ].map((c) => {
      const title = fullTitle(c.title);
      const read = bodies[c.path] ?? undefined;
      const a = analyze({ path: c.path, title, description: c.description, focusKeyword: c.keyword, body: read?.md });
      return {
        key: c.path, kind: "Code page" as const, name: c.name, path: c.path, title, description: c.description,
        keyword: c.keyword, noindex: false, nofollow: false,
        score: a.score, checks: a.checks, issues: [], suggestions: [], bodyRead: !!read, edit: c.edit,
        body: read?.md, links: read?.links, schema: read?.schema,
      };
    }),
  ];

  const issues = siteIssues(
    // A draft or scheduled post is not live: it is checked like a hidden page.
    base.map((r): CheckRow => ({ path: r.path, kind: r.kind, title: r.title, description: r.description, keyword: r.keyword, noindex: r.noindex || !!r.unpublished, canonical: r.canonical, body: r.body, links: r.links })),
    { sitemap: extra.sitemap ? new Set(extra.sitemap) : null, redirects, prefixRedirects, host },
  );
  const out = base.map((x): DashRow => {
    // The text, canonical and links were only needed for the checks: keep them out of the data sent to the browser.
    const r: Partial<typeof x> = { ...x };
    delete r.canonical;
    delete r.body;
    delete r.links;
    delete r.unpublished;
    const before = lastPages?.[x.path];
    return {
      ...(r as DashRow),
      issues: issues.get(x.path) ?? [],
      pending: extra.pending.get(x.target?.kind === "post" ? x.target.slug : x.path),
      search: extra.search?.[x.path],
      index: extra.index?.[x.path],
      delta: before === undefined ? undefined : x.score - before,
    };
  });
  return { rows: out, unread: out.filter((r) => r.kind !== "Post" && !r.bodyRead).length };
}

/** Everything the dashboard needs. Call at request time: pages are read from the running site. */
export async function loadDashboard() {
  const origin = await ownOrigin();
  const host = new URL(site.url).host;
  const token = (await cookies()).get("keystatic-gh-access-token")?.value;
  // Pages Google could index: asked about once a day.
  const inspect = [
    ...getAllPosts().filter((p) => !p.noindex).map((p) => `/resources/${p.slug}`),
    ...pageSeoEntries.filter((e) => !e.noindex).map((e) => e.path),
    ...cptCodes.map((c) => cptPath(c.code)),
    ...denialCodes.map((d) => denialPath(d.slug)),
  ];
  const [bodies, sitemap, open, search, index, cwv, signedInAs] = await Promise.all([
    pageBodies(origin, host, [...pageSeoEntries.map((e) => e.path), ...cptCodes.map((c) => cptPath(c.code)), ...denialCodes.map((d) => denialPath(d.slug))]),
    sitemapPaths(origin, host),
    pendingEdits(token),
    searchData(host),
    indexData(site.url, inspect),
    cwvData(site.url),
    githubWriter(token),
  ]);
  const pending: Extra["pending"] = new Map();
  for (const pr of open ?? []) for (const label of pendingLabels(pr.messages)) pending.set(label, { login: pr.login, failed: pr.failed });

  const { rows, unread } = buildRows(bodies, { sitemap, pending, search: search.pages, index: index.status });
  return {
    rows,
    unread,
    host,
    // The per-page scores are only used for the change arrows (above): keep them out of the browser payload.
    history: history.map((e) => ({ date: e.date, average: e.average, rows: e.rows, noKeyword: e.noKeyword, noDescription: e.noDescription })),
    hasSearch: !!search.pages,
    searchError: search.error,
    hasIndex: !!index.status,
    indexError: index.error,
    indexMissing: index.missing,
    vitals: cwv.vitals,
    vitalsNote: cwv.note,
    pendingUnavailable: open === null,
    signedInAs,
    canSave: process.env.NODE_ENV === "development" || !!signedInAs,
    titleParts: fullTitle("\u0000").split("\u0000") as [string, string],
  };
}

/** Today's snapshot for the weekly job: live pages only, with every page's score. */
export async function currentSnapshot() {
  const { rows } = await loadDashboard();
  return snapshotOf(rows.filter((r) => !r.status), new Date().toISOString().slice(0, 10));
}
