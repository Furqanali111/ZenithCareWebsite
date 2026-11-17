/**
 * Pure helpers shared by the page <title> builder (lib/seo.tsx) and the live Google preview in the
 * Keystatic editor (keystatic/snippet-preview.tsx). No imports, so the node tests can run it.
 */

/** The <title> for a page: the editor's template with the page title and site name filled in. */
export const applyTitleTemplate = (template: string, title: string, siteName: string) =>
  title === siteName ? title : template.replaceAll("%title%", title).replaceAll("%site%", siteName);

/** Slug of a heading, the way the editor makes a URL from a title: lowercase words joined by dashes. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "How Zenith Care Solutions ..." cut at a word and ended with "...", the way a result cuts long text. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 3);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : cut.length).trimEnd()}...`;
}
