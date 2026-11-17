import { site } from "@/lib/site";
import { buildRobots } from "@/lib/robots";
import robotsFile from "@/content/robots.json";

/**
 * robots.txt, edited as plain text in /keystatic ("Robots.txt"). buildRobots refuses a text that
 * would block the whole site or an AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
 * CCBot, see WebSiteDoc/Project/07-seo-and-aiseo-plan.md section 5), or drop the editor rules,
 * so a bad edit fails the build instead of shipping.
 *
 * The sitemap line falls back to the non-www origin, never `host` (a Yandex-only directive that
 * Google and Bing flag). The www to non-www 308 in next.config.ts makes that origin canonical.
 */
const base = site.url.replace(/\/$/, "").replace(/^https?:\/\/www\./, "https://");
const body = buildRobots(robotsFile.content, base);

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
