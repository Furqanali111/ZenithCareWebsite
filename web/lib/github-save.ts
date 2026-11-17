import { cacheLife } from "next/cache";

/**
 * Saves an inline SEO change the way the editor (/keystatic) saves: onto a branch, then a pull request
 * against develop. Never touches develop. Uses the signed-in editor's own GitHub token, so GitHub
 * decides who may write. One branch per person collects their edits into one open PR.
 * Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
import { BASE_BRANCH as BASE, REPO } from "./repo";
export { REPO };

export async function gh(token: string, method: string, path: string, body?: unknown) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, ok: res.ok, data };
}

const must = (r: { ok: boolean; status: number; data: Record<string, unknown> }, what: string) => {
  if (r.ok) return r.data;
  if (r.status === 401) throw new Error("Your editor sign-in expired. Open /keystatic, sign in again, then save again.");
  throw new Error(`GitHub refused to ${what} (${r.status}${typeof r.data.message === "string" ? `: ${r.data.message}` : ""}).`);
};

export type FileChange = { file: string; change: (current: string) => string };

/**
 * Commits changes to one or more files (paths relative to the repo root) as ONE commit on the person's own
 * branch and returns the PR URL. A branch whose pull request was merged or closed is deleted and cut again
 * from develop, so a squash-merged branch never drags old commits into the next PR.
 * Several files cost a fixed handful of GitHub calls (git data API), not one commit per file.
 */
export async function commitToEditBranch(token: string, changes: FileChange[], message: string): Promise<string> {
  const login = String(must(await gh(token, "GET", "/user"), "read your account").login);
  const owner = REPO.split("/")[0];
  const branch = `feature/seo-edits-${login.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 30)}`;
  const openPrs = () => gh(token, "GET", `/repos/${REPO}/pulls?head=${owner}:${branch}&state=open&per_page=1`);

  let ref = await gh(token, "GET", `/repos/${REPO}/git/ref/heads/${branch}`);
  if (ref.ok) {
    // Stale means: no open PR AND a finished (merged or closed) one exists. A branch with commits but no PR at all
    // is edits whose PR was never opened (the compare-page fallback below), and must not be thrown away.
    // Only delete on a clear answer, and if GitHub refuses the delete, keep using the branch rather than block saving.
    const [open, done] = await Promise.all([openPrs(), gh(token, "GET", `/repos/${REPO}/pulls?head=${owner}:${branch}&state=closed&per_page=1`)]);
    const none = (r: { ok: boolean; data: unknown }) => r.ok && (r.data as unknown[]).length === 0;
    if (none(open) && done.ok && !none(done) && (await gh(token, "DELETE", `/repos/${REPO}/git/refs/heads/${branch}`)).ok) {
      ref = { ...ref, ok: false, status: 404 };
    }
  }
  if (!ref.ok) {
    const base = must(await gh(token, "GET", `/repos/${REPO}/git/ref/heads/${BASE}`), `read ${BASE}`);
    ref = await gh(token, "POST", `/repos/${REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha: (base.object as { sha: string }).sha });
    must(ref, "create your branch");
  }
  const head = String(((ref.data.object ?? ref.data) as { sha?: string }).sha);

  const [headCommit, files] = await Promise.all([
    gh(token, "GET", `/repos/${REPO}/git/commits/${head}`),
    Promise.all(
      changes.map(async (c) => {
        const cur = must(await gh(token, "GET", `/repos/${REPO}/contents/${c.file}?ref=${encodeURIComponent(branch)}`), `read ${c.file}`);
        const before = Buffer.from(String(cur.content), "base64").toString("utf8");
        return { path: c.file, before, after: c.change(before) };
      }),
    ),
  ]);
  const edited = files.filter((f) => f.after !== f.before);
  if (edited.length) {
    const tree = must(
      await gh(token, "POST", `/repos/${REPO}/git/trees`, {
        base_tree: (must(headCommit, "read the branch").tree as { sha: string }).sha,
        tree: edited.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.after })),
      }),
      "save the files",
    );
    const commit = must(await gh(token, "POST", `/repos/${REPO}/git/commits`, { message, tree: tree.sha, parents: [head] }), "save the commit");
    must(await gh(token, "PATCH", `/repos/${REPO}/git/refs/heads/${branch}`, { sha: commit.sha }), "update your branch");
  }

  // The edit is already committed. If the editor's GitHub App may not read or open pull requests,
  // hand back GitHub's "create pull request" page instead of failing.
  const compare = `https://github.com/${REPO}/compare/${BASE}...${branch}?expand=1`;
  const open = await openPrs();
  const existing = (open.data as unknown as { html_url?: string }[])[0];
  if (open.ok && existing?.html_url) return existing.html_url;
  const pr = await gh(token, "POST", `/repos/${REPO}/pulls`, {
    title: `SEO edits from the dashboard (${login})`,
    head: branch,
    base: BASE,
    body: "Edits made in the SEO dashboard. Review the diff, then squash-merge. The branch is recreated on the next save.",
  });
  return pr.ok && typeof pr.data.html_url === "string" ? pr.data.html_url : compare;
}

export type PendingPr = { url: string; login: string; messages: string[] };

/** Open dashboard pull requests with their commit messages (see pendingLabels). null when GitHub could not be read. */
async function fetchPending(token?: string): Promise<PendingPr[] | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const get = async (path: string) => {
    const res = await fetch(`https://api.github.com${path}`, { headers, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`GitHub ${res.status}`); // also the rate limit: an empty list would look like "nothing pending"
    return (await res.json()) as Record<string, unknown>[];
  };
  try {
    const prs = (await get(`/repos/${REPO}/pulls?state=open&base=${BASE}&per_page=30`)).filter((p) => String((p.head as { ref: string }).ref).startsWith("feature/seo-edits-"));
    return await Promise.all(
      prs.map(async (p) => ({
        url: String(p.html_url),
        login: String((p.head as { ref: string }).ref).replace("feature/seo-edits-", ""),
        messages: (await get(`/repos/${REPO}/pulls/${p.number}/commits?per_page=100`)).map((c) => String((c.commit as { message: string }).message)),
      })),
    );
  } catch {
    return null;
  }
}

// Without a GitHub sign-in the calls use GitHub's 60 an hour per address, which Vercel shares, so that
// answer is cached for a minute. A signed-in person has 5000 an hour and always sees fresh data.
async function pendingPublic() {
  "use cache";
  cacheLife("minutes");
  return fetchPending();
}

export const pendingEdits = (token: string | undefined) => (token ? fetchPending(token) : pendingPublic());
