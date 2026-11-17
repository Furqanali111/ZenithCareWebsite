import { NextResponse, type NextRequest } from "next/server";
import { githubWriter } from "@/lib/github-access";
import { gateDecision } from "@/lib/seo-gate";

// Gate for /seo-dashboard and its save routes. Two ways in, decided in lib/seo-gate.ts:
//   1. Signed in at /keystatic with a GitHub account that can write to this repo (named per person).
//   2. HTTP Basic: any user name, the password from SEO_DASHBOARD_PASSWORD, for team members with no GitHub access.
// With no password set the page answers 404 in production for everyone else, so a missed setup
// fails closed. Local dev stays open.
// shortcut: one shared password, no lockout. Upgrade if the team grows.
export async function proxy(req: NextRequest) {
  const password = process.env.SEO_DASHBOARD_PASSWORD;
  const production = process.env.NODE_ENV === "production";
  // Local dev with no password is open: skip the GitHub lookup.
  const writer = !password && !production ? false : !!(await githubWriter(req.cookies.get("keystatic-gh-access-token")?.value));

  const result = gateDecision({ password, production, writer, authorization: req.headers.get("authorization") });
  if (result === "not-found") return new NextResponse(null, { status: 404 });
  if (result === "unauthorized") {
    return new NextResponse("Password required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="SEO dashboard", charset="UTF-8"', "Cache-Control": "no-store" },
    });
  }
  const res = NextResponse.next();
  if (password || production) res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: ["/seo-dashboard", "/api/seo-edit"] };
