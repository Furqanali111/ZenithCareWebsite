import { cacheLife } from "next/cache";
import { htmlToMarkdown } from "./html-to-markdown";
import { parseSitemap } from "./seo-site-checks";

/** Paths listed in the live sitemap, or null when it cannot be read. Cached for a few minutes. */
export async function sitemapPaths(origin: string, host: string): Promise<string[] | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(15_000) });
    return res.ok ? [...parseSitemap(await res.text(), host)] : null;
  } catch {
    return null;
  }
}

/**
 * Rendered text of pages written in code (home, services, about...), read from the site itself so the
 * SEO dashboard can run the same checks on them as on posts. null means the page could not be read
 * (not deployed yet, protected preview, timeout). Cached for a few minutes. Call it at request time:
 * at build there is no running site to read.
 */
export async function pageBodies(origin: string, paths: string[]): Promise<Record<string, string | null>> {
  "use cache";
  cacheLife("minutes");
  const out: Record<string, string | null> = {};
  const get = async (p: string) => {
    try {
      const res = await fetch(origin + p, { signal: AbortSignal.timeout(25_000) });
      out[p] = res.ok ? htmlToMarkdown(await res.text()) : null;
    } catch {
      out[p] = null;
    }
  };
  // Six at a time, so a cold dev server or a small serverless function is not flooded.
  for (let i = 0; i < paths.length; i += 6) await Promise.all(paths.slice(i, i + 6).map(get));
  return out;
}
