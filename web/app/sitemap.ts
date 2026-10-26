import type { MetadataRoute } from "next";
import { site, specialties } from "@/lib/site";
import { getServiceSlugs } from "@/lib/services";
import { getAllPosts } from "@/content/posts";

/**
 * All indexable public routes. Keep in sync as pages are added.
 *
 * Only articles carry `lastModified`: they have a real `updatedAt`. Other URLs
 * omit it rather than share one made-up date, because Google ignores lastmod
 * it can't trust. `priority` / `changeFrequency` are ignored by Google, so
 * they are not emitted.
 *
 * shortcut: hand-maintained list; swap for a glob over `app/**\/page.tsx` once
 * we have a dynamic content source (MDX posts) that would make this annoying.
 */

// Always use the non-www canonical origin. Guard against NEXT_PUBLIC_SITE_URL
// being accidentally set to www.thezcs.com, which would break every canonical
// link in the sitemap.
const BASE = site.url
  .replace(/\/$/, "")
  .replace(/^(https?:\/\/)www\./, "$1");

const STATIC_PATHS = [
  "/",
  "/services",
  "/services/care-management",
  "/services/revenue-cycle-management",
  "/services/virtual-staffing",
  "/roi-calculator",
  "/hipaa-compliance",
  "/about",
  "/resources",
  "/faq",
  "/contact",
  "/pricing",
  "/how-it-works",
  "/refund-policy",
  "/service-delivery",
  "/complaints",
  "/privacy",
  "/cookies",
  "/data-request",
  "/terms",
  "/hipaa-statement",
  "/accessibility",
  "/security",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...getServiceSlugs().map((slug) => `/services/${slug}`),
    ...specialties.map((s) => `/who-we-serve/${s}`),
  ];

  const pages: MetadataRoute.Sitemap = paths.map((p) => ({
    url: p === "/" ? `${BASE}/` : `${BASE}${p}`,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/resources/${p.slug}`,
    lastModified: new Date(p.updatedAt),
  }));

  return [...pages, ...posts];
}
