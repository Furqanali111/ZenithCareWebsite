import { NextResponse, type NextRequest } from "next/server";
import { githubWriter } from "@/lib/github-access";

// Gate for /seo-dashboard and its save routes. Two ways in:
//   1. Signed in at /keystatic with a GitHub account that can write to this repo (named per person).
//   2. HTTP Basic: any user name, the password from SEO_DASHBOARD_PASSWORD, for team members with no GitHub access.
// With no password set the page answers 404 in production for everyone else, so a missed setup
// fails closed. Local dev stays open.
// shortcut: one shared password, no lockout. Upgrade if the team grows.
const same = (a: string, b: string) => {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
};

export async function proxy(req: NextRequest) {
  const allow = () => {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  };
  const password = process.env.SEO_DASHBOARD_PASSWORD;
  if (!password && process.env.NODE_ENV !== "production") return NextResponse.next();

  if (await githubWriter(req.cookies.get("keystatic-gh-access-token")?.value)) return allow();
  if (!password) return new NextResponse(null, { status: 404 });

  const [scheme, encoded = ""] = (req.headers.get("authorization") ?? "").split(" ");
  let given = "";
  try {
    given = scheme === "Basic" ? atob(encoded).split(":").slice(1).join(":") : "";
  } catch {
    // Not valid base64: treated as a wrong password.
  }
  if (!given || !same(given, password)) {
    return new NextResponse("Password required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="SEO dashboard", charset="UTF-8"', "Cache-Control": "no-store" },
    });
  }
  return allow();
}

export const config = { matcher: ["/seo-dashboard", "/api/seo-edit"] };
