/**
 * Who may open the SEO dashboard besides the shared password: anyone signed in at /keystatic whose
 * GitHub account can write to this repo. Uses the editor's own GitHub token, so access is named per
 * person and follows GitHub's repo permissions. Server only. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */
import { REPO } from "./repo";

// shortcut: per-instance memory, so a cold serverless instance asks GitHub again. Fine for a team of a few.
const cache = new Map<string, { until: number; login: string | null }>();
const TTL = 5 * 60_000;

/** The GitHub login behind this token if it can push to the repo, else null. */
export async function githubWriter(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const hit = cache.get(token);
  if (hit && hit.until > Date.now()) return hit.login;
  let login: string | null = null;
  try {
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    const [repo, user] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}`, { headers, cache: "no-store", signal: AbortSignal.timeout(8000) }),
      fetch("https://api.github.com/user", { headers, cache: "no-store", signal: AbortSignal.timeout(8000) }),
    ]);
    if (repo.ok && user.ok) {
      const canPush = ((await repo.json()) as { permissions?: { push?: boolean } }).permissions?.push === true;
      const name = ((await user.json()) as { login?: string }).login;
      login = canPush && name ? name : null;
    }
  } catch {
    login = null; // GitHub unreachable: treated as not signed in
  }
  if (cache.size > 200) cache.clear();
  cache.set(token, { until: Date.now() + (login ? TTL : 30_000), login });
  return login;
}
