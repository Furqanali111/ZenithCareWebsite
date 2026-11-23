# Auto publish: setup for Furqan

## Decision (option 1 chosen by Furqan on 2026-11-24, option 2 stays a later hardening)

Because content-only changes need no code owner review, ANY account with write access can merge a content-only PR from any branch name by hand, without `publish-content.yml` ever running. So the content check is not enforced against a person with write access. MDX can run code at build time, and files under `web/public/resources` or `web/public/social` could include script. Staff accounts with write access must therefore be trusted and protected (2FA). Two options:

1. **Accept this (what is described below).** Content folders stay ownerless, and the workflow merges through the "no review needed" path. Cheap, but the check only binds honest use.
2. **The stronger design (NOT built).** Nothing is ownerless and "require 1 approval" applies to everyone. The publish job merges with a GitHub App installation token (the app key stored in an Environment limited to `develop`) that is on a ruleset bypass list. This needs your decision and setup.

Letting `github-actions` bypass the PR rule is not an option: any workflow a writer adds to their own branch would get the same bypass.

Also needs your decision: GitHub does not count an author's own approval, so with you as the only code owner your own PRs cannot merge. Recommended: add the second collaborator (`nadeemmansha00` is the only other collaborator; you must confirm) as co-owner on `*` and on `web/content/posts.ts`. `.github/CODEOWNERS` has NOT been edited to name anyone.

Design: `17-auto-publish-design.md`. Code: `.github/workflows/publish-content.yml`, `web/app/api/publish/route.ts`, `web/app/keystatic/branch-guard.tsx`, `web/lib/github-save.ts`.

Nothing here has run on GitHub yet. Every step below is yours, in this order.

## Setup for Furqan, in this order

### a. Merge this PR yourself

The workflow is read from `develop` (`pull_request_target`), so it does nothing until this PR is merged. Merge it by hand, as you do any code PR.

### b. Protect `develop`

Settings, Branches, add a rule for `develop`:

