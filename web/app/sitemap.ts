import type { MetadataRoute } from "next";
import { site, specialties } from "@/lib/site";
import { getServiceSlugs } from "@/lib/services";
import { getAllPosts } from "@/content/posts";

/**
 * All indexable public routes. Keep in sync as pages are added.
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

// Use a stable date for pages whose content hasn't meaningfully changed.
// Stamping every URL with `new Date()` (the deploy time) tricks Google into
// thinking all pages changed on every deploy, wasting crawl budget.
// Update this date when you make a content-significant change to the site shell
// (nav, footer, global copy). Individual service / post dates are set below.
const SITE_LAST_UPDATED = new Date("2026-10-18");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BASE;
  const siteDate = SITE_LAST_UPDATED;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: siteDate, priority: 1.0, changeFrequency: "monthly" },
    { url: `${base}/services`, lastModified: siteDate, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/services/care-management`, lastModified: siteDate, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/services/revenue-cycle-management`, lastModified: siteDate, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/services/virtual-staffing`, lastModified: siteDate, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/roi-calculator`, lastModified: siteDate, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/hipaa-compliance`, lastModified: siteDate, priority: 0.7, changeFrequency: "yearly" },
    { url: `${base}/about`, lastModified: siteDate, priority: 0.7, changeFrequency: "yearly" },
    { url: `${base}/resources`, lastModified: siteDate, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/faq`, lastModified: siteDate, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/contact`, lastModified: siteDate, priority: 0.9, changeFrequency: "yearly" },
    { url: `${base}/privacy`, lastModified: siteDate, priority: 0.2, changeFrequency: "yearly" },
    { url: `${base}/terms`, lastModified: siteDate, priority: 0.2, changeFrequency: "yearly" },
    { url: `${base}/hipaa-statement`, lastModified: siteDate, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/accessibility`, lastModified: siteDate, priority: 0.2, changeFrequency: "yearly" },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = getServiceSlugs().map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: siteDate,
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  const specialtyRoutes: MetadataRoute.Sitemap = specialties.map((s) => ({
    url: `${base}/who-we-serve/${s}`,
    lastModified: siteDate,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${base}/resources/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    priority: 0.6,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...serviceRoutes, ...specialtyRoutes, ...postRoutes];
}
