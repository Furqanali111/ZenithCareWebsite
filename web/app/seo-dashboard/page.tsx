import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { headers } from "next/headers";
import { pageMetadata, pageSeoEntries, fullTitle } from "@/lib/seo";
import { site } from "@/lib/site";
import { getAllPosts, getPostText } from "@/content/posts";
import { analyze, linkSuggestions, type Check, type LinkTarget } from "@/lib/seo-analysis";
import { pageBodies } from "@/lib/page-text";
import { SeoQuickEdit } from "@/components/seo-quick-edit";
import type { EditTarget, EditValues } from "@/lib/seo-edit";

// For the SEO team: every post and edited page with its score, keyword and indexing status.
// Password protected (proxy.ts), noindex, and not in the sitemap. Rendered per request because the
// text of pages written in code is read from the live site.
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

type Row = {
  key: string;
  kind: "Post" | "Page";
  name: string;
  path: string;
  title: string;
  description: string;
  keyword: string;
  noindex: boolean;
  nofollow: boolean;
  score: number;
  checks: Check[];
  suggestions: { path: string; title: string; reason: string }[];
  /** False when the page text could not be read, so only metadata was checked. */
  bodyRead: boolean;
  edit: string;
  target: EditTarget;
  initial: EditValues;
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

function rows(bodies: Record<string, string | null>): Row[] {
  const allPosts = getAllPosts();
  // Everything a post could link to: the other posts and the edited pages.
  const targets: LinkTarget[] = [
    ...allPosts.map((p) => ({ path: `/resources/${p.slug}`, title: p.title, keyword: p.focusKeyword, tags: p.tags })),
    ...pageSeoEntries.filter((e) => !e.noindex).map((e) => ({ path: e.path, title: e.title, keyword: e.focusKeyword })),
  ];
  const posts = allPosts.map((p): Row => {
    const path = `/resources/${p.slug}`;
    const title = fullTitle(p.metaTitle || p.title);
    const body = getPostText(p.slug);
    const a = analyze({
      path,
      title,
      description: p.description,
      focusKeyword: p.focusKeyword,
      synonyms: p.keywordSynonyms,
      body,
      hasCover: !!p.coverImage,
      coverAlt: p.coverAlt,
    });
    return {
      key: path, kind: "Post", name: p.title, path, title, description: p.description,
      keyword: p.focusKeyword ?? "", noindex: !!p.noindex, nofollow: !!p.nofollow,
      score: a.score, checks: a.checks, suggestions: linkSuggestions({ path, body, tags: p.tags }, targets),
      bodyRead: true, edit: editHref("posts", p.slug),
      target: { kind: "post", slug: p.slug },
      initial: { title: p.metaTitle ?? "", description: p.description, focusKeyword: p.focusKeyword ?? "", noindex: !!p.noindex },
    };
  });
  const pages = pageSeoEntries.map((e): Row => {
    const title = fullTitle(e.title);
    const body = bodies[e.path] ?? undefined;
    const a = analyze({ path: e.path, title, description: e.description, focusKeyword: e.focusKeyword, synonyms: e.keywordSynonyms, body });
    return {
      key: e.path, kind: "Page", name: e.path === "/" ? "Home" : e.path, path: e.path, title, description: e.description,
      keyword: e.focusKeyword ?? "", noindex: !!e.noindex, nofollow: !!e.nofollow,
      score: a.score, checks: a.checks, suggestions: [], bodyRead: body !== undefined, edit: editHref(e.singleton),
      target: { kind: "page", singleton: e.singleton, path: e.path },
      initial: { title: e.title, description: e.description, focusKeyword: e.focusKeyword ?? "", noindex: !!e.noindex },
    };
  });
  // Worst first, so the SEO team sees what to fix.
  return [...posts, ...pages].sort((a, b) => a.score - b.score);
}

const scoreLabel = (s: number) => (s >= 80 ? "Good" : s >= 50 ? "Needs work" : "Poor");
const scoreTone = (s: number) =>
  s >= 80 ? "bg-emerald-100 text-emerald-900" : s >= 50 ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900";
const checkMark: Record<Check["status"], string> = { pass: "Pass", warn: "Improve", fail: "Fix", na: "Skipped" };

const descStatus = (d: string) => (!d ? "Missing" : d.length < 140 ? "Too short" : d.length > 160 ? "Too long" : "Good");
const indexStatus = (r: Row) => (r.noindex ? "Noindex" : r.nofollow ? "Index, nofollow" : "Indexed");

/** Approximation of a Google result. Width and line limits are CSS, not exact pixel counts. */
function Snippet({ r, mobile }: { r: Row; mobile?: boolean }) {
  const host = new URL(site.url).host;
  const crumb = r.path === "/" ? "" : ` › ${r.path.slice(1).split("/").join(" › ")}`;
  return (
    <div
      className={`rounded-lg border bg-white p-3 text-left font-sans text-[#202124] ${mobile ? "max-w-[360px]" : "max-w-[600px]"}`}
    >
      <p className="truncate text-xs text-[#4d5156]">{host}{crumb}</p>
      <p className={`text-[#1a0dab] ${mobile ? "line-clamp-2 text-[17px] leading-snug" : "truncate text-xl"}`}>{r.title}</p>
      <p className={`text-sm text-[#4d5156] ${mobile ? "line-clamp-3" : "line-clamp-2"}`}>{r.description || "No meta description. Google will pick text from the page."}</p>
    </div>
  );
}

async function Dashboard() {
  await connection(); // request time: pages are read from the running site
  const all = rows(await pageBodies(await ownOrigin(), pageSeoEntries.map((e) => e.path)));
  const avg = all.length ? Math.round(all.reduce((s, r) => s + r.score, 0) / all.length) : 0;
  const noKeyword = all.filter((r) => !r.keyword).length;
  const noDesc = all.filter((r) => descStatus(r.description) === "Missing").length;
  const hidden = all.filter((r) => r.noindex).length;
  const unread = all.filter((r) => r.kind === "Page" && !r.bodyRead).length;

  return (
    <>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Average score", `${avg} / 100`],
          ["No focus keyword", String(noKeyword)],
          ["No meta description", String(noDesc)],
          ["Hidden from Google", String(hidden)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border bg-card p-4">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-muted-foreground">
        Page text is read from the live site and refreshes every few minutes. Post text comes from the content files.
        {unread > 0 && ` ${unread} pages could not be read, so only their title, description and keyword were checked.`}
      </p>

      <ul className="mt-3 divide-y rounded-lg border bg-card">
        {all.map((r) => (
          <li key={r.key}>
            <details className="group">
              <summary className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-muted/50 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_auto_7rem_9rem]">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{r.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.kind} · {r.path} · {r.title.length} chars</span>
                </span>
                <span className="order-last col-span-2 truncate text-sm text-muted-foreground md:order-none md:col-span-1">
                  {r.keyword || "No focus keyword"}
                </span>
                <span className={`justify-self-end rounded-full px-2.5 py-0.5 text-sm font-medium tabular-nums md:justify-self-start ${scoreTone(r.score)}`}>
                  {r.score} {scoreLabel(r.score)}
                </span>
                <span className="hidden text-sm md:block">{descStatus(r.description)}</span>
                <span className="hidden text-sm md:block">{indexStatus(r)}</span>
              </summary>
              <div className="grid gap-6 border-t bg-muted/30 px-4 py-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Google, desktop</p>
                    <Snippet r={r} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Google, mobile</p>
                    <Snippet r={r} mobile />
                  </div>
                  <SeoQuickEdit target={r.target} initial={r.initial} />
                  <a href={r.edit} className="inline-block text-sm underline underline-offset-2">
                    Open the full editor (all fields, social card, schema){r.kind === "Page" ? `. Find ${r.path} in the list.` : ""}
                  </a>
                </div>
                <div className="space-y-4 text-sm">
                  {[
                    ["SEO", r.checks.filter((c) => !c.id.startsWith("read-"))],
                    ["Readability", r.checks.filter((c) => c.id.startsWith("read-"))],
                  ].map(([group, list]) => (
                    <div key={group as string}>
                      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{group as string}</h3>
                      <ul className="space-y-2">
                        {(list as Check[]).map((c) => (
                          <li key={c.id} className="grid grid-cols-[4.5rem_1fr] gap-2">
                            <span className={`font-medium ${c.status === "pass" ? "text-emerald-700" : c.status === "fail" ? "text-red-700" : c.status === "warn" ? "text-amber-700" : "text-muted-foreground"}`}>
                              {checkMark[c.status]}
                            </span>
                            <span>
                              {c.label}
                              <span className="block text-xs text-muted-foreground">{c.hint}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {r.kind === "Post" && (
                    <div>
                      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Link suggestions</h3>
                      {r.suggestions.length ? (
                        <ul className="space-y-1">
                          {r.suggestions.map((s) => (
                            <li key={s.path}>
                              <span className="font-medium">{s.title}</span> <code className="text-xs">{s.path}</code>
                              <span className="block text-xs text-muted-foreground">{s.reason}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">None. Add focus keywords and tags to get suggestions.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SeoDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">SEO dashboard</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Score and status of every post and edited page, worst first. Open a row for the Google preview, the checklist and a quick edit. A quick edit is saved to a pull request, so it goes live after review, merge and deploy.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Reading the pages...</p>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
