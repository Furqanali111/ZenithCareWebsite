import { cookies } from "next/headers";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { applyEdit, editFile, validateEdit } from "@/lib/seo-edit";
import { commitToEditBranch } from "@/lib/github-save";
import { appendHistory, validateHistoryEntry } from "@/lib/seo-site-checks";

/**
 * Inline SEO edits from /seo-dashboard, and the "record today's scores" snapshot.
 * - `next dev`: writes the local content file, like the editor does.
 * - Production: commits to the signed-in editor's own branch and opens a PR (lib/github-save.ts).
 *   The editor signs in once at /keystatic; this reads the same GitHub cookie.
 * The password gate in proxy.ts covers this route too.
 */
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

type Job = { file: string; message: string; change: (text: string) => string };

/** What to change in which file, or the reason the request is refused. */
function plan(raw: unknown): { job: Job } | { error: string } {
  if (raw && typeof raw === "object" && "snapshot" in raw) {
    const s = validateHistoryEntry((raw as { snapshot: unknown }).snapshot);
    if (!s.ok) return { error: s.error };
    return { job: { file: "content/seo-history.json", message: `chore(seo): record SEO score snapshot ${s.entry.date}`, change: (t) => appendHistory(t, s.entry) } };
  }
  const v = validateEdit(raw);
  if (!v.ok) return { error: v.error };
  const t = v.edit.target;
  return { job: { file: editFile(t), message: `fix(seo): update SEO text for ${t.kind === "post" ? t.slug : t.path}`, change: (text) => applyEdit(text, v.edit) } };
}

export async function POST(req: Request) {
  // Same-origin only: a browser also sends cached credentials from other sites.
  if (req.headers.get("origin") !== new URL(req.url).origin) return json({ error: "Forbidden." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Send JSON." }, 415);
  const p = plan(await req.json().catch(() => null));
  if ("error" in p) return json({ error: p.error }, 400);
  const { job } = p;

  try {
    if (process.env.NODE_ENV === "development") {
      const file = path.join(process.cwd(), job.file);
      await writeFile(file, job.change(await readFile(file, "utf8")));
      return json({ ok: true, mode: "local", message: `Saved to ${job.file}.` });
    }
    const token = (await cookies()).get("keystatic-gh-access-token")?.value;
    if (!token) return json({ error: "Sign in to the editor at /keystatic first, then save again." }, 401);
    return json({ ok: true, mode: "pr", url: await commitToEditBranch(token, `web/${job.file}`, job.message, job.change) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Save failed." }, 502);
  }
}