- Require a pull request before merging.
- Require approvals: 1 only if you pick the stronger design above; otherwise leave it off (needs Furqan's decision).
- Require review from Code Owners (this uses `.github/CODEOWNERS`).
- Do not allow force pushes. Do not allow deletion.
- Do not protect `feature/content-*`. The workflow force-pushes those branches (only those) after a merge, to move them onto the new `develop`. A rule on them would block that, and the saved edits would then show a conflict next time.

How the bot gets through: the workflow merges as the GitHub Actions bot, which can approve nothing and is not a code owner. Content folders have no owner in CODEOWNERS, so a content-only PR needs no code owner review. Leave "Require approvals" off and rely on "Require review from Code Owners" alone, and test it (step e, tests 1 and 4). With "Require approvals: 1" on, the bot cannot merge, and a code PR from you needs a second approver (see Decision needed above). The approvals line is therefore needs Furqan's decision, and the same statement is in `11-git-workflow.md` section 4.

Also protect `deployment-branch` (no direct pushes, no force pushes, no deletion; the sync workflow's merge must still be allowed). Today `develop` and `deployment-branch` are both unprotected, so any writer can push straight to production.

What I could confirm from reading GitHub documentation: CODEOWNERS is read from the base branch, the last matching pattern wins, and a pattern with no owner removes ownership for those paths. What I could not confirm and have not tested: that a PR touching only those folders really needs no review, that the bot's squash merge is then allowed, and which of the two ways your GitHub plan offers. Test it before you rely on it.

### c. Check repository settings

- Settings, Actions, General: "Allow GitHub Actions to create and approve pull requests" is on (checked 2026-11-23). Leave it on: the weekly score snapshot needs it.
- Workflow permissions: the default is read only (checked 2026-11-23). The workflow asks for what it needs per job, so leave the default.
- Squash merging is allowed (checked 2026-11-23).

### d. Editor sign-in

The Keystatic GitHub App needs Contents (read and write) and Pull requests (read and write); see `16-keystatic-cms.md`. The SEO team's GitHub accounts need write access to the repository. The Publish button and the dashboard save use each person's own sign-in token to create their branch and open the PR, so a person without write access gets "Your GitHub account cannot publish to this site. Ask Furqan for access."

### e. Live tests

Do these on a quiet day, with your own account first. Each has the result to expect.

- **Test 0, the open flow with a real sign-in.** Sign in at `/keystatic`, then open `/keystatic/branch/develop`. Expect the address to change to `/keystatic/branch/feature%2Fcontent-<your lowercase login>` and Keystatic to load that branch. If the address stays on `develop`, or the address changes but Keystatic still shows `develop`, saves would go to `develop`. Stop and tell Claude. This was only checked behind the sign-in screen, never signed in.
- **Test 1, one harmless article edit.** Change one word, Save, then Publish. Expect: "Your changes are private until you publish." then "Publishing. This takes a few minutes." then "Published. Live in a few minutes.", and the change on the live site some minutes after pressing Publish. The time is not measured; the job time limits add up to 15 minutes (3 minutes check, 7 minutes build, 3 minutes merge, 2 minutes deploy), plus queue time and then Vercel's own build. Look in the Actions tab at "Publish content". The pull request is merged by `github-actions[bot]`, with the title "fix(content): publish edits by <login>".
- **Test 2, an edit that must be refused.** Put a curly bracket `{` in an article, Save, Publish. Expect: the pill shows the reason, for example "web/content/posts/<file>.mdx: contains a curly bracket { in the text." with the button "Publish again", and nothing goes live. Remove the bracket, Save, press Publish again.
- **Test 3, save during a publish.** Press Publish, then at once click Save. Expect a popup: "Publishing. You can save again in a few minutes." and no save.
- **Test 4, a code PR still needs review.** Open a PR that changes any file under `web/lib` or `web/app`, from a normal `feature/*` branch. Expect GitHub to ask for your review as code owner and block the merge without it. Also try one that changes only `web/content/posts.ts`: it must still ask for review. If either merges without review, CODEOWNERS is not doing its job; fix the rule before anyone else gets access.
- **Test 6, a stale editor tab.** After "Published", edit and Save in the same open editor tab without pressing Reload. If Keystatic refuses a stale head, the pill must block writes until Reload. This is not built; if saves go through to the old head or fail with no message, tell Claude.
- **Test 5, someone else's branch name is ignored.** Open a PR into `develop` from a branch named `feature/content-someoneelse` as yourself. Expect the "Publish content" run to skip (no jobs) and the PR to wait for review as usual.

### f. The off switch

Actions tab, "Publish content", the three dots, "Disable workflow". From then on nothing is merged automatically: the editor still saves to private branches, and PRs are merged by hand as before. The pill will keep saying "Publishing. This takes a few minutes." until a person closes the PR; after 15 minutes it says "This is taking longer than usual. Ask Furqan to look."

### g. Known limits

From the design and the reports:

- Nobody reads the edit before it goes live. Wrong claims or patient information are not detected. The check only refuses code, links, braces and non-content files.
- If Vercel itself fails after the merge, nobody is told. The previous site stays up. Vercel's plan limits on deployments were not checked.
- A content publish also deploys every code change already merged on `develop`, which used to wait for the nightly sync.
- Keystatic's own branch menu stays visible in the editor.
- Two people editing the same text: the second gets "Someone else changed the same text. Ask Furqan to combine the two edits."
- "Re-run all jobs" on a finished run ends quietly with no message. To retry, close and reopen the PR (or save a new change).
- A branch name with capital letters (a GitHub login with capitals) may be matched by the gate but not cleaned up properly. Names are built in lower case, so use lower case.
- Deferred, not fixed: the "stuck" clock counts from when the PR was created, which can be wrong after a later save; right after a merge the pill says "ready" for a few seconds until the branch is moved onto `develop`, and for good if that move fails (Publish then opens a PR whose changes are already live); a failed test run shows a line that says little to staff; a person who edits from a branch named after someone else gets no message.
- A dashboard save that changes nothing after a failed publish does not retry it. Change something and save.
- The full deferred lists are in `.superpowers/sdd/17b-auto-publish-plan/progress.md` (minor notes of Tasks 2 to 5).
