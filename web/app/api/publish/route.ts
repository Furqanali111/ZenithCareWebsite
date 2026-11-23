import { cookies } from "next/headers";
import { branchAt, branchState, ensureBranch, gh, must, openPr, REPO, SaveError, whoAmI } from "@/lib/github-save";
import { editBranch } from "@/lib/publish-state";

/**
 * The article editor's Publish button (app/keystatic/branch-guard.tsx), always about the caller's own
 * feature/content-<login> branch, worked out from their GitHub sign-in cookie, never from the request.
 * - GET: { branch, kind, reason? }, see lib/publish-state.ts.
 * - POST {action: "open"}: { branch }, the branch made from develop, or moved up to it when it holds nothing.
 * - POST {action: "publish"}: opens the pull request the publish workflow merges, and answers like GET.
 * Uses the person's own token, so GitHub decides who may write. Doc: WebSiteDoc/Project/16-keystatic-cms.md
 */
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

async function signedIn(run: (token: string) => Promise<Response>) {
  const token = (await cookies()).get("keystatic-gh-access-token")?.value;
  if (!token) return json({ error: "You are not signed in. Open /keystatic and sign in with GitHub." }, 401);
  try {
    return await run(token);
  } catch (e) {
    if (e instanceof SaveError) return json({ error: e.message }, e.status);
    console.error(e);
    return json({ error: "Something went wrong. Try again in a few minutes." }, 502);
  }
}

export async function GET() {
  return signedIn(async (token) => {
    const branch = editBranch("content", await whoAmI(token));
    return json({ branch, ...(await branchState(token, branch)).state });
  });
}

export async function POST(req: Request) {
  // Same-origin only: a browser also sends cached credentials from other sites.
  if (req.headers.get("origin") !== new URL(req.url).origin) return json({ error: "Forbidden." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Send JSON." }, 415);
  const action = ((await req.json().catch(() => null)) as { action?: unknown } | null)?.action;
  if (action !== "open" && action !== "publish") return json({ error: "Unknown action." }, 400);

  return signedIn(async (token) => {
    const login = await whoAmI(token);
    const repo = await gh(token, "GET", `/repos/${REPO}`);
    if (repo.status === 404 || (repo.ok && (repo.data.permissions as { push?: boolean } | undefined)?.push !== true)) {
      return json({ error: "Your GitHub account cannot publish to this site. Ask Furqan for access." }, 403);
    }
    must(repo, "check your access");
    const branch = editBranch("content", login);

    if (action === "open") {
      await ensureBranch(token, branch, await branchAt(token, branch));
      return json({ branch });
    }
    const now = await branchState(token, branch);
    if (now.open) return json({ branch, ...now.state });
    if (!now.ahead) return json({ error: "There are no changes to publish." }, 409);
    const pr = await openPr(token, branch, `fix(content): publish edits by ${login}`, "Edits made in the article editor. Checked, merged and deployed by publish-content.yml.");
    if (pr.status === 422) {
      // A second click can win the race and open it first.
      const again = await branchState(token, branch);
      if (again.open) return json({ branch, ...again.state });
    }
    must(pr, "start publishing");
    return json({ branch, kind: "publishing" });
  });
}
