"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeoQuickEdit } from "@/components/seo-quick-edit";
import { LIMITS, validateEdit, type EditTarget, type EditValues } from "@/lib/seo-edit";
import { toCsv, type HistoryEntry, type PageSearch, type SiteIssue } from "@/lib/seo-site-checks";
import type { Check } from "@/lib/seo-analysis";

/** One post or page, with everything the dashboard shows. Built on the server, so it must stay plain data. */
export type DashRow = {
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
  issues: SiteIssue[];
  suggestions: { path: string; title: string; reason: string }[];
  /** False when the page text could not be read, so only metadata was checked. */
  bodyRead: boolean;
  edit: string;
  target: EditTarget;
  initial: EditValues;
  /** An open pull request already holds an edit for this row. */
  pending?: { url: string; login: string };
  search?: PageSearch;
};

type Props = {
  rows: DashRow[];
  host: string;
  history: HistoryEntry[];
  /** Search Console is connected. */
  hasSearch: boolean;
  searchError?: string;
  /** Pages that were not analysed from their text. */
  unread: number;
  /** GitHub could not be read, so "Edit in a pull request" badges may be missing. */
  pendingUnavailable?: boolean;
  signedInAs: string | null;
};

const descStatus = (d: string) => (!d ? "Missing" : d.length < 140 ? "Too short" : d.length > 160 ? "Too long" : "Good");
const indexStatus = (r: DashRow) => (r.noindex ? "Noindex" : r.nofollow ? "Index, nofollow" : "Indexed");
const scoreLabel = (s: number) => (s >= 80 ? "Good" : s >= 50 ? "Needs work" : "Poor");
const scoreTone = (s: number) => (s >= 80 ? "bg-emerald-100 text-emerald-900" : s >= 50 ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900");
const checkMark: Record<Check["status"], string> = { pass: "Pass", warn: "Improve", fail: "Fix", na: "Skipped" };
const lowCtr = (r: DashRow) => !!r.search && r.search.impressions >= 100 && r.search.ctr < 0.01;

const FILTERS: Record<string, { label: string; test: (r: DashRow) => boolean; needsSearch?: boolean }> = {
  all: { label: "All", test: () => true },
  poor: { label: "Score under 80", test: (r) => r.score < 80 },
  keyword: { label: "No focus keyword", test: (r) => !r.keyword },
  desc: { label: "Meta description problem", test: (r) => descStatus(r.description) !== "Good" },
  noindex: { label: "Hidden from Google", test: (r) => r.noindex },
  dup: { label: "Duplicate title, description or keyword", test: (r) => r.issues.some((i) => i.code.startsWith("dup-")) },
  site: { label: "Link, sitemap or canonical problem", test: (r) => r.issues.some((i) => !i.code.startsWith("dup-")) },
  pending: { label: "Edit waiting in a pull request", test: (r) => !!r.pending },
  ctr: { label: "Seen often, rarely clicked", test: lowCtr, needsSearch: true },
};

const SORTS: Record<string, { label: string; cmp: (a: DashRow, b: DashRow) => number; needsSearch?: boolean }> = {
  worst: { label: "Worst score first", cmp: (a, b) => a.score - b.score },
  best: { label: "Best score first", cmp: (a, b) => b.score - a.score },
  name: { label: "Name A to Z", cmp: (a, b) => a.name.localeCompare(b.name) },
  title: { label: "Longest SEO title first", cmp: (a, b) => b.title.length - a.title.length },
  clicks: { label: "Most clicks first", cmp: (a, b) => (b.search?.clicks ?? -1) - (a.search?.clicks ?? -1), needsSearch: true },
  impr: { label: "Most impressions first", cmp: (a, b) => (b.search?.impressions ?? -1) - (a.search?.impressions ?? -1), needsSearch: true },
};

/** Approximation of a Google result. Width and line limits are CSS, not exact pixel counts. */
function Snippet({ r, host, mobile }: { r: DashRow; host: string; mobile?: boolean }) {
  const crumb = r.path === "/" ? "" : ` › ${r.path.slice(1).split("/").join(" › ")}`;
  return (
    <div className={`rounded-lg border bg-white p-3 text-left font-sans text-[#202124] ${mobile ? "max-w-[360px]" : "max-w-[600px]"}`}>
      <p className="truncate text-xs text-[#4d5156]">{host}{crumb}</p>
      <p className={`text-[#1a0dab] ${mobile ? "line-clamp-2 text-[17px] leading-snug" : "truncate text-xl"}`}>{r.title}</p>
      <p className={`text-sm text-[#4d5156] ${mobile ? "line-clamp-3" : "line-clamp-2"}`}>{r.description || "No meta description. Google will pick text from the page."}</p>
    </div>
  );
}

/** Average score over time. One series, so no legend: the heading names it. The table below is the text version. */
function Trend({ history }: { history: HistoryEntry[] }) {
  if (history.length < 2) return <p className="text-xs text-muted-foreground">{history.length ? "One snapshot so far. Record another later to see a trend." : "No snapshots yet."}</p>;
  const W = 220;
  const H = 48;
  const x = (i: number) => 6 + (i * (W - 12)) / (history.length - 1);
  // The vertical range fits the data (at least 10 points tall), so small moves stay visible. The ends are labelled below.
  const lo = Math.max(0, Math.min(...history.map((e) => e.average)) - 5);
  const hi = Math.min(100, Math.max(...history.map((e) => e.average), lo + 10) + 5);
  const y = (v: number) => 6 + ((hi - v) * (H - 12)) / (hi - lo);
  const pts = history.map((e, i) => `${x(i).toFixed(1)},${y(e.average).toFixed(1)}`).join(" ");
  const last = history[history.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`Average SEO score from ${history[0].average} on ${history[0].date} to ${last.average} on ${last.date}`} className="text-primary">
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {history.map((e, i) => (
          <circle key={e.date} cx={x(i)} cy={y(e.average)} r="4" fill="currentColor" stroke="var(--background, #fff)" strokeWidth="2">
            <title>{`${e.date}: average ${e.average} / 100, ${e.rows} pages`}</title>
          </circle>
        ))}
      </svg>
      <p className="text-xs tabular-nums text-muted-foreground">{history[0].date}: {history[0].average}, {last.date}: {last.average}</p>
      <details className="mt-1 text-xs">
        <summary className="cursor-pointer text-muted-foreground">Show as a table</summary>
        <table className="mt-1 w-full max-w-xs text-left tabular-nums">
          <thead><tr><th className="pr-3 font-medium">Date</th><th className="pr-3 font-medium">Average</th><th className="pr-3 font-medium">No keyword</th><th className="font-medium">No description</th></tr></thead>
          <tbody>
            {[...history].reverse().slice(0, 12).map((e) => (
              <tr key={e.date}><td className="pr-3">{e.date}</td><td className="pr-3">{e.average}</td><td className="pr-3">{e.noKeyword}</td><td>{e.noDescription}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

type Saved = Record<string, { url: string; login: string }>;
type BulkState = Record<string, { kind: "saving" } | { kind: "ok"; text: string } | { kind: "error"; text: string }>;
const BULK_MAX = 25;

export function SeoDashboardTable({ rows, host, history, hasSearch, searchError, unread, pendingUnavailable, signedInAs }: Props) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("worst");
  const [bulk, setBulk] = useState(false);
  const [saved, setSaved] = useState<Saved>({});
  const [drafts, setDrafts] = useState<Record<string, EditValues>>({});
  // What a row holds after a save: the server data on this page is old until the next deploy.
  const [base, setBase] = useState<Record<string, EditValues>>({});
  const [bulkState, setBulkState] = useState<BulkState>({});
  const [snap, setSnap] = useState<{ kind: "idle" | "saving" } | { kind: "ok"; url?: string; text: string } | { kind: "error"; text: string }>({ kind: "idle" });

  const withPending = useMemo(() => rows.map((r) => (saved[r.key] ? { ...r, pending: saved[r.key] } : r)), [rows, saved]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return withPending
      .filter((r) => (kind === "all" || r.kind === kind) && FILTERS[filter].test(r) && (!needle || `${r.name} ${r.path} ${r.title} ${r.keyword}`.toLowerCase().includes(needle)))
      .sort(SORTS[sort].cmp);
  }, [withPending, q, kind, filter, sort]);

  const baseOf = (r: DashRow) => base[r.key] ?? r.initial;
  const draftOf = (r: DashRow) => drafts[r.key] ?? baseOf(r);
  // Every edited row, also the ones a filter hides now, so Save never skips an edit you can no longer see.
  const changed = withPending.filter((r) => JSON.stringify(draftOf(r)) !== JSON.stringify(baseOf(r)));
  const changedHidden = changed.filter((r) => !shown.includes(r)).length;
  const errorOf = (r: DashRow) => {
    const v = validateEdit({ target: r.target, values: draftOf(r) });
    return v.ok ? null : v.error;
  };

  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
  const stats = {
    noKeyword: rows.filter((r) => !r.keyword).length,
    noDescription: rows.filter((r) => descStatus(r.description) === "Missing").length,
    hidden: rows.filter((r) => r.noindex).length,
    duplicates: rows.filter(FILTERS.dup.test).length,
    siteProblems: rows.filter(FILTERS.site.test).length,
  };

  function exportCsv() {
    const csv = toCsv(
      ["Type", "Name", "Path", "Score", "Focus keyword", "SEO title", "Title length", "Meta description", "Description status", "Indexing", "Problems", ...(hasSearch ? ["Clicks (28 days)", "Impressions", "Average position"] : [])],
      shown.map((r) => [
        r.kind, r.name, r.path, r.score, r.keyword, r.title, r.title.length, r.description, descStatus(r.description), indexStatus(r),
        [...r.checks.filter((c) => c.status === "fail").map((c) => c.label), ...r.issues.map((i) => i.text)].join(" | "),
        ...(hasSearch ? [r.search?.clicks ?? "", r.search?.impressions ?? "", r.search ? r.search.position.toFixed(1) : ""] : []),
      ]),
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
    a.download = `seo-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function post(body: unknown) {
    const res = await fetch("/api/seo-edit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string; message?: string };
    if (!res.ok) throw new Error(data.error ?? `Save failed (${res.status}).`);
    return data;
  }

  async function saveBulk() {
    // One at a time: every save is a commit on the same branch, and parallel commits would collide.
    for (const r of changed.slice(0, BULK_MAX)) {
      if (errorOf(r)) continue;
      setBulkState((s) => ({ ...s, [r.key]: { kind: "saving" } }));
      try {
        const data = await post({ target: r.target, values: draftOf(r) });
        setBulkState((s) => ({ ...s, [r.key]: { kind: "ok", text: data.url ? "Saved to a pull request" : (data.message ?? "Saved") } }));
        if (data.url) setSaved((s) => ({ ...s, [r.key]: { url: data.url as string, login: signedInAs ?? "you" } }));
        setBase((b) => ({ ...b, [r.key]: draftOf(r) }));
        setDrafts((d) => Object.fromEntries(Object.entries(d).filter(([k]) => k !== r.key)));
      } catch (e) {
        const text = e instanceof Error ? e.message : "Save failed.";
        setBulkState((s) => ({ ...s, [r.key]: { kind: "error", text } }));
        if (/sign in|expired/i.test(text)) break; // every later save would fail the same way
      }
    }
  }

  async function recordSnapshot() {
    setSnap({ kind: "saving" });
    try {
      const data = await post({ snapshot: { date: new Date().toISOString().slice(0, 10), average: avg, rows: rows.length, noKeyword: stats.noKeyword, noDescription: stats.noDescription } });
      setSnap({ kind: "ok", url: data.url, text: data.url ? "Saved to a pull request. It shows here after merge and deploy." : (data.message ?? "Saved.") });
    } catch (e) {
      setSnap({ kind: "error", text: e instanceof Error ? e.message : "Save failed." });
    }
  }

  const select = "h-9 rounded-md border bg-background px-2 text-sm";
  return (
    <>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          ["Average score", `${avg} / 100`],
          ["No focus keyword", stats.noKeyword],
          ["No meta description", stats.noDescription],
          ["Duplicates", stats.duplicates],
          ["Link, sitemap or canonical problems", stats.siteProblems],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border bg-card p-4">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div>
          <h2 className="mb-1 text-sm font-medium">Average score over time</h2>
          <Trend history={history} />
        </div>
        <div className="space-y-1 text-sm sm:justify-self-end sm:text-right">
          <Button type="button" size="sm" variant="outline" onClick={recordSnapshot} disabled={snap.kind === "saving"}>
            {snap.kind === "saving" ? "Saving..." : "Record today's scores"}
          </Button>
          <p role="status" className="max-w-xs text-xs text-muted-foreground">
            {snap.kind === "ok" || snap.kind === "error" ? snap.text : "Adds one point to the chart through a pull request. Do it weekly."}{" "}
            {snap.kind === "ok" && snap.url && <a className="underline" href={snap.url} target="_blank" rel="noreferrer">Open the pull request</a>}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Page text is read from the live site and refreshes every few minutes. Post text comes from the content files.
        {unread > 0 && ` ${unread} pages could not be read, so only their title, description and keyword were checked.`}
        {hasSearch ? " Search numbers are from Google Search Console, last 28 days." : searchError ? ` Search Console is set up but failed: ${searchError}` : " Search Console is not connected, so there are no click or ranking numbers."}
        {pendingUnavailable && " Could not check GitHub for edits waiting in pull requests (the rate limit may be used up), so those badges are missing. Sign in at /keystatic to avoid this."}
        {signedInAs && ` Signed in as ${signedInAs}.`}
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs text-muted-foreground">
          Search
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, address, title, keyword" className="h-9 w-56" />
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Type
          <select className={select} value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">Posts and pages</option>
            <option value="Post">Posts</option>
            <option value="Page">Pages</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Show
          <select className={select} value={filter} onChange={(e) => setFilter(e.target.value)}>
            {Object.entries(FILTERS).filter(([, f]) => !f.needsSearch || hasSearch).map(([id, f]) => <option key={id} value={id}>{f.label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Sort
          <select className={select} value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).filter(([, s]) => !s.needsSearch || hasSearch).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
          </select>
        </label>
        <label className="flex h-9 items-center gap-2 text-sm">
          <input type="checkbox" checked={bulk} onChange={(e) => setBulk(e.target.checked)} />
          Edit in a table
        </label>
        <Button type="button" size="sm" variant="outline" onClick={exportCsv} disabled={!shown.length}>Download CSV</Button>
        <p className="h-9 self-end text-sm leading-9 text-muted-foreground" aria-live="polite">{shown.length} of {rows.length}</p>
      </div>

      {bulk ? (
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" size="sm" onClick={saveBulk} disabled={!changed.length || changed.some((r) => bulkState[r.key]?.kind === "saving")}>
              Save {Math.min(changed.length, BULK_MAX)} change{changed.length === 1 ? "" : "s"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Only the rows listed below are edited. At most {BULK_MAX} per click, one commit each, all in your own pull request.
              {changedHidden > 0 && ` ${changedHidden} edited row${changedHidden > 1 ? "s are" : " is"} hidden by the filter and will be saved too.`}
              {changed.length > BULK_MAX && ` ${changed.length - BULK_MAX} more wait for the next click.`}
            </p>
          </div>
          <div className="mt-2 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Page</th>
                  <th className="px-3 py-2 font-medium">SEO title</th>
                  <th className="px-3 py-2 font-medium">Meta description</th>
                  <th className="px-3 py-2 font-medium">Focus keyword</th>
                  <th className="px-3 py-2 font-medium">Noindex</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {shown.map((r) => {
                  const d = draftOf(r);
                  const dirty = JSON.stringify(d) !== JSON.stringify(baseOf(r));
                  const err = dirty ? errorOf(r) : null;
                  const st = bulkState[r.key];
                  const set = (patch: Partial<EditValues>) => setDrafts((all) => ({ ...all, [r.key]: { ...draftOf(r), ...patch } }));
                  const titleMax = r.kind === "Post" ? LIMITS.postTitle : LIMITS.pageTitle;
                  return (
                    <tr key={r.key} className={dirty ? "bg-amber-500/10" : undefined}>
                      <td className="max-w-[12rem] px-3 py-2"><span className="block truncate font-medium">{r.name}</span><span className="block truncate text-xs text-muted-foreground">{r.path}</span></td>
                      <td className="px-3 py-2"><Input aria-label={`SEO title for ${r.name}`} value={d.title} onChange={(e) => set({ title: e.target.value })} className="h-8 min-w-[12rem]" /><span className={`text-xs ${d.title.length > titleMax ? "text-red-700" : "text-muted-foreground"}`}>{d.title.length}/{titleMax}</span></td>
                      <td className="px-3 py-2"><Input aria-label={`Meta description for ${r.name}`} value={d.description} onChange={(e) => set({ description: e.target.value })} className="h-8 min-w-[18rem]" /><span className={`text-xs ${d.description.length > LIMITS.description ? "text-red-700" : "text-muted-foreground"}`}>{d.description.length}/{LIMITS.description}</span></td>
                      <td className="px-3 py-2"><Input aria-label={`Focus keyword for ${r.name}`} value={d.focusKeyword} onChange={(e) => set({ focusKeyword: e.target.value })} className="h-8 min-w-[9rem]" /></td>
                      <td className="px-3 py-2"><input type="checkbox" aria-label={`Hide ${r.name} from Google`} checked={d.noindex} onChange={(e) => set({ noindex: e.target.checked })} /></td>
                      <td className="px-3 py-2 text-xs">
                        {st?.kind === "saving" && "Saving..."}
                        {st?.kind === "ok" && <span className="text-emerald-700">{st.text}</span>}
                        {st?.kind === "error" && <span className="text-red-700">{st.text}</span>}
                        {!st && err && <span className="text-red-700">{err}</span>}
                        {!st && !err && r.pending && <a className="underline" href={r.pending.url} target="_blank" rel="noreferrer">Edit in a pull request</a>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <ul className="mt-3 divide-y rounded-lg border bg-card">
          {shown.map((r) => (
            <li key={r.key}>
              <details className="group">
                <summary className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-muted/50 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_auto_7rem_9rem]">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.name}{r.pending && <a href={r.pending.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 align-middle text-xs font-normal text-sky-900">Edit in a pull request</a>}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.kind} · {r.path} · {r.title.length} chars{r.issues.length ? ` · ${r.issues.length} site problem${r.issues.length > 1 ? "s" : ""}` : ""}
                      {r.search ? ` · ${r.search.clicks} clicks, ${r.search.impressions} impressions, position ${r.search.position.toFixed(1)}` : ""}
                    </span>
                  </span>
                  <span className="order-last col-span-2 truncate text-sm text-muted-foreground md:order-none md:col-span-1">{r.keyword || "No focus keyword"}</span>
                  <span className={`justify-self-end rounded-full px-2.5 py-0.5 text-sm font-medium tabular-nums md:justify-self-start ${scoreTone(r.score)}`}>{r.score} {scoreLabel(r.score)}</span>
                  <span className="hidden text-sm md:block">{descStatus(r.description)}</span>
                  <span className="hidden text-sm md:block">{indexStatus(r)}</span>
                </summary>
                <div className="grid gap-6 border-t bg-muted/30 px-4 py-4 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Google, desktop</p>
                      <Snippet r={r} host={host} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Google, mobile</p>
                      <Snippet r={r} host={host} mobile />
                    </div>
                    <SeoQuickEdit
                      key={JSON.stringify(baseOf(r))}
                      target={r.target}
                      initial={baseOf(r)}
                      onSaved={(url, values) => {
                        setBase((b) => ({ ...b, [r.key]: values }));
                        if (url) setSaved((s) => ({ ...s, [r.key]: { url, login: signedInAs ?? "you" } }));
                      }}
                    />
                    <a href={r.edit} className="inline-block text-sm underline underline-offset-2">
                      Open the full editor (all fields, social card, schema){r.kind === "Page" ? `. Find ${r.path} in the list.` : ""}
                    </a>
                  </div>
                  <div className="space-y-4 text-sm">
                    {r.issues.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Across the site</h3>
                        <ul className="space-y-2">
                          {r.issues.map((i, n) => (
                            <li key={`${i.code}-${n}`} className="grid grid-cols-[4.5rem_1fr] gap-2">
                              <span className={`font-medium ${i.level === "fix" ? "text-red-700" : "text-amber-700"}`}>{i.level === "fix" ? "Fix" : "Improve"}</span>
                              <span>{i.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.search && (
                      <div>
                        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Searches that found this page (28 days)</h3>
                        <table className="w-full text-left text-xs tabular-nums">
                          <thead><tr><th className="pr-2 font-medium">Search</th><th className="pr-2 font-medium">Clicks</th><th className="pr-2 font-medium">Shown</th><th className="font-medium">Position</th></tr></thead>
                          <tbody>
                            {r.search.queries.map((s) => (
                              <tr key={s.query}><td className="pr-2">{s.query}</td><td className="pr-2">{s.clicks}</td><td className="pr-2">{s.impressions}</td><td>{s.position.toFixed(1)}</td></tr>
                            ))}
                          </tbody>
                        </table>
                        {r.keyword && !r.search.queries.some((s) => s.query.toLowerCase().includes(r.keyword.toLowerCase())) && (
                          <p className="mt-1 text-xs text-amber-700">The focus keyword is not among the top searches for this page.</p>
                        )}
                      </div>
                    )}
                    {[
                      ["SEO", r.checks.filter((c) => !c.id.startsWith("read-"))],
                      ["Readability", r.checks.filter((c) => c.id.startsWith("read-"))],
                    ].map(([group, list]) => (
                      <div key={group as string}>
                        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{group as string}</h3>
                        <ul className="space-y-2">
                          {(list as Check[]).map((c) => (
                            <li key={c.id} className="grid grid-cols-[4.5rem_1fr] gap-2">
                              <span className={`font-medium ${c.status === "pass" ? "text-emerald-700" : c.status === "fail" ? "text-red-700" : c.status === "warn" ? "text-amber-700" : "text-muted-foreground"}`}>{checkMark[c.status]}</span>
                              <span>{c.label}<span className="block text-xs text-muted-foreground">{c.hint}</span></span>
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
                              <li key={s.path}><span className="font-medium">{s.title}</span> <code className="text-xs">{s.path}</code><span className="block text-xs text-muted-foreground">{s.reason}</span></li>
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
          {!shown.length && <li className="px-4 py-6 text-sm text-muted-foreground">Nothing matches these filters.</li>}
        </ul>
      )}
    </>
  );
}
