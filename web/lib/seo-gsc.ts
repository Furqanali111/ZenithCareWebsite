import { createSign } from "node:crypto";
import { cacheLife } from "next/cache";
import { foldPageRows, foldSearchRows, type GscRow, type IndexStatus, type PageSearch } from "./seo-site-checks";

/**
 * Google Search Console data for the SEO dashboard: clicks, impressions, position and top queries per
 * page over the last 28 days. Read only. Needs three env vars (see .env.example); without them the
 * dashboard simply shows no search columns. Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
export const gscConfigured = () => !!(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY && process.env.GSC_SITE_URL);

const b64 = (x: string | Buffer) => Buffer.from(x).toString("base64url");

let tokenMemo: { token: string; until: number } | null = null;
// One sign-in serves many calls (the index check makes dozens). Google tokens last an hour.
async function accessToken(): Promise<string> {
  if (tokenMemo && tokenMemo.until > Date.now()) return tokenMemo.token;
  const token = await newToken();
  tokenMemo = { token, until: Date.now() + 2_400_000 };
  return token;
}

async function newToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(
    JSON.stringify({
      iss: process.env.GSC_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3000,
    }),
  )}`;
  // Vercel stores the key on one line with literal \n.
  const key = (process.env.GSC_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const jwt = `${unsigned}.${b64(createSign("RSA-SHA256").update(unsigned).sign(key))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json()) as { access_token?: string; error_description?: string };
  if (!data.access_token) throw new Error(data.error_description ?? `Google sign-in failed (${res.status}).`);
  return data.access_token;
}

const day = (d: Date) => d.toISOString().slice(0, 10);

/** Per page path: totals and top queries. null when not configured or Google refused (the reason is in `error`). */
export async function searchData(host: string): Promise<{ pages: Record<string, PageSearch> | null; error?: string }> {
  if (!gscConfigured()) return { pages: null };
  try {
    return { pages: await loadSearch(host) };
  } catch (e) {
    return { pages: null, error: e instanceof Error ? e.message : "Could not read Search Console." };
  }
}

const query = (token: string, body: unknown) =>
  fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(process.env.GSC_SITE_URL as string)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
  });

/** All rows for a period. 5000 rows is Google's cap per request: keep asking until a short page (at most 5 pages). */
async function allRows(token: string, start: Date, end: Date, dimensions: string[]): Promise<GscRow[]> {
  const rows: GscRow[] = [];
  for (let startRow = 0; startRow < 25_000; startRow += 5000) {
    const res = await query(token, { startDate: day(start), endDate: day(end), dimensions, rowLimit: 5000, startRow });
    const data = (await res.json()) as { rows?: GscRow[]; error?: { message?: string } };
    if (!res.ok) throw new Error(data.error?.message ?? `Search Console refused the request (${res.status}).`);
    rows.push(...(data.rows ?? []));
    if ((data.rows?.length ?? 0) < 5000) break;
  }
  return rows;
}

// Throws on any failure, because a cached function that throws is not cached: a fixed setup works at once
// instead of after an hour.
async function loadSearch(host: string): Promise<Record<string, PageSearch>> {
  "use cache";
  cacheLife("hours");
  const token = await accessToken();
  // Search Console data lags about two days. The 28 days on screen, and the 28 before them for the change arrows.
  const end = new Date(Date.now() - 2 * 86_400_000);
  const start = new Date(end.getTime() - 27 * 86_400_000);
  const prevEnd = new Date(start.getTime() - 86_400_000);
  const prevStart = new Date(prevEnd.getTime() - 27 * 86_400_000);
  const [now, before] = await Promise.all([allRows(token, start, end, ["page", "query"]), allRows(token, prevStart, prevEnd, ["page"])]);
  const pages = foldSearchRows(now, host);
  const prev = foldPageRows(before, host);
  for (const [path, p] of Object.entries(pages)) if (prev[path]) p.prev = prev[path];
  return pages;
}

/**
 * Google's own verdict per page (indexed or not) from the URL Inspection API. Each page is cached a day on its own
 * (the quota is 2000 a day), and one load only waits about ten seconds, so a cold start never blocks the dashboard:
 * what is not read yet is counted in `missing` and fills in on the next load.
 */
export async function indexData(baseUrl: string, paths: string[], budgetMs = 10_000): Promise<{ status: Record<string, IndexStatus> | null; missing: number; error?: string }> {
  if (!gscConfigured()) return { status: null, missing: 0 };
  const out: Record<string, IndexStatus> = {};
  const deadline = Date.now() + budgetMs;
  let lastError = "";
  // Five at a time, so the 600 a minute limit is never near.
  for (let i = 0; i < paths.length && Date.now() < deadline; i += 5) {
    await Promise.all(
      paths.slice(i, i + 5).map(async (p) => {
        try {
          out[p] = await inspectOne(baseUrl, p);
        } catch (e) {
          lastError = e instanceof Error ? e.message : "failed";
        }
      }),
    );
  }
  const read = Object.keys(out).length;
  if (!read && lastError) return { status: null, missing: paths.length, error: `${lastError}. Add the service account as a full user of the Search Console property.` };
  return { status: out, missing: paths.length - read };
}

// Throws on failure, so a failed page is asked again on the next load instead of being cached as empty.
async function inspectOne(baseUrl: string, path: string): Promise<IndexStatus> {
  "use cache";
  cacheLife("days");
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: baseUrl + path, siteUrl: process.env.GSC_SITE_URL }),
    signal: AbortSignal.timeout(20_000),
  });
  const data = (await res.json()) as { inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string } }; error?: { message?: string } };
  const r = data.inspectionResult?.indexStatusResult;
  if (!res.ok || !r) throw new Error(data.error?.message ?? `Search Console would not inspect ${path} (${res.status})`);
  return { verdict: r.verdict ?? "UNKNOWN", state: r.coverageState ?? "", lastCrawl: r.lastCrawlTime?.slice(0, 10) };
}
