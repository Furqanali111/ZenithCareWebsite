/**
 * Who may open /seo-dashboard and its save route. Pure, so the node tests can cover every branch;
 * proxy.ts looks up the inputs and turns the answer into a response. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
export type GateResult = "allow" | "unauthorized" | "not-found";

export type GateInput = {
  /** SEO_DASHBOARD_PASSWORD, if set. */
  password?: string;
  production: boolean;
  /** The visitor is signed in at /keystatic with a GitHub account that can write to the repo. */
  writer: boolean;
  /** The Authorization header, if any. */
  authorization?: string | null;
};

// Constant-time compare, so response time does not leak how much of a guess was right.
const same = (a: string, b: string) => {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
};

export function gateDecision({ password, production, writer, authorization }: GateInput): GateResult {
  if (!password && !production) return "allow"; // local dev
  if (writer) return "allow";
  if (!password) return "not-found"; // production with no password: fail closed
  const [scheme, encoded = ""] = (authorization ?? "").split(" ");
  let given = "";
  try {
    given = scheme === "Basic" ? atob(encoded).split(":").slice(1).join(":") : "";
  } catch {
    // Not valid base64: treated as a wrong password.
  }
  return given && same(given, password) ? "allow" : "unauthorized";
}
