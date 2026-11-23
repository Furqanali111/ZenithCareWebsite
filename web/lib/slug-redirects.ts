/**
 * Turns renamed or deleted post files into 301 redirects. Pure, so the node tests can run it.
 * Used by scripts/slug-redirects.mjs (run by .github/workflows/slug-redirects.yml on every PR that
 * touches posts, and by publish-content.yml for feature/content-<login> and feature/seo-edits-<login>). Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */

export type Rule = { from: string; to: string; permanent: boolean };
export type Redirects = { exact: Rule[]; prefix: Rule[] };
export type Change = { status: "R" | "D"; oldFile: string; newFile?: string };

const urlOf = (file: string) => `/resources/${file.replace(/^.*content\/posts\//, "").replace(/\.mdx$/, "")}`;

export function planRedirects(changes: Change[], current: Redirects) {
  const redirects: Redirects = structuredClone(current);
  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];
  const warnings: string[] = [];

  for (const c of changes) {
    const old = urlOf(c.oldFile);
    if (c.status === "D" || !c.newFile) {
      if (!redirects.exact.some((r) => r.from === old)) warnings.push(`${old} was deleted and has no redirect. Add one in the Redirects editor.`);
      continue;
    }
    const next = urlOf(c.newFile);
    if (next === old) continue;
    // A redirect away from the address the page now lives at would hide the page.
    const before = redirects.exact.length;
    redirects.exact = redirects.exact.filter((r) => r.from !== next);
    if (redirects.exact.length < before) removed.push(next);
    // Point older redirects straight at the new address instead of chaining through the old one.
    for (const r of redirects.exact) {
      if (r.to === old) {
        r.to = next;
        updated.push(`${r.from} now goes to ${next}`);
      }
    }
    const existing = redirects.exact.find((r) => r.from === old);
    if (!existing) {
      redirects.exact.push({ from: old, to: next, permanent: true });
      added.push(`${old} to ${next}`);
    } else if (existing.to !== next) {
      warnings.push(`${old} already redirects to ${existing.to}, but the post moved to ${next}. Check it.`);
    }
  }
  return { redirects, added, updated, removed, warnings };
}
