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

// Page text only changes when a new version is deployed, so each page is cached for hours under the
// deployment id (in dev: under the current minute). It throws on failure so a failed read is never cached.
async function readPage(origin: string, path: string, version: string): Promise<string> {
  "use cache";
  cacheLife("hours");
  void version;
  const res = await fetch(origin + path, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${path} answered ${res.status}`);
  return htmlToMarkdown(await res.text());
}

/**
 * Rendered text of pages written in code (home, services, about...), read from the site itself so the
 * SEO dashboard can run the same checks on them as on posts. null means the page could not be read
 * (not deployed yet, protected preview, timeout). Call it at request time: at build there is no running site to read.
 */
export async function pageBodies(origin: string, paths: string[]): Promise<Record<string, string | null>> {
  const version = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? String(Math.floor(Date.now() / 60_000));
  const out: Record<string, string | null> = {};
  const get = async (p: string) => {
    out[p] = await readPage(origin, p, version).catch(() => null);
  };
  // Twelve at a time: faster than six, still gentle on a small serverless function or a cold dev server.
  for (let i = 0; i < paths.length; i += 12) await Promise.all(paths.slice(i, i + 12).map(get));
  return out;
}
