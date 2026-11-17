/**
 * Saves an inline SEO change the way the editor (/keystatic) saves: onto a branch, then a pull request
 * against develop. Never touches develop. Uses the signed-in editor's own GitHub token, so GitHub
 * decides who may write. One branch per person collects their edits into one open PR.
 * Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
export const REPO = "Furqanali111/ZenithCareWebsite"; // same repo as keystatic.config.ts
const BASE = "develop";

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

/** Commits one change to a file (path relative to the repo root) on the person's own branch and returns the PR URL. */
export async function commitToEditBranch(token: string, file: string, message: string, change: (current: string) => string): Promise<string> {
  const login = String(must(await gh(token, "GET", "/user"), "read your account").login);
  const branch = `feature/seo-edits-${login.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 30)}`;

  if ((await gh(token, "GET", `/repos/${REPO}/git/ref/heads/${branch}`)).status === 404) {
    const base = must(await gh(token, "GET", `/repos/${REPO}/git/ref/heads/${BASE}`), `read ${BASE}`);
    must(await gh(token, "POST", `/repos/${REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha: (base.object as { sha: string }).sha }), "create your branch");
  }

  const current = must(await gh(token, "GET", `/repos/${REPO}/contents/${file}?ref=${encodeURIComponent(branch)}`), `read ${file}`);
  const next = change(Buffer.from(String(current.content), "base64").toString("utf8"));
  must(
    await gh(token, "PUT", `/repos/${REPO}/contents/${file}`, {
      message,
      content: Buffer.from(next, "utf8").toString("base64"),
      sha: current.sha,
      branch,
    }),
    `save ${file}`,
  );

  // The edit is already committed. If the editor's GitHub App may not read or open pull requests,
  // hand back GitHub's "create pull request" page instead of failing.
  const compare = `https://github.com/${REPO}/compare/${BASE}...${branch}?expand=1`;
  const open = await gh(token, "GET", `/repos/${REPO}/pulls?head=${REPO.split("/")[0]}:${branch}&state=open&per_page=1`);
  const existing = (open.data as unknown as { html_url?: string }[])[0];
  if (open.ok && existing?.html_url) return existing.html_url;
  const pr = await gh(token, "POST", `/repos/${REPO}/pulls`, {
    title: `SEO edits from the dashboard (${login})`,
    head: branch,
    base: BASE,
    body: "Edits made in the SEO dashboard. Each edit is one commit. Review the diff, then squash-merge.",
  });
  return pr.ok && typeof pr.data.html_url === "string" ? pr.data.html_url : compare;
}

/** Open dashboard pull requests with their commit messages (see pendingLabels). Reads only. */
export async function pendingEdits(token: string | undefined): Promise<{ url: string; login: string; messages: string[] }[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const get = async (path: string) => {
    const res = await fetch(`https://api.github.com${path}`, { headers, cache: "no-store", signal: AbortSignal.timeout(8000) });
    return res.ok ? ((await res.json()) as Record<string, unknown>[]) : [];
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
    return []; // pending badges are a convenience: no network, no badges
  }
}
