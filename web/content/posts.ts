import type { ComponentType } from "react";
import Cpt99490_2026, {
  frontmatter as cpt99490Fm,
} from "./posts/cpt-99490-2026.mdx";
import InHouseVsOutsourced, {
  frontmatter as inHouseFm,
} from "./posts/in-house-vs-outsourced-ccm.mdx";
import HipaaChecklist, {
  frontmatter as hipaaFm,
} from "./posts/hipaa-checklist-outsourced-ccm.mdx";
import CcmVsRpmVsPcm, {
  frontmatter as ccmVsRpmVsPcmFm,
} from "./posts/ccm-vs-rpm-vs-pcm.mdx";
import HowCcmBillingWorks, {
  frontmatter as howCcmBillingWorksFm,
} from "./posts/how-ccm-billing-works.mdx";
import CcmConsentRequirements, {
  frontmatter as ccmConsentFm,
} from "./posts/ccm-consent-requirements.mdx";
import Cpt99439Vs99490, {
  frontmatter as cpt99439Fm,
} from "./posts/cpt-99439-vs-99490.mdx";
import CcmTimeTracking, {
  frontmatter as ccmTimeTrackingFm,
} from "./posts/ccm-time-tracking-requirements.mdx";

/**
 * The one-sentence rule: every blog post is listed here as a static
 * import. New post = new .mdx file + a new row in POSTS. Next 16 Cache
 * Components mode rejects empty / dynamic generateStaticParams, so this
 * explicit registry is what feeds the dynamic route and the sitemap.
 */

export type PostFrontmatter = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  category: string;
  tags: string[];
  readingMinutes: number;
  coverImage?: string; // local /public path, e.g. "/resources/<slug>.jpg"
};

export type Post = PostFrontmatter & {
  Component: ComponentType;
};

// Order here doesn't matter, getAllPosts() sorts by date desc.
const POSTS: Post[] = [
  { ...(cpt99490Fm as PostFrontmatter), Component: Cpt99490_2026 },
  { ...(inHouseFm as PostFrontmatter), Component: InHouseVsOutsourced },
  { ...(hipaaFm as PostFrontmatter), Component: HipaaChecklist },
  { ...(ccmVsRpmVsPcmFm as PostFrontmatter), Component: CcmVsRpmVsPcm },
  { ...(howCcmBillingWorksFm as PostFrontmatter), Component: HowCcmBillingWorks },
  { ...(ccmConsentFm as PostFrontmatter), Component: CcmConsentRequirements },
  { ...(cpt99439Fm as PostFrontmatter), Component: Cpt99439Vs99490 },
  { ...(ccmTimeTrackingFm as PostFrontmatter), Component: CcmTimeTracking },
];

/** All posts, newest first by publishedAt. */
export function getAllPosts(): readonly Post[] {
  return [...POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostSlugs(): readonly string[] {
  return POSTS.map((p) => p.slug);
}

/* -------------------------------------------------------------------------- */
/* Server-side load-time validation, throws loudly in BOTH dev AND prod.     */
/* The whole point is to fail the build on bad frontmatter; a dev-only guard  */
/* would silently pass broken content to production (same bug the FAQ loader  */
/* had before PR #4).                                                         */
/* -------------------------------------------------------------------------- */
if (typeof window === "undefined") {
  const seen = new Set<string>();
  for (const p of POSTS) {
    if (!p.slug) throw new Error(`posts: missing slug on ${p.title}`);
    if (seen.has(p.slug)) throw new Error(`posts: duplicate slug "${p.slug}"`);
    if (!p.title) throw new Error(`posts: empty title on ${p.slug}`);
    if (!p.description) throw new Error(`posts: empty description on ${p.slug}`);
    if (!p.publishedAt) throw new Error(`posts: missing publishedAt on ${p.slug}`);
    if (!p.Component) throw new Error(`posts: missing Component on ${p.slug}`);
    seen.add(p.slug);
  }
}
