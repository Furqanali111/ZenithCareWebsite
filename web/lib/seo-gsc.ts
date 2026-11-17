import { createSign } from "node:crypto";
import { cacheLife } from "next/cache";
import { foldSearchRows, type GscRow, type PageSearch } from "./seo-site-checks";

/**
 * Google Search Console data for the SEO dashboard: clicks, impressions, position and top queries per
 * page over the last 28 days. Read only. Needs three env vars (see .env.example); without them the
 * dashboard simply shows no search columns. Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
export const gscConfigured = () => !!(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY && process.env.GSC_SITE_URL);

const b64 = (x: string | Buffer) => Buffer.from(x).toString("base64url");

async function accessToken(): Promise<string> {
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

// Throws on any failure, because a cached function that throws is not cached: a fixed setup works at once
// instead of after an hour.
async function loadSearch(host: string): Promise<Record<string, PageSearch>> {
  "use cache";
  cacheLife("hours");
  const token = await accessToken();
  // Search Console data lags about two days.
  const end = new Date(Date.now() - 2 * 86_400_000);
  const start = new Date(end.getTime() - 27 * 86_400_000);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(process.env.GSC_SITE_URL as string)}/searchAnalytics/query`;
  // 5000 rows is Google's cap per request: keep asking until a short page (at most 5 pages), so a growing site is not cut off.
  const rows: GscRow[] = [];
  for (let startRow = 0; startRow < 25_000; startRow += 5000) {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: day(start), endDate: day(end), dimensions: ["page", "query"], rowLimit: 5000, startRow }),
      signal: AbortSignal.timeout(25_000),
    });
    const data = (await res.json()) as { rows?: GscRow[]; error?: { message?: string } };
    if (!res.ok) throw new Error(data.error?.message ?? `Search Console refused the request (${res.status}).`);
    rows.push(...(data.rows ?? []));
    if ((data.rows?.length ?? 0) < 5000) break;
  }
  return foldSearchRows(rows, host);
}
