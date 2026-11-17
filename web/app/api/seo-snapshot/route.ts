import { connection } from "next/server";
import { currentSnapshot } from "@/lib/seo-dashboard-data";

/**
 * Today's SEO score snapshot as JSON, for the weekly GitHub workflow (.github/workflows/seo-snapshot.yml).
 * Read only. Behind the same gate as the dashboard (proxy.ts): the workflow signs in with the dashboard password.
 */
export async function GET() {
  await connection();
  try {
    return Response.json(await currentSnapshot(), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Snapshot failed." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
