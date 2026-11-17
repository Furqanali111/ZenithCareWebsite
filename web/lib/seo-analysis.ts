/**
 * On-page SEO checks for the /seo-dashboard. Pure functions, no imports, so the node tests
 * can run them directly. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */

export type Status = "pass" | "warn" | "fail" | "na";
export type Check = { id: string; label: string; status: Status; hint: string; weight: number };

export type AnalysisInput = {
  /** URL path, for example /resources/ccm-billing. */
  path: string;
  /** The full <title> as Google shows it. */
  title: string;
  description: string;
  focusKeyword?: string;
  /** Other ways to say the keyword. Any of them counts as a match. */
  synonyms?: string[];
  /** Raw post text (MDX). Leave undefined for pages whose text lives in code: body checks are skipped. */
  body?: string;
  hasCover?: boolean;
  coverAlt?: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// shortcut: light suffix stripping (billing, bills, billed all become "bill"), not a real stemmer.
// Irregular forms (patient/patients is fine, child/children is not) still miss. Upgrade if teams ask.
const stem = (w: string) => {
  let s = w;
  if (s.length > 3) {
    const t = s.replace(/(ing|ed|es|(?<!s)s)$/, "");
    if (t.length >= 3) s = t;
  }
  if (s.length > 3) s = s.replace(/e$/, "");
  return s;
};
const stemmed = (s: string) => norm(s).split(" ").filter(Boolean).map(stem).join(" ");
const has = (text: string, phrase: string) => {
  const p = stemmed(phrase);
  return !!p && ` ${stemmed(text)} `.includes(` ${p} `);
};

export const LINK = /(?<!!)\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;
const IMAGE = /!\[([^\]]*)\]\([^)]*\)/g;

/** Plain words of a post: no code, tags, image syntax or link targets. */
const plain = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(IMAGE, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "");

