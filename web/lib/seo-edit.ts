/**
 * Inline SEO edits from the dashboard: validation and the small text patches that turn an edit into
 * a change to one content file. Pure, no imports, so the node tests can run it.
 * The route that saves it is app/api/seo-edit/route.ts. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */

export type EditValues = { title: string; description: string; focusKeyword: string; noindex: boolean; synonyms: string };
export type EditTarget =
  | { kind: "post"; slug: string }
  | { kind: "page"; singleton: "pageSeo" | "serviceSeo"; path: string };
export type Edit = { target: EditTarget; values: EditValues };

// Same limits the editor enforces: a post's SEO title is 60 characters, a page's is 60.
/** "a, b" to ["a", "b"]. */
export const synonymList = (s = "") => s.split(",").map((x) => x.trim()).filter(Boolean);

export const LIMITS = { postTitle: 60, pageTitle: 60, description: 160, keyword: 100 };

export function validateEdit(raw: unknown): { ok: true; edit: Edit } | { ok: false; error: string } {
  const bad = (error: string) => ({ ok: false as const, error });
  const b = raw as { target?: Record<string, unknown>; values?: Record<string, unknown> } | null;
  if (!b?.target || !b.values) return bad("Missing target or values.");
  const t = b.target;
  const v = b.values;
  const text = (x: unknown) => (typeof x === "string" ? x.replace(/\s+/g, " ").trim() : null);
  const title = text(v.title);
  const description = text(v.description);
  const focusKeyword = text(v.focusKeyword);
  const synonyms = text(v.synonyms ?? "");
  if (title === null || description === null || focusKeyword === null || synonyms === null || typeof v.noindex !== "boolean") return bad("Values have the wrong shape.");
  if (description.length < 1 || description.length > LIMITS.description) return bad(`Meta description must be 1 to ${LIMITS.description} characters.`);
  if (focusKeyword.length > LIMITS.keyword) return bad(`Focus keyword must be ${LIMITS.keyword} characters or fewer.`);
  if (synonyms.length > 400) return bad("Synonyms must be 400 characters or fewer.");
  const values = { title, description, focusKeyword, noindex: v.noindex, synonyms };

  if (t.kind === "post") {
    if (typeof t.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(t.slug)) return bad("Bad post address.");
    if (title.length > LIMITS.postTitle) return bad(`SEO title must be ${LIMITS.postTitle} characters or fewer.`);
    return { ok: true, edit: { target: { kind: "post", slug: t.slug }, values } };
  }
  if (t.kind === "page") {
    if (t.singleton !== "pageSeo" && t.singleton !== "serviceSeo") return bad("Bad page group.");
    if (typeof t.path !== "string" || !/^\/[a-z0-9/-]*$/.test(t.path)) return bad("Bad page path.");
    if (title.length < 1 || title.length > LIMITS.pageTitle) return bad(`SEO title must be 1 to ${LIMITS.pageTitle} characters.`);
    return { ok: true, edit: { target: { kind: "page", singleton: t.singleton, path: t.path }, values } };
  }
  return bad("Unknown target.");
}

/** The file (relative to web/) an edit changes. */
export const editFile = (t: EditTarget) =>
  t.kind === "post" ? `content/posts/${t.slug}.mdx` : t.singleton === "pageSeo" ? "content/page-seo.json" : "content/page-seo-services.json";

const eolOf = (text: string) => (text.includes("\r\n") ? "\r\n" : "\n");

/**
 * Sets or removes top-level keys in a post's YAML frontmatter and leaves every other line alone.
 * A string is written as a JSON string (valid YAML), a boolean as true or false. null removes the key.
 */
export function patchFrontmatter(text: string, changes: Record<string, string | boolean | string[] | null>): string {
  const eol = eolOf(text);
  const lines = text.split(/\r?\n/);
  const end = lines[0] === "---" ? lines.indexOf("---", 1) : -1;
  if (end < 0) throw new Error("Post has no frontmatter.");
  const fm = lines.slice(1, end);
  for (const [key, value] of Object.entries(changes)) {
    const block =
      value === null || (Array.isArray(value) && !value.length)
        ? []
        : Array.isArray(value)
          ? [`${key}:`, ...value.map((x) => `  - ${JSON.stringify(x)}`)]
          : [`${key}: ${typeof value === "boolean" ? value : JSON.stringify(value)}`];
    const i = fm.findIndex((l) => l.startsWith(`${key}:`));
    if (i < 0) fm.push(...block);
    else {
      let j = i + 1;
      while (j < fm.length && /^(\s|-\s)/.test(fm[j])) j++; // folded text and indented lists belong to the key
      fm.splice(i, j - i, ...block);
    }
  }
  return ["---", ...fm, ...lines.slice(end)].join(eol);
}

/** Sets one entry of content/page-seo*.json. Throws if the page has no entry. */
export function patchPageSeo(jsonText: string, path: string, v: EditValues): string {
  const eol = eolOf(jsonText);
  const data = JSON.parse(jsonText) as { pages: Record<string, unknown>[] };
  const e = data.pages.find((p) => p.path === path);
  if (!e) throw new Error(`No SEO entry for ${path}.`);
  e.title = v.title;
  e.description = v.description;
  if (v.focusKeyword) e.focusKeyword = v.focusKeyword;
  else delete e.focusKeyword;
  if (v.noindex) e.noindex = true;
  else if ("noindex" in e) e.noindex = false;
  const syn = synonymList(v.synonyms);
  if (syn.length) e.keywordSynonyms = syn;
  else delete e.keywordSynonyms;
  return JSON.stringify(data, null, 2).replace(/\n/g, eol) + eol;
}

export function applyEdit(fileText: string, edit: Edit): string {
  const { target, values: v } = edit;
  if (target.kind === "page") return patchPageSeo(fileText, target.path, v);
  return patchFrontmatter(fileText, {
    metaTitle: v.title || null,
    description: v.description,
    focusKeyword: v.focusKeyword || null,
    noindex: v.noindex ? true : null,
    keywordSynonyms: synonymList(v.synonyms),
  });
}
