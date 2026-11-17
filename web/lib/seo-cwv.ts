import { cacheLife } from "next/cache";

/**
 * Core Web Vitals from real Chrome visitors (the CrUX API), for the whole site on phones. Optional: needs
 * CRUX_API_KEY (a free Google Cloud API key). A site with little traffic has no data, which is reported, not an error.
 * Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
import type { Vitals } from "./seo-site-checks";

export const cwvConfigured = () => !!process.env.CRUX_API_KEY;

export async function cwvData(origin: string): Promise<{ vitals: Vitals | null; note?: string }> {
  if (!cwvConfigured()) return { vitals: null };
  try {
    const v = await load(origin);
    return v ? { vitals: v } : { vitals: null, note: "Google has no field data for this site yet (it needs enough Chrome visitors)." };
  } catch (e) {
    return { vitals: null, note: e instanceof Error ? e.message : "Could not read Core Web Vitals." };
  }
}

// Returns null for "no data" (a normal answer, cached) and throws for real failures (not cached).
async function load(origin: string): Promise<Vitals | null> {
  "use cache";
  cacheLife("days");
  const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${process.env.CRUX_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, formFactor: "PHONE" }),
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 404) return null;
  const data = (await res.json()) as { record?: { metrics?: Record<string, { percentiles?: { p75?: number | string } }> }; error?: { message?: string } };
  if (!res.ok) throw new Error(data.error?.message ?? `CrUX refused the request (${res.status}).`);
  const m = data.record?.metrics ?? {};
  const p75 = (k: string) => (m[k]?.percentiles?.p75 === undefined ? undefined : Number(m[k].percentiles?.p75));
  return { lcp: p75("largest_contentful_paint"), inp: p75("interaction_to_next_paint"), cls: p75("cumulative_layout_shift") };
}
