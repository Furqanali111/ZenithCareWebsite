import type { MetadataRoute } from "next";
import { site, specialties, CONTENT_UPDATED } from "@/lib/site";
import { getServiceSlugs } from "@/lib/services";
import { isNoindexed } from "@/lib/seo";
import { getAllPosts } from "@/content/posts";
import { CPT_BASE, cptCodes, cptPath } from "@/lib/cpt-codes";
import { DENIAL_BASE, denialCodes, denialPath } from "@/lib/denial-codes";
import controlsFile from "@/content/sitemap-controls.json";

// Empty JSON arrays infer as never[], so give the file its real shape.
const controls: { exclude: string[]; overrides: { path: string; priority: number | null; changeFrequency: string }[] } = controlsFile;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/**
 * All indexable public routes. Keep in sync as pages are added.
 *
 * Articles carry their own `updatedAt`. Service, CPT and denial pages carry
 * CONTENT_UPDATED, the date the owner set. Other URLs omit lastmod rather than
 * share a made-up date, because Google ignores lastmod it can't trust. `priority` / `changeFrequency` are ignored by Google, so
 * they are emitted only for pages the editor sets them on (content/sitemap-controls.json).
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
  "/who-we-serve",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...getServiceSlugs().map((slug) => `/services/${slug}`),
    ...specialties.map((s) => `/who-we-serve/${s}`),
    CPT_BASE,
    ...cptCodes.map((c) => cptPath(c.code)),
    DENIAL_BASE,
    ...denialCodes.map((d) => denialPath(d.slug)),
  ];

<<<<<<< HEAD
  const pages: MetadataRoute.Sitemap = paths.filter((p) => !isNoindexed(p)).map((p) => ({
    url: p === "/" ? BASE : `${BASE}${p}`,
    ...(p.startsWith("/services") && { lastModified: new Date(CONTENT_UPDATED) }),
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().filter((p) => !p.noindex).map((p) => ({
    url: `${BASE}/resources/${p.slug}`,
    lastModified: new Date(p.updatedAt),
  }));
=======
  const postPaths = getAllPosts().map((p) => `/resources/${p.slug}`);

  // Editor settings (content/sitemap-controls.json). A path that is not a real
  // sitemap path fails the build, so a typo can't silently do nothing.
  const known = new Set([...paths, ...postPaths]);
  const excluded = new Set(controls.exclude);
  for (const p of [...controls.exclude, ...controls.overrides.map((o) => o.path)]) {
    if (!known.has(p)) throw new Error(`content/sitemap-controls.json: "${p}" is not a sitemap page`);
  }
  const overrides = new Map(controls.overrides.map((o) => [o.path, o]));
  const tuning = (p: string) => {
    const o = overrides.get(p);
    return {
      ...(o?.priority != null && { priority: o.priority }),
      ...(o && o.changeFrequency !== "none" && { changeFrequency: o.changeFrequency as ChangeFrequency }),
    };
  };

  const pages: MetadataRoute.Sitemap = paths
    .filter((p) => !excluded.has(p))
    .map((p) => ({
      url: p === "/" ? BASE : `${BASE}${p}`,
      ...(p.startsWith("/services") && { lastModified: new Date(CONTENT_UPDATED) }),
      ...tuning(p),
    }));

  const posts: MetadataRoute.Sitemap = getAllPosts()
    .filter((p) => !excluded.has(`/resources/${p.slug}`))
    .map((p) => ({
      url: `${BASE}/resources/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      ...tuning(`/resources/${p.slug}`),
    }));
>>>>>>> feature/cms-technical-seo

  return [...pages, ...posts];
}
