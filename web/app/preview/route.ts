import { NextResponse, type NextRequest } from "next/server";

/**
 * Where the editor's "Preview" button goes. A saved edit lives on a branch and is not on the live site until its pull
 * request is merged, so a preview of it opens on that branch's Vercel preview deployment.
 * Set PREVIEW_URL_TEMPLATE in Vercel, for example https://zcs-git-{branch}-yourteam.vercel.app (Vercel turns / in a
 * branch name into -). Without it, or in local dev, the preview opens the same page on this site.
 * Only a path on a fixed host is ever redirected to, so this is not an open redirect.
 */
export function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get("to") ?? "/";
  const branch = req.nextUrl.searchParams.get("branch") ?? "";
  const template = process.env.PREVIEW_URL_TEMPLATE;
  const safePath = /^\/[A-Za-z0-9_\-/]*$/.test(to) ? to : "/";
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  if (!template || process.env.NODE_ENV === "development" || !template.startsWith("https://") || !template.includes("{branch}") || !/^[A-Za-z0-9._/-]{1,100}$/.test(branch)) {
    return NextResponse.redirect(new URL(safePath, req.url), { headers });
  }
  const host = template.replace("{branch}", branch.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  return NextResponse.redirect(host.replace(/\/$/, "") + safePath, { headers });
}
