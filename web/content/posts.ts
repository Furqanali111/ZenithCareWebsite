import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";

/**
 * Every blog post is a file in content/posts/<slug>.mdx with YAML frontmatter.
 * Keystatic (/keystatic) edits these files, so the list is read from the folder:
 * a new post needs no code change. The slug is the file name.
 */

export type PostFrontmatter = {
  slug: string;
  title: string;
  /** Short <title> tag; falls back to `title` when unset. Long, descriptive
   *  H1 titles blow past the ~60-char SEO budget, so posts whose H1 is long
   *  set this separately (see individual .mdx frontmatter). */
  metaTitle?: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  /** Day the clinical reviewer last checked the facts, ISO date. */
  reviewedAt?: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  coverImage?: string; // local /public path, e.g. "/resources/<slug>.jpg"
  /** Alt text for the cover image; the title is used when blank. */
  coverAlt?: string;
  /** Kept out of Google (robots noindex) and the sitemap, but still reachable by URL. */
  noindex?: boolean;
  /** Optional visible FAQ block + FAQPage JSON-LD. Answers must restate the article. */
  faqs?: { question: string; answer: string }[];
  /** Drafts are saved in the repo but never listed, routed or put in the sitemap. */
  draft?: boolean;
  /** Share-card text overrides (generated Open Graph image). */
  ogTitle?: string;
  ogSubtitle?: string;
  /** Keystatic's url field saves null when empty. */
  canonicalUrl?: string | null;
  /** Used by the SEO dashboard score only. */
  focusKeyword?: string;
  keywordSynonyms?: string[];
  nofollow?: boolean;
  /** Link-card overrides. Keystatic saves null for an empty image. */
  socialTitle?: string;
  socialDescription?: string;
  socialImage?: string | null;
  /** Article (default) or a more specific Article type in the JSON-LD. */
  schemaType?: "Article" | "BlogPosting" | "NewsArticle" | "TechArticle";
  /** Extra JSON-LD pasted in the editor, for any other schema.org type. */
  customJsonLd?: string;
  /** schema.org about / mentions entities for the Article JSON-LD. */
  about?: { name: string; url?: string | null }[];
  mentions?: { name: string; url?: string | null }[];
  /** Future date = hidden like a draft until a rebuild on or after that day. */
  publishAt?: string;
  /** Hand-picked related post slugs, shown before the tag-ranked ones. */
  related?: (string | null)[];
  series?: string;
  seriesOrder?: number;
  /** Replaces the default CMS source links under the post when non-empty. */
  sources?: { label: string; url: string | null }[];
};

export type Post = PostFrontmatter;

const DIR = path.join(process.cwd(), "content/posts");

// Unquoted YAML dates (what Keystatic writes) parse to Date objects.
const day = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? "");

/** Every post file, drafts and scheduled posts included. `status` says which are live. */
function readPosts(): (Post & { status: "Published" | "Draft" | "Scheduled" })[] {
  const today = process.env.BUILD_DATE ?? ""; // set in next.config.ts; empty hides nothing
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      const scheduled = !!(today && data.publishAt && day(data.publishAt) > today);
      return {
        ...data,
        // Worked out from the text (about 220 words a minute), so nobody types it and it never goes stale.
        readingMinutes: Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 220)),
        status: data.draft ? "Draft" : scheduled ? "Scheduled" : "Published",
        slug: file.slice(0, -".mdx".length),
        publishedAt: day(data.publishedAt),
        updatedAt: day(data.updatedAt) || day(data.publishedAt),
        tags: data.tags ?? [],
        publishAt: data.publishAt ? day(data.publishAt) : undefined,
        reviewedAt: data.reviewedAt ? day(data.reviewedAt) : undefined,
      } as Post & { status: "Published" | "Draft" | "Scheduled" };
    });
}

function loadPosts(): Post[] {
  const posts = readPosts().filter((p) => p.status === "Published");

  // Throws in BOTH dev AND prod: bad frontmatter must fail the build, not ship.
  for (const p of posts) {
    if (!p.title) throw new Error(`posts: empty title on ${p.slug}`);
    if (!p.description) throw new Error(`posts: empty description on ${p.slug}`);
    for (const d of [p.publishedAt, p.updatedAt]) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        throw new Error(`posts: date "${d}" on ${p.slug} must look like 2026-10-11`);
      }
    }
  }
  return posts;
}

/** For the SEO dashboard only: live posts plus drafts and scheduled ones, so they can be scored before they go live. */
export const getDashboardPosts = () => readPosts().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** All posts, newest first by publishedAt. */
export function getAllPosts(): readonly Post[] {
  return loadPosts().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function getPostSlugs(): readonly string[] {
  return loadPosts().map((p) => p.slug);
}

/** Other posts in the same series, in order (includes the given post). */
export function getSeriesPosts(post: Post): Post[] {
  if (!post.series) return [];
  return loadPosts()
    .filter((p) => p.series === post.series)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0) || a.publishedAt.localeCompare(b.publishedAt));
}

/** Plain heading text to a URL id. Used for both the H2 ids and the table of contents. */
export const headingId = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** H2 headings of a post body, for the <Toc /> block. Reads the raw file. */
export function getPostHeadings(slug: string): { id: string; text: string }[] {
  const { content } = matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8"));
  return [...content.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`\\]/g, "").trim();
    return { id: headingId(text), text };
  });
}

/** Raw MDX text of a post, for the SEO dashboard's content checks. */
export function getPostText(slug: string): string {
  return matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8")).content;
}

/** The compiled MDX body. Call only with a slug from getPostBySlug (no path input). */
export async function getPostBody(slug: string): Promise<ComponentType<{ components?: MDXComponents }>> {
  return (await import(`./posts/${slug}.mdx`)).default;
}
