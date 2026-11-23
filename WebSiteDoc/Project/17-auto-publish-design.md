# Auto publish for the SEO team: design

Status: approved by Furqan on 2026-11-23.

## Intent

The SEO team edits and publishes without seeing branches, pull requests, merges or deployments. An SEO edit must reach the live site, or say in plain English why it did not.

Decided by Furqan:
- Merging and deployment are automatic, with no human review.
- Article editor: **Save** keeps work private, a **Publish** button sends it live.
- When the SEO team changes a title, that change must take effect.

Everything else here was proposed by Claude and approved with this document.

## What is there today (checked 2026-11-23)

- A dashboard save already opens a PR through the `zenith-care-cms` GitHub App (seen on PR 153). Someone must merge it.
- In `/keystatic` people create the branch and the PR by hand.
- `develop` reaches `deployment-branch` every night. `develop` has no protection.
- A production build passes with no env file, so CI can build without secrets.
- 22 pages keep the same title and description in two places: `page.tsx` and `content/page-seo.json`. The JSON wins, so editing the code does nothing. This is what happened to commit `5f35ce6` (home title).
- Editor and dashboard refuse page titles over 36 characters. That home title is 51, so neither tool would have accepted it.

## Approaches

| | How | Trade-off |
|---|---|---|
| **A. Background PR (picked)** | Publish opens a PR; a GitHub workflow checks, builds, squash-merges and deploys it | Keeps history, checks and undo. A few minutes to go live |
| B. Save straight to develop | Remove the branch guard | Least code, but no build check, no redirects for renamed posts, no Publish button |
| C. Database instead of git | Pages read SEO text from Supabase | Near-instant, but a new backend and a large rewrite |

A is Claude's pick, because Furqan described outcomes rather than method.

## Design

### 1. Article editor (`app/keystatic/branch-guard.tsx`, new `app/api/publish/route.ts`)
- Opening the editor on `develop` moves the person to their own branch, `feature/content-<login>`, created or fast-forwarded from develop by the server with their own GitHub token.
- The pill shows: "Saved changes are private" with **Publish**; "Publishing"; "Published, live in a few minutes" with **Reload**; or the failure reason.
- Save is blocked while a publish runs. Other branches keep today's pill, for developers.
- The route accepts same-origin requests from repo writers only.

### 2. Dashboard (`lib/github-save.ts`, its route and texts)
- A save publishes by itself. Wording changes from "pull request" to "publishing".
- If the PR cannot be opened, it is an error, not a link to GitHub.

### 3. Workflow (`.github/workflows/publish-content.yml`)
Runs on PRs into develop from `feature/content-*` and `feature/seo-edits-*`, same repo only, using the workflow file on develop.
1. **Check:** only `.json`, `.mdx` and image files under `web/content`, `web/public/resources` and `web/public/social`. No symlinks. MDX may not contain code (imports, exports, expressions beyond plain values): it would run at build time on Vercel next to production secrets.
2. **Prepare:** run the existing date and redirect scripts. The two existing workflows skip these branches.
3. **Build:** merge with current develop locally, then test and build, with a read-only token and no secrets.
4. **Merge:** squash, only if the branch is still at the checked commit.
5. **Tidy:** move the editor branch onto new develop with `git rebase --onto`, so later saves are kept.
6. **Deploy:** call `sync-deployment.yml`, which gains `workflow_call`.

On failure, a PR comment holds the plain-English reason and the pill shows it. An editor PR is closed, so fixing and saving does not publish until Publish is pressed. A dashboard PR stays open and the next save retries.

### 4. Titles take effect
- Delete the duplicate title and description from pages that have an entry. `content/page-seo*.json` becomes the only place. A page with neither fails the build.
- Page title limit goes from 36 to 60. Above 36 stays a warning, because the site name is added and Google may cut it.
- Set the home title to "Outsourced CCM, Medical Billing & Staffing Services" (75 characters with the site name).

### 5. Weekly score snapshot
Merges its own PR.

### 6. Rules and docs
- `CLAUDE.md` and `11-git-workflow.md`: content-only PRs from these two branch families need no approval, and the bot may force-update `feature/content-*`.
- Update `16-keystatic-cms.md`, `16g-cms-seo-dashboard.md`, `PROGRESS.md`.

### 7. Owner step in GitHub (Furqan)
Protect develop: PR required, no force-push, code-owner review. A `CODEOWNERS` file names Furqan for everything except the content folders, so code still needs him and content does not. To be proven on a test PR before relying on it.

## Tests
- Node tests for the file check, MDX check, status mapping and the new title limit.
- One real publish of a harmless edit, one deliberately broken edit, one save during a publish.

## Non-goals
Publishing without a GitHub login, scheduled publishing, undo in the editor, publishing code, scanning content for patient information or wrong claims.

## Anti-goals
A code change going live by this path. A half-written article going live. A saved edit lost. A silent failure.

## Known limits
- Each publish ships everything already merged into develop.
- The team is not told if Vercel itself fails after the merge. The previous site stays up.
- Keystatic's own branch menu stays visible unless it can be hidden safely.
- Two people editing the same text: the second gets a conflict message and a developer may be needed.
- Not verified: Vercel plan deployment limits, and whether unsaved typing survives a reload.
