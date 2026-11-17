import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { cookies, headers } from "next/headers";
import { pageMetadata, pageSeoEntries, fullTitle } from "@/lib/seo";
import { site } from "@/lib/site";
import { getAllPosts, getPostText } from "@/content/posts";
import { analyze, linkSuggestions, type LinkTarget } from "@/lib/seo-analysis";
import { pageBodies, sitemapPaths } from "@/lib/page-text";
import { pendingLabels, siteIssues, type CheckRow, type HistoryEntry } from "@/lib/seo-site-checks";
import { searchData } from "@/lib/seo-gsc";
import { pendingEdits } from "@/lib/github-save";
import { githubWriter } from "@/lib/github-access";
import { SeoDashboardTable, type DashRow } from "@/components/seo-dashboard-table";
import redirectsFile from "@/content/redirects.json";
import historyFile from "@/content/seo-history.json";

// For the SEO team: every post and edited page with its score, keyword and indexing status.
// Behind the gate in proxy.ts (GitHub sign-in or password), noindex, and not in the sitemap.
// Rendered per request because the text of pages written in code is read from the live site.
// Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
export const metadata: Metadata = pageMetadata({
  title: "SEO dashboard",
  description: "Internal SEO status of every post and page. Not for search engines.",
  path: "/seo-dashboard",
  noindex: true,
});

// Editor deep links. Production opens on develop, where the editor's own popup asks for a branch.
const editHref = (kind: "posts" | "pageSeo" | "serviceSeo", slug?: string) => {
  const base = process.env.NODE_ENV === "development" ? "/keystatic" : "/keystatic/branch/develop";
  return kind === "posts" ? `${base}/collection/posts/item/${slug}` : `${base}/singleton/${kind}`;
};

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
const redirects = (redirectsFile as { exact: { from: string; to: string }[]; prefix: { from: string; to: string }[] }).exact;
const history = (historyFile as { entries: HistoryEntry[] }).entries;

type Extra = { sitemap: string[] | null; pending: Map<string, { url: string; login: string }>; search: Awaited<ReturnType<typeof searchData>>["pages"] };

function rows(bodies: Record<string, string | null>, extra: Extra): { rows: DashRow[]; unread: number } {
  const host = new URL(site.url).host;
  const allPosts = getAllPosts();
  // Everything a post could link to: the other posts and the edited pages.
  const targets: LinkTarget[] = [
    ...allPosts.map((p) => ({ path: `/resources/${p.slug}`, title: p.title, keyword: p.focusKeyword, tags: p.tags })),
    ...pageSeoEntries.filter((e) => !e.noindex).map((e) => ({ path: e.path, title: e.title, keyword: e.focusKeyword })),
  ];
  const base: (DashRow & { canonical?: string; body?: string })[] = [
    ...allPosts.map((p) => {
      const path = `/resources/${p.slug}`;
      const title = fullTitle(p.metaTitle || p.title);
      const body = getPostText(p.slug);
      const a = analyze({ path, title, description: p.description, focusKeyword: p.focusKeyword, synonyms: p.keywordSynonyms, body, hasCover: !!p.coverImage, coverAlt: p.coverAlt });
      return {
        key: path, kind: "Post" as const, name: p.title, path, title, description: p.description,
        keyword: p.focusKeyword ?? "", noindex: !!p.noindex, nofollow: !!p.nofollow,
        score: a.score, checks: a.checks, issues: [], suggestions: linkSuggestions({ path, body, tags: p.tags }, targets),
        bodyRead: true, edit: editHref("posts", p.slug),
        target: { kind: "post" as const, slug: p.slug },
        initial: { title: p.metaTitle ?? "", description: p.description, focusKeyword: p.focusKeyword ?? "", noindex: !!p.noindex },
        canonical: p.canonicalUrl ?? undefined, body,
      };
    }),
    ...pageSeoEntries.map((e) => {
      const title = fullTitle(e.title);
      const body = bodies[e.path] ?? undefined;
      const a = analyze({ path: e.path, title, description: e.description, focusKeyword: e.focusKeyword, synonyms: e.keywordSynonyms, body });
      return {
        key: e.path, kind: "Page" as const, name: e.path === "/" ? "Home" : e.path, path: e.path, title, description: e.description,
        keyword: e.focusKeyword ?? "", noindex: !!e.noindex, nofollow: !!e.nofollow,
        score: a.score, checks: a.checks, issues: [], suggestions: [], bodyRead: body !== undefined, edit: editHref(e.singleton),
        target: { kind: "page" as const, singleton: e.singleton, path: e.path },
        initial: { title: e.title, description: e.description, focusKeyword: e.focusKeyword ?? "", noindex: !!e.noindex },
        canonical: e.canonicalUrl ?? undefined, body,
      };
    }),
  ];

  const issues = siteIssues(
    base.map((r): CheckRow => ({ path: r.path, kind: r.kind, title: r.title, description: r.description, keyword: r.keyword, noindex: r.noindex, canonical: r.canonical, body: r.body })),
    { sitemap: extra.sitemap ? new Set(extra.sitemap) : null, redirects, host },
  );
  const out = base.map((x): DashRow => {
    // The text and canonical were only needed for the checks: keep them out of the data sent to the browser.
    const r: Partial<typeof x> = { ...x };
    delete r.canonical;
    delete r.body;
    return {
      ...(r as DashRow),
      issues: issues.get(x.path) ?? [],
      pending: extra.pending.get(x.target.kind === "post" ? x.target.slug : x.path),
      search: extra.search?.[x.path],
    };
  });
  return { rows: out, unread: out.filter((r) => r.kind === "Page" && !r.bodyRead).length };
}

async function Dashboard() {
  await connection(); // request time: pages are read from the running site
  const origin = await ownOrigin();
  const host = new URL(site.url).host;
  const token = (await cookies()).get("keystatic-gh-access-token")?.value;
  const [bodies, sitemap, open, search, signedInAs] = await Promise.all([
    pageBodies(origin, pageSeoEntries.map((e) => e.path)),
    sitemapPaths(origin, host),
    pendingEdits(token),
    searchData(host),
    githubWriter(token),
  ]);
  const pending = new Map<string, { url: string; login: string }>();
  for (const pr of open ?? []) for (const label of pendingLabels(pr.messages)) pending.set(label, { url: pr.url, login: pr.login });

  const { rows: all, unread } = rows(bodies, { sitemap, pending, search: search.pages });
  return (
    <SeoDashboardTable
      rows={all}
      host={host}
      history={history}
      hasSearch={!!search.pages}
      searchError={search.error}
      unread={unread}
      pendingUnavailable={open === null}
      signedInAs={signedInAs}
    />
  );
}

export default function SeoDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">SEO dashboard</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Score and status of every post and edited page. Filter, sort, export, or switch to the table to edit many rows at once. Edits are saved to a pull request, so they go live after review, merge and deploy.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Reading the pages...</p>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
