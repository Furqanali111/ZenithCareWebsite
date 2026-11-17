import { cookies } from "next/headers";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { applyEdit, editFile, validateEdit } from "@/lib/seo-edit";
import { saveToGithub } from "@/lib/github-save";

/**
 * Inline SEO edits from /seo-dashboard.
 * - `next dev`: writes the local content file, like the editor does.
 * - Production: commits to the signed-in editor's own branch and opens a PR (lib/github-save.ts).
 *   The editor signs in once at /keystatic; this reads the same GitHub cookie.
 * The password gate in proxy.ts covers this route too.
 */
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  // Same-origin only: a browser also sends cached credentials from other sites.
  if (req.headers.get("origin") !== new URL(req.url).origin) return json({ error: "Forbidden." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Send JSON." }, 415);
  const raw = await req.json().catch(() => null);
  const v = validateEdit(raw);
  if (!v.ok) return json({ error: v.error }, 400);

  try {
    if (process.env.NODE_ENV === "development") {
      const file = path.join(process.cwd(), editFile(v.edit.target));
      await writeFile(file, applyEdit(await readFile(file, "utf8"), v.edit));
      return json({ ok: true, mode: "local", message: `Saved to ${editFile(v.edit.target)}.` });
    }
    const token = (await cookies()).get("keystatic-gh-access-token")?.value;
    if (!token) return json({ error: "Sign in to the editor at /keystatic first, then save again." }, 401);
    return json({ ok: true, mode: "pr", url: await saveToGithub(token, v.edit) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Save failed." }, 502);
  }
}
