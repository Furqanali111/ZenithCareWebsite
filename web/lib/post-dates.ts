import { patchFrontmatter } from "./seo-edit.ts"; // the .ts extension lets the node tests and scripts load this file

const split = (text: string) => {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { front: m[1], body: m[2].trim() } : null;
};
const updatedOf = (front: string) => front.match(/^updatedAt:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1];

/**
 * The post text with its "Last updated" date set to `today`, or null when nothing should change: a new post,
 * an edit that left the text alone (a meta description fix is not a content update), or a date the editor set by hand.
 * Run by .github/workflows/post-dates.yml on every pull request that edits a post, and by .github/workflows/publish-content.yml
 * for feature/content-<login> and feature/seo-edits-<login> (post-dates.yml skips those).
 */
export function bumpUpdated(baseText: string | null, headText: string, today: string): string | null {
  const base = baseText === null ? null : split(baseText);
  const head = split(headText);
  if (!base || !head || base.body === head.body) return null;
  const before = updatedOf(base.front);
  if (!before || updatedOf(head.front) !== before || before === today) return null;
  return patchFrontmatter(headText, { updatedAt: today });
}
