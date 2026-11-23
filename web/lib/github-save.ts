import { cacheLife } from "next/cache";

/**
 * Saves an inline SEO change onto the person's own branch, then opens a pull request against develop that the
 * publish workflow (.github/workflows/publish-content.yml) checks, merges and deploys. Never touches develop.
 * Uses the signed-in editor's own GitHub token, so GitHub decides who may write. Also the GitHub reads behind
 * /api/publish (the article editor's Publish button). Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
import { BASE_BRANCH as BASE, REPO } from "./repo";
import { editBranch, publishState, type PrComment, type PublishPr } from "./publish-state";
export { REPO };

const OWNER = REPO.split("/")[0];

export async function gh(token: string, method: string, path: string, body?: unknown) {
  try {
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
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    return { status: res.status, ok: res.ok, data: (text ? JSON.parse(text) : {}) as Record<string, unknown> };
  } catch {
    // No answer in time, or an answer that is not GitHub's JSON: callers treat status 0 as "could not reach".
    return { status: 0, ok: false, data: {} as Record<string, unknown> };
  }
}

/** A failure in words the SEO team can act on. `status` is what a route answers with. */
export class SaveError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export const must = (r: { ok: boolean; status: number; data: Record<string, unknown> }, what: string) => {
  if (r.ok) return r.data;
  if (r.status === 401) throw new SaveError("Your editor sign-in expired. Open /keystatic, sign in again, then try again.", 401);
  if (!r.status) throw new SaveError("Could not reach GitHub. Try again in a few minutes.");
  console.error(`GitHub refused to ${what}`, r.status, r.data.message);
  throw new SaveError(`GitHub refused to ${what} (${r.status}). Try again in a few minutes.`);
};

export const whoAmI = async (token: string) => String(must(await gh(token, "GET", "/user"), "read your account").login);

/** The newest pull request from this branch into develop, as a one-item (or empty) list. */
export const pulls = (token: string, branch: string, state: "open" | "closed" | "all") =>
  gh(token, "GET", `/repos/${REPO}/pulls?head=${OWNER}:${branch}&base=${BASE}&state=${state}&per_page=1`);

export const openPr = (token: string, branch: string, title: string, body: string) => gh(token, "POST", `/repos/${REPO}/pulls`, { title, head: branch, base: BASE, body });

// shortcut: only the first 100 comments written after the branch's newest commit, which is when a failure can be
// reported. More than that in the few minutes of a publish only hides a reason. Upgrade to paging if it happens.
const commentsPath = (number: number, since: string) => `/repos/${REPO}/issues/${number}/comments?since=${since}&per_page=100`;

export type BranchAt = { sha: string; date: string; ahead: number; behind: number };

/**
 * Where a branch stands against develop, or null when it does not exist. Asked the other way round (branch...develop),
 * so the answer also names the branch's newest commit; page 2 leaves out the list of changed files.
 */
export async function branchAt(token: string, branch: string): Promise<BranchAt | null> {
  const r = await gh(token, "GET", `/repos/${REPO}/compare/${branch}...${BASE}?per_page=1&page=2`);
  if (r.status === 404) return null;
  const d = must(r, "read your changes") as { base_commit: { sha: string; commit: { committer: { date: string } } }; ahead_by: number; behind_by: number };
  return { sha: d.base_commit.sha, date: d.base_commit.commit.committer.date, ahead: d.behind_by, behind: d.ahead_by };
}

