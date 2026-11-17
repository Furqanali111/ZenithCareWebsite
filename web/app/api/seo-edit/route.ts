import { cookies } from "next/headers";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { applyEdit, editFile, validateEdit, type Edit } from "@/lib/seo-edit";
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

const MAX_EDITS = 50;
type Job = { message: string; files: { file: string; change: (text: string) => string }[] };

/** What to change in which files, or the reason the request is refused. Several edits to one file are applied in order. */
function plan(raw: unknown): { job: Job } | { error: string } {
  if (raw && typeof raw === "object" && "snapshot" in raw) {
    const s = validateHistoryEntry((raw as { snapshot: unknown }).snapshot);
    if (!s.ok) return { error: s.error };
    return { job: { message: `chore(seo): record SEO score snapshot ${s.entry.date}`, files: [{ file: "content/seo-history.json", change: (t) => appendHistory(t, s.entry) }] } };
  }
  // One edit ({target, values}) or a batch ({edits: [...]}) saved as a single commit.
  const list = raw && typeof raw === "object" && "edits" in raw ? (raw as { edits: unknown }).edits : [raw];
  if (!Array.isArray(list) || !list.length || list.length > MAX_EDITS) return { error: `Send 1 to ${MAX_EDITS} edits.` };
  const edits: Edit[] = [];
  for (const item of list) {
    const v = validateEdit(item);
    if (!v.ok) return { error: v.error };
    edits.push(v.edit);
  }
  const byFile = new Map<string, typeof edits>();
  for (const e of edits) byFile.set(editFile(e.target), [...(byFile.get(editFile(e.target)) ?? []), e]);
  const label = (t: (typeof edits)[number]["target"]) => (t.kind === "post" ? t.slug : t.path);
  // The subject and the lines below it are read back by pendingLabels to badge rows that wait in a pull request.
  const lines = edits.map((e) => `update SEO text for ${label(e.target)}`);
  return {
    job: {
      message: edits.length === 1 ? `fix(seo): ${lines[0]}` : `fix(seo): update SEO text for ${edits.length} pages\n\n${lines.join("\n")}`,
      files: [...byFile].map(([file, list]) => ({ file, change: (text: string) => list.reduce((t, e) => applyEdit(t, e), text) })),
    },
  };
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
      for (const f of job.files) {
        const file = path.join(process.cwd(), f.file);
        await writeFile(file, f.change(await readFile(file, "utf8")));
      }
      return json({ ok: true, mode: "local", message: `Saved to ${job.files.map((f) => f.file).join(", ")}.` });
    }
    const token = (await cookies()).get("keystatic-gh-access-token")?.value;
    if (!token) return json({ error: "Sign in to the editor at /keystatic first, then save again." }, 401);
    return json({ ok: true, mode: "pr", url: await commitToEditBranch(token, job.files.map((f) => ({ file: `web/${f.file}`, change: f.change })), job.message) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Save failed." }, 502);
  }
}
