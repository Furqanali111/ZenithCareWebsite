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

// Module-scope so Next 16 Cache Components can prerender /sitemap.xml as
// static instead of serving it dynamically on every crawler hit.
const BUILT_AT = new Date();
const BASE = site.url.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BASE;
  const now = BUILT_AT;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1.0, changeFrequency: "monthly" },
    { url: `${base}/services`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/roi-calculator`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/hipaa-compliance`, lastModified: now, priority: 0.7, changeFrequency: "yearly" },
    { url: `${base}/about`, lastModified: now, priority: 0.7, changeFrequency: "yearly" },
    { url: `${base}/resources`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/faq`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/contact`, lastModified: now, priority: 0.9, changeFrequency: "yearly" },
    { url: `${base}/privacy`, lastModified: now, priority: 0.2, changeFrequency: "yearly" },
    { url: `${base}/terms`, lastModified: now, priority: 0.2, changeFrequency: "yearly" },
    { url: `${base}/hipaa-statement`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/accessibility`, lastModified: now, priority: 0.2, changeFrequency: "yearly" },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = getServiceSlugs().map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: now,
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  const specialtyRoutes: MetadataRoute.Sitemap = specialties.map((s) => ({
    url: `${base}/who-we-serve/${s}`,
    lastModified: now,
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
