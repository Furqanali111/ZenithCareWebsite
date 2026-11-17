"use client";

import { useEffect, useRef, useState } from "react";
import globalSeo from "../content/global-seo.json";
import { analyze, type Check } from "../lib/seo-analysis";
import { applyTitleTemplate, clip, slugify } from "../lib/google-snippet";

/**
 * "Google preview" in the Keystatic editor: shows the search result and the title and description
 * checks while the editor types. Keystatic gives a field only its own value, so this field reads its
 * sibling fields from the page by their labels. It stores nothing.
 * shortcut: it polls the form a few times a second and matches labels ("SEO title", "Meta description"...),
 * so renaming one of those labels in the schema breaks the preview (it then says so). Upgrade when
 * Keystatic can pass sibling values to a field.
 * Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
const SITE = "Zenith Care Solutions"; // same as site.name in lib/site.ts

const LABELS = {
  post: { title: "Title (H1)", slug: "URL slug", seoTitle: "SEO title", description: "Meta description", keyword: "Focus keyword" },
  page: { path: "Page URL path", seoTitle: "SEO title", description: "Meta description", keyword: "Focus keyword" },
} as const;

type Values = { path: string; title: string; description: string; keyword: string };
type Read = { ok: true; values: Values } | { ok: false };

/** The text input or textarea whose label starts with this text, looked up inside one form section. */
function fieldIn(scope: HTMLElement, label: string): HTMLInputElement | HTMLTextAreaElement | null {
  for (const l of Array.from(scope.querySelectorAll("label"))) {
    if (!(l.textContent ?? "").trim().toLowerCase().startsWith(label.toLowerCase())) continue;
    const id = l.getAttribute("for");
    const el = id ? scope.querySelector(`[id="${id.replace(/"/g, '\\"')}"]`) : l.querySelector("input,textarea");
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el;
  }
  return null;
}

/** The lowest ancestor of the preview that also holds the description field: the form of this page or this list item. */
function sectionOf(root: HTMLElement): HTMLElement | null {
  for (let el = root.parentElement; el; el = el.parentElement) if (fieldIn(el, "Meta description")) return el;
  return null;
}

function read(root: HTMLElement, kind: "post" | "page"): Read {
  const scope = sectionOf(root);
  if (!scope) return { ok: false };
  const get = (label: string) => fieldIn(scope, label)?.value ?? null;
  const description = get(LABELS.post.description);
  if (description === null) return { ok: false };
  const keyword = get(LABELS.post.keyword) ?? "";
  if (kind === "post") {
    const h1 = get(LABELS.post.title);
    if (h1 === null) return { ok: false };
    const seoTitle = get(LABELS.post.seoTitle) ?? "";
    const slug = get(LABELS.post.slug) || slugify(h1);
    return { ok: true, values: { path: `/resources/${slug}`, title: seoTitle.trim() || h1, description, keyword } };
  }
  const path = get(LABELS.page.path);
  const title = get(LABELS.page.seoTitle);
  if (path === null || title === null) return { ok: false };
  return { ok: true, values: { path: path.trim() || "/", title, description, keyword } };
}

const card = { boxSizing: "border-box" as const, width: "100%", background: "#fff", border: "1px solid #dadce0", borderRadius: 8, padding: 12, fontFamily: "Arial, sans-serif", color: "#202124", textAlign: "left" as const };
const line = (extra: object) => ({ margin: 0, ...extra });
const tone = (s: Check["status"]) => (s === "pass" ? "#1e8e3e" : s === "fail" ? "#d93025" : "#b06000");

function Snippet({ v, mobile }: { v: Values; mobile?: boolean }) {
  const host = new URL("https://thezcs.com").host;
  const crumb = v.path === "/" ? "" : ` › ${v.path.slice(1).split("/").join(" › ")}`;
  const title = applyTitleTemplate(globalSeo.titleTemplate, v.title, SITE);
  // Google cuts by pixel width: about 60 characters on desktop, a little more room on two mobile lines.
  const shownTitle = clip(title, mobile ? 78 : 60);
  const shownDesc = clip(v.description || "No meta description. Google will pick text from the page.", mobile ? 150 : 160);
  return (
    <div style={{ ...card, maxWidth: mobile ? 360 : 600 }}>
      <p style={line({ fontSize: 12, color: "#4d5156", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" })}>{host}{crumb}</p>
      <p style={line({ fontSize: mobile ? 17 : 20, lineHeight: 1.3, color: "#1a0dab" })}>{shownTitle || "Untitled"}</p>
      <p style={line({ fontSize: 14, lineHeight: 1.5, color: "#4d5156" })}>{shownDesc}</p>
    </div>
  );
}

export function SnippetPreview({ kind }: { kind: "post" | "page" }) {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<Read | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!root.current) return;
      const next = read(root.current, kind);
      setState((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    tick();
    const timer = window.setInterval(tick, 300);
    return () => window.clearInterval(timer);
  }, [kind]);

  const values = state?.ok ? state.values : null;
  const checks = values
    ? analyze({
        path: values.path,
        title: applyTitleTemplate(globalSeo.titleTemplate, values.title, SITE),
        description: values.description,
        focusKeyword: values.keyword,
      }).checks.filter((c) => c.status !== "na")
    : [];

  return (
    <div ref={root} style={{ display: "grid", gap: 12, margin: "4px 0 8px", minWidth: 0, maxWidth: "100%" }}>
      <strong style={{ fontSize: 14 }}>Google preview (live)</strong>
      {state && !values ? (
        <p style={{ margin: 0, fontSize: 13 }}>The preview could not find the title and description fields on this form, so it cannot update.</p>
      ) : values ? (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            <Snippet v={values} />
            <Snippet v={values} mobile />
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4, fontSize: 13 }} aria-label="Title and description checks">
            {checks.map((c) => (
              <li key={c.id}>
                <span style={{ color: tone(c.status), fontWeight: 600 }}>{c.status === "pass" ? "Pass" : c.status === "fail" ? "Fix" : "Improve"}</span> {c.label}
                <span style={{ opacity: 0.75 }}>: {c.hint}</span>
              </li>
            ))}
          </ul>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>Checks that need the page text (keyword use, links, readability) are on the SEO dashboard.</p>
        </>
      ) : null}
    </div>
  );
}