/** Creates the branch from develop, or moves it up to develop when it holds nothing of its own. Never forced. */
export async function ensureBranch(token: string, branch: string, at: BranchAt | null): Promise<{ sha: string; ahead: number }> {
  if (at && (at.ahead || !at.behind)) return at;
  const base = String((must(await gh(token, "GET", `/repos/${REPO}/git/ref/heads/${BASE}`), "read the live site") as { object: { sha: string } }).object.sha);
  if (!at) {
    const made = await gh(token, "POST", `/repos/${REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha: base });
    // 422: a second tab made it first. A later step that writes to it fails cleanly if it is not where expected.
    if (made.status !== 422) must(made, "start your private copy");
    return { sha: base, ahead: 0 };
  }
  // Refused when a save moved it meanwhile: it is then left as it is, which is not an error.
  const moved = await gh(token, "PATCH", `/repos/${REPO}/git/refs/heads/${branch}`, { sha: base, force: false });
  return { sha: moved.ok ? base : at.sha, ahead: 0 };
}

export type FileChange = { file: string; change: (current: string) => string };

/**
 * Commits changes to one or more files (paths relative to the repo root) as ONE commit on the person's own
 * branch, and makes sure a pull request publishes it. "nothing" when the site already has this text and nothing
 * else waits. A branch whose last pull request was merged or closed at its current commit is deleted and cut
 * again from develop, so a squash-merged branch never drags old commits into the next one.
 * Several files cost a fixed handful of GitHub calls (git data API), not one commit per file.
 */
export async function commitToEditBranch(token: string, changes: FileChange[], message: string): Promise<"publishing" | "nothing"> {
  const login = await whoAmI(token);
  const branch = editBranch("seo-edits", login);

  let at = await branchAt(token, branch);
  if (at?.ahead) {
    // Only a clear answer deletes. Commits after the finished pull request (one that could not be opened) stay.
    // If GitHub refuses the delete, keep using the branch rather than block saving.
    const [open, done] = await Promise.all([pulls(token, branch, "open"), pulls(token, branch, "closed")]);
    const last = done.ok ? (done.data as unknown as { head: { sha: string } }[])[0] : undefined;
    if (open.ok && (open.data as unknown as unknown[]).length === 0 && last?.head.sha === at.sha && (await gh(token, "DELETE", `/repos/${REPO}/git/refs/heads/${branch}`)).ok) at = null;
  }
  const { sha: head, ahead } = await ensureBranch(token, branch, at);

  const [headCommit, files] = await Promise.all([
    gh(token, "GET", `/repos/${REPO}/git/commits/${head}`),
    Promise.all(
      changes.map(async (c) => {
        const cur = must(await gh(token, "GET", `/repos/${REPO}/contents/${c.file}?ref=${head}`), `read ${c.file}`);
        const before = Buffer.from(String(cur.content), "base64").toString("utf8");
        return { path: c.file, before, after: c.change(before) };
      }),
    ),
  ]);
  const edited = files.filter((f) => f.after !== f.before);
  if (!edited.length && !ahead) return "nothing";
  if (edited.length) {
    const tree = must(
      await gh(token, "POST", `/repos/${REPO}/git/trees`, {
        base_tree: (must(headCommit, "read your saved edits").tree as { sha: string }).sha,
        tree: edited.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.after })),
      }),
      "save the files",
    );
    const commit = must(await gh(token, "POST", `/repos/${REPO}/git/commits`, { message, tree: tree.sha, parents: [head] }), "save your edit");
    must(await gh(token, "PATCH", `/repos/${REPO}/git/refs/heads/${branch}`, { sha: commit.sha }), "save your edit");
  }

  const open = await pulls(token, branch, "open");
  if (open.ok && (open.data as unknown as unknown[]).length) return "publishing";
  const pr = await openPr(token, branch, `SEO edits from the dashboard (${login})`, "Edits made in the SEO dashboard. Checked, merged and deployed by publish-content.yml.");
  if (!pr.ok) throw new SaveError("Your edit is saved but publishing could not start. Try Save again.");
  return "publishing";
}

/** The publish state of a person's own branch, for /api/publish. At most three GitHub calls. */
export async function branchState(token: string, branch: string) {
  const [list, at] = await Promise.all([pulls(token, branch, "all"), branchAt(token, branch)]);
  const pr = (must(list, "read your changes") as unknown as (PublishPr & { number: number; head: { sha: string } })[])[0] ?? null;
  // A failure can only explain a closed, unpublished pull request still at the branch's newest commit.
  const failed = pr && at && pr.state === "closed" && !pr.merged_at && pr.head.sha === at.sha;
  const comments = failed ? (must(await gh(token, "GET", commentsPath(pr.number, at.date)), "read why publishing failed") as unknown as PrComment[]) : [];
  const ahead = pr?.merged_at && at && pr.head.sha === at.sha ? 0 : at?.ahead ?? 0; // just merged, branch not moved onto develop yet: nothing to publish
  const state = publishState({ pr, ahead, headSha: at?.sha ?? "", comments, now: Date.now() });
  return { state, ahead, open: pr?.state === "open" };
}

async function read(token: string | undefined, path: string) {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com${path}`, { headers, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub ${res.status}`); // also the rate limit: an empty list would look like "nothing pending"
  return (await res.json()) as Record<string, unknown>[];
}

/** An open dashboard pull request: who made it, its commit messages (see pendingLabels), and why it failed if it did. */
export type PendingPr = { login: string; messages: string[]; failed?: string };

/** Open dashboard pull requests the publish workflow will take. null when GitHub could not be read. */
async function fetchPending(token?: string): Promise<PendingPr[] | null> {
  type Pr = PublishPr & { number: number; user: { login: string }; head: { ref: string; sha: string; repo: { full_name: string } | null }; base: { repo: { full_name: string } } };
  try {
    // The same rule the workflow applies, so a badge never says "Publishing" for something it will not publish.
    const prs = ((await read(token, `/repos/${REPO}/pulls?state=open&base=${BASE}&per_page=30`)) as unknown as Pr[]).filter(
      (p) => p.head.repo?.full_name === p.base.repo.full_name && p.head.ref === editBranch("seo-edits", p.user.login),
    );
    return await Promise.all(
      prs.map(async (p) => {
        const commits = (await read(token, `/repos/${REPO}/pulls/${p.number}/commits?per_page=100`)) as { commit: { message: string; committer: { date: string } } }[];
        // Publishing restarts with each new commit, so the 15 minutes count from the newest one.
        const date = [p.created_at, commits.at(-1)?.commit.committer.date ?? ""].sort().at(-1)!;
        const s = publishState({ pr: { ...p, created_at: date }, ahead: 1, headSha: p.head.sha, comments: (await read(token, commentsPath(p.number, date))) as unknown as PrComment[], now: Date.now() });
        return { login: p.user.login, messages: commits.map((c) => c.commit.message), failed: "reason" in s ? s.reason : undefined };
      }),
    );
  } catch {
    return null;
  }
}

// Without a sign-in the calls use GitHub's 60 an hour per address, which Vercel shares, so that
// answer is cached for a minute. A signed-in person has 5000 an hour and always sees fresh data.
async function pendingPublic() {
  "use cache";
  cacheLife("minutes");
  return fetchPending();
}

export const pendingEdits = (token: string | undefined) => (token ? fetchPending(token) : pendingPublic());
