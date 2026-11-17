import { NextResponse, type NextRequest } from "next/server";

// Password gate for /seo-dashboard and its save route /api/seo-edit (HTTP Basic: any user name, the password from the env var).
// Set SEO_DASHBOARD_PASSWORD in Vercel (Production and Preview). While it is unset the page
// answers 404 in production, so a missed setup fails closed. Local dev stays open.
// shortcut: one shared password, no per-person accounts or lockout. Upgrade if the team grows.
const same = (a: string, b: string) => {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
};

export function proxy(req: NextRequest) {
  const password = process.env.SEO_DASHBOARD_PASSWORD;
  if (!password) {
    return process.env.NODE_ENV === "production" ? new NextResponse(null, { status: 404 }) : NextResponse.next();
  }
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
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: ["/seo-dashboard", "/api/seo-edit"] };