const firstParagraph = (md: string) =>
  md
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|<|\||-|\*|>|\d+\.|```|import |export )/.test(b)) ?? "";

const headings = (md: string) => [...md.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1]);
const wordCount = (s: string) => norm(s).split(" ").filter(Boolean).length;

// Prose for the readability checks: no table rows, so numbers and pipes do not skew the maths.
const prose = (md: string) => plain(md).split("\n").filter((l) => !/^\s*\|/.test(l)).join("\n");
const syllables = (w: string) => Math.max(1, (w.toLowerCase().replace(/e$/, "").match(/[aeiouy]+/g) ?? []).length);

export function analyze(input: AnalysisInput): { score: number; checks: Check[] } {
  const kw = input.focusKeyword?.trim() ?? "";
  const variants = [kw, ...(input.synonyms ?? [])].map((s) => s.trim()).filter(Boolean);
  const hasAny = (text: string) => variants.some((v) => has(text, v));
  const body = input.body;
  const checks: Check[] = [];
  const add = (id: string, label: string, weight: number, status: Status, hint: string) =>
    checks.push({ id, label, weight, status, hint });

  // A keyword check needs a keyword; a body check needs a body. Otherwise it is skipped, not failed.
  const needKw = (id: string, label: string, weight: number, test: () => [Status, string]) =>
    kw ? add(id, label, weight, ...test()) : add(id, label, weight, "na", "Set a focus keyword first.");
  const needBody = (id: string, label: string, weight: number, test: (md: string) => [Status, string]) =>
    body === undefined
      ? add(id, label, weight, "na", "This page's text lives in code, so it is not analysed.")
      : add(id, label, weight, ...test(body));

  add("kw-set", "Focus keyword is set", 10, kw ? "pass" : "fail", kw ? kw : "Add a focus keyword in the editor.");

  const tl = input.title.length;
  add("title-len", "SEO title length", 8, !tl ? "fail" : tl >= 30 && tl <= 60 ? "pass" : "warn", `${tl} characters. Aim for 30 to 60.`);
  const dl = input.description.length;
  add("desc-len", "Meta description length", 8, !dl ? "fail" : dl >= 140 && dl <= 160 ? "pass" : "warn", `${dl} characters. Aim for 140 to 160.`);

  needKw("kw-title", "Keyword in SEO title", 12, () => (hasAny(input.title) ? ["pass", "Found."] : ["fail", "Put the keyword or a synonym in the SEO title, near the start."]));
  needKw("kw-desc", "Keyword in meta description", 10, () => (hasAny(input.description) ? ["pass", "Found."] : ["fail", "Mention the keyword or a synonym in the meta description."]));
  needKw("kw-url", "Keyword in URL", 8, () => (hasAny(input.path) ? ["pass", "Found."] : ["warn", "The URL does not contain the keyword. Do not change a live URL without a redirect."]));

  needBody("kw-first", "Keyword in first paragraph", 10, (md) =>
    !kw ? ["na", "Set a focus keyword first."] : hasAny(plain(firstParagraph(md))) ? ["pass", "Found."] : ["fail", "Use the keyword or a synonym in the opening paragraph."]);
  needBody("kw-headings", "Keyword in a heading", 8, (md) =>
    !kw ? ["na", "Set a focus keyword first."] : headings(md).some(hasAny) ? ["pass", "Found."] : ["warn", "Use the keyword or a synonym in at least one H2 or H3."]);
  needBody("kw-usage", "Keyword usage in content", 8, (md) => {
    if (!kw) return ["na", "Set a focus keyword first."];
    const text = ` ${stemmed(plain(md))} `;
    const words = Math.max(text.trim().split(" ").length, 1);
    let count = 0;
    let covered = 0;
    for (const v of variants) {
      const n = text.split(` ${stemmed(v)} `).length - 1;
      count += n;
      covered += n * stemmed(v).split(" ").length;
    }
    const density = (covered * 100) / words;
    const hint = `${count} times, ${density.toFixed(1)}% of the words. Aim for 0.5% to 2.5%.`;
    return [count === 0 ? "fail" : density >= 0.5 && density <= 2.5 ? "pass" : "warn", hint];
  });

  needBody("words", "Content length", 6, (md) => {
    const n = wordCount(plain(md));
    return [n >= 300 ? "pass" : n >= 150 ? "warn" : "fail", `${n} words. Aim for 300 or more.`];
  });
  needBody("links-in", "Internal links", 6, (md) => {
    const n = [...md.matchAll(LINK)].filter((m) => /^(\/|#|https?:\/\/(www\.)?thezcs\.com)/.test(m[1])).length;
    return [n >= 2 ? "pass" : n === 1 ? "warn" : "fail", `${n} found. Link to at least 2 related pages.`];
  });
  needBody("links-out", "External links", 3, (md) => {
    const n = [...md.matchAll(LINK)].filter((m) => /^https?:\/\//.test(m[1]) && !/^https?:\/\/(www\.)?thezcs\.com/.test(m[1])).length;
    return [n >= 1 ? "pass" : "warn", `${n} found. Cite at least one trusted source.`];
  });
  needBody("alt", "Image alt text", 3, (md) => {
    const imgs = [...md.matchAll(IMAGE)];
    const missing = imgs.filter((m) => !m[1].trim()).length;
    if (missing) return ["fail", `${missing} of ${imgs.length} images have no alt text.`];
    if (input.hasCover && !input.coverAlt?.trim()) return ["warn", "The cover image has no alt text of its own, so the title is used."];
    return imgs.length || input.hasCover ? ["pass", "All images have alt text."] : ["na", "No images."];
  });

  // Readability. Ids start with "read-" so the dashboard can group them.
  const sentences = (body === undefined ? "" : prose(body)).split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => wordCount(s) > 0);
  needBody("read-sentences", "Sentence length", 5, () => {
    if (!sentences.length) return ["na", "No sentences found."];
    const pct = Math.round((sentences.filter((s) => wordCount(s) > 20).length * 100) / sentences.length);
    return [pct <= 25 ? "pass" : pct <= 40 ? "warn" : "fail", `${pct}% of sentences are over 20 words. Aim for 25% or less.`];
  });
  needBody("read-paragraphs", "Paragraph length", 3, (md) => {
    const n = prose(md).split(/\n\s*\n/).filter((p) => wordCount(p) > 150).length;
    return [n === 0 ? "pass" : n <= 2 ? "warn" : "fail", n ? `${n} paragraphs are over 150 words. Split them.` : "No paragraph is over 150 words."];
  });
  needBody("read-headings", "Subheadings", 4, (md) => {
    const words = wordCount(plain(md));
    if (words < 300) return ["na", "Short text, no subheadings needed."];
    const need = Math.floor(words / 300);
    const got = headings(md).length;
    return [got >= need ? "pass" : "warn", `${got} subheadings for ${words} words. Aim for one every 300 words.`];
  });
  needBody("read-ease", "Reading ease", 5, (md) => {
    const text = prose(md);
    const words = text.match(/[A-Za-z']+/g) ?? [];
    if (!words.length || !sentences.length) return ["na", "Not enough text."];
    const syl = words.reduce((s, w) => s + syllables(w), 0);
    const ease = Math.round(206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syl / words.length));
    return [ease >= 45 ? "pass" : ease >= 30 ? "warn" : "fail", `Flesch reading ease ${ease}. Higher is easier. Aim for 45 or more; billing topics often score lower.`];
  });

  const scored = checks.filter((c) => c.status !== "na");
  const total = scored.reduce((s, c) => s + c.weight, 0);
  const got = scored.reduce((s, c) => s + c.weight * (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  return { score: total ? Math.round((got * 100) / total) : 0, checks };
}

export type LinkTarget = { path: string; title: string; keyword?: string; tags?: string[] };

/**
 * Pages a post could link to but does not yet: a page whose focus keyword appears in the text,
 * or that shares tags. Best match first.
 */
export function linkSuggestions(
  self: { path: string; body: string; tags?: string[] },
  others: LinkTarget[],
  max = 5,
): { path: string; title: string; reason: string }[] {
  const linked = new Set(
    [...self.body.matchAll(LINK)].map((m) => m[1].replace(/^https?:\/\/(www\.)?thezcs\.com/, "").replace(/[#?].*$/, "").replace(/\/$/, "")),
  );
  const text = plain(self.body);
  const mine = new Set(self.tags ?? []);
  return others
    .filter((o) => o.path !== self.path && !linked.has(o.path))
    .map((o) => {
      const mention = !!o.keyword && has(text, o.keyword);
      const shared = (o.tags ?? []).filter((t) => mine.has(t));
      const reason = mention ? `Text mentions "${o.keyword}"` : shared.length ? `Shares tags: ${shared.join(", ")}` : "";
      return { path: o.path, title: o.title, reason, rank: (mention ? 10 : 0) + shared.length };
    })
    .filter((s) => s.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, max)
    .map(({ path, title, reason }) => ({ path, title, reason }));
}
