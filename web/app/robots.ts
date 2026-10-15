import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Allow all crawlers, including AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, CCBot). Blocking them is a top-of-funnel business mistake,
 * see WebSiteDoc/07-seo-and-aiseo-plan.md §5.
 *
 * The sitemap URL is hardcoded to the non-www origin so that even if this
 * file is served from www (before the redirect fires), crawlers still follow
 * the canonical sitemap. The `host` directive was removed because it is a
 * Yandex-only extension that Google and Bing flag as a warning/syntax error.
 * The canonical origin is already declared via sitemap URL, canonical tags,
 * and the www-to-non-www 308 redirect.
 */
export default function robots(): MetadataRoute.Robots {
  // Strip trailing slash; always use the non-www canonical.
  const base = site.url.replace(/\/$/, "").replace(/^https?:\/\/www\./, "https://");

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
