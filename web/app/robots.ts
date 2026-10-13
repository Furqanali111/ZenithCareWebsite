import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Allow all crawlers, including AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, CCBot). Blocking them is a top-of-funnel business mistake , 
 * see WebSiteDoc/07-seo-and-aiseo-plan.md §5.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
