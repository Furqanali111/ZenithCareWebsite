/**
 * What the editor pill and the dashboard badges say about a person's edits, worked out from what GitHub reports.
 * Pure, so the node tests cover every case; app/api/publish/route.ts and lib/github-save.ts fetch the inputs.
 * The publish workflow (.github/workflows/publish-content.yml) writes the failure comments read here.
 */
export type PublishState = { kind: "clean" | "ready" | "publishing" | "published" } | { kind: "failed" | "stuck"; reason: string };

/** The fields used here, as GitHub's pull request list gives them. */
export type PublishPr = { state: string; created_at: string; merged_at: string | null };
export type PrComment = { user: { login: string; type: string } | null; body?: string | null };

const MINUTE = 60_000;
const FAILED = "Publishing failed. Ask Furqan to look.";
const STUCK = "This is taking longer than usual. Ask Furqan to look.";

/** The one branch per person the publish workflow accepts: the GitHub login in lowercase, nothing else changed. */
export const editBranch = (family: "content" | "seo-edits", login: string) => `feature/${family}-${login.toLowerCase()}`;

/**
 * Why the publish of this exact commit failed, from the newest matching comment, or null when none says so.
 * The repo is public, so anyone can comment: only the workflow's own account counts, and only for this commit.
 */
export function failureReason(comments: PrComment[], headSha: string): string | null {
  const marker = `<!-- publish-failed:${headSha} -->`;
  const hit = comments.findLast((c) => c.user?.login === "github-actions[bot]" && c.user.type === "Bot" && !!c.body?.startsWith(marker));
  if (!hit) return null;
  return hit.body!.slice(marker.length).replace(/\p{Cc}/gu, " ").replace(/  +/g, " ").trim().slice(0, 1000) || FAILED;
}

export function publishState({ pr, ahead, headSha, comments, now }: { pr: PublishPr | null; ahead: number; headSha: string; comments: PrComment[]; now: number }): PublishState {
  const waiting: PublishState = { kind: ahead > 0 ? "ready" : "clean" };
  if (!pr) return waiting;
  if (pr.merged_at) return ahead === 0 && now - Date.parse(pr.merged_at) < 10 * MINUTE ? { kind: "published" } : waiting;
  const reason = failureReason(comments, headSha);
  if (reason !== null) return { kind: "failed", reason };
  if (pr.state === "open") return now - Date.parse(pr.created_at) > 15 * MINUTE ? { kind: "stuck", reason: STUCK } : { kind: "publishing" };
  return waiting;
}

/**
 * What the editor pill says for a state (app/keystatic/branch-guard.tsx) and its one button, if any.
 * `saw` is whether this tab saw a publish start: only then do published and clean read "Published",
 * until the next edit (ready). Returns the new `saw`.
 */
export function pillView(state: PublishState, saw: boolean): { text: string; button: "Publish" | "Publish again" | "Reload" | null; saw: boolean } {
  switch (state.kind) {
    case "ready":
      return { text: "Your changes are private until you publish.", button: "Publish", saw: false };
    case "publishing":
      return { text: "Publishing. This takes a few minutes.", button: null, saw: true };
    case "failed":
      return { text: state.reason, button: "Publish again", saw };
    case "stuck":
      return { text: state.reason, button: null, saw };
    default:
      return saw ? { text: "Published. Live in a few minutes.", button: "Reload", saw } : { text: "No changes to publish.", button: null, saw };
  }
}
