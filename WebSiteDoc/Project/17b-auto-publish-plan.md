# Auto Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** The SEO team edits and publishes with no branch, PR, merge or deployment to handle, and their title edits take effect.

**Architecture:** The editor works on a personal branch. Publish (or a dashboard save) opens a PR with the person's own GitHub token. A workflow running from develop checks, builds, squash-merges and deploys it, and reports failures as a bot comment that the site shows in plain English.

**Tech stack:** Next.js 16.4.6, Keystatic, GitHub Actions, node test runner. No new dependency.

**Spec:** [17-auto-publish-design.md](17-auto-publish-design.md)

## Global Constraints

- Branch `feature/auto-publish`, cut from develop. One commit per task, one-line Conventional Commit subject. No push until Furqan asks.
- Publishing branches: `feature/content-<login>` (editor) and `feature/seo-edits-<login>` (dashboard). Nothing else is ever auto-merged. `<login>` is the existing slug: lowercase, `[^a-z0-9-]` to `-`, 30 characters.
- Publishable files: `.json`, `.mdx`, `.webp`, `.jpg`, `.jpeg`, `.png`, `.avif` under `web/content/`, `web/public/resources/`, `web/public/social/`. Regular files only (mode 100644).
- Squash merge only, with `--match-head-commit`.
- No em dashes. No words "branch", "pull request", "merge" or "deploy" in text the SEO team sees, except on developer branches.
- All commands run in `web/`. Tests: `pnpm test`.

## Review Focus

1. **Code hidden in an article:** `---js` front matter, `{...}`, `import`, unknown tags. Refused, with the file named (Task 2).
2. **Save during a publish:** the later edit survives and is not published. Save is blocked, and a late commit stays on the branch (Tasks 3 and 5).
3. **Someone else's comment posing as a failure on this public repo:** ignored (Task 4).
4. **Publish that never finishes:** after 15 minutes the pill says so (Task 4).
5. **Expired sign-in or nothing to publish:** a clear message, no PR (Task 4).

---

### Task 1: One place for titles

**Files:** modify `lib/seo.tsx`, `lib/seo-edit.ts`, `keystatic/search-appearance.ts`, `content/page-seo.json`, the 22 `app/**/page.tsx` with a literal title, plus `roi-calculator`, the three category pages, `services/[service]`, `who-we-serve/[specialty]`. Test: `tests/seo-tools.test.mjs`.

**Produces:** `LIMITS.pageTitle = 60`; `pageMetadata` needs no `title`/`description` when the path has an entry.

- [ ] Failing test: `validateEdit` accepts a page title of 51 and of 60 characters, refuses 61.
- [ ] Run it: FAIL on 51.
- [ ] Set `LIMITS.pageTitle` to 60 and the Keystatic `max` to 60. Help text: "Up to 60 characters. Over 36, Google may cut it, because the site name is added after it."
- [ ] Make `title` and `description` optional in `PageMetadataInput`. With no entry and no title, throw `pageMetadata: no title for <path>`.
- [ ] Stop passing title and description on every listed page. Delete literals with no other use. Keep fields that still feed schema, share images or sibling cards.
- [ ] Set `/` in `page-seo.json` to `Outsourced CCM, Medical Billing & Staffing Services`.
- [ ] Verify: `pnpm test` and `pnpm build` pass. In the built output, every page title and description is the same as before, except the home title.
- [ ] Commit `fix(seo): keep page titles in one place and allow 60 characters`.

### Task 2: Content check

**Files:** create `lib/content-check.ts`, `scripts/check-content.mjs`. Test: `tests/content-check.test.mjs`.

**Produces:**
- `checkFile(f: { path: string; status: string; mode: string; text?: string }): string | null` returns the reason or null.
- `check-content.mjs <base-ref> <head-sha>` reads the three-dot diff (both names of a rename), prints reasons, exits 1 on any.

Rules for `.mdx`: first line is exactly `---`; no unescaped `{` (an odd number of backslashes before it counts as escaped); no line starting with `import ` or `export `; tags only `Callout`, `BookCall`, `Toc`; no `<!--`. `.json` must parse. A deletion needs only an allowed path.

- [ ] Failing tests. Accepted: all 19 current posts, a `\{`, each allowed image type, a deleted post. Refused: `web/content/posts.ts`, `web/app/page.tsx`, `.github/workflows/x.yml`, `.svg`, `web/content/../app/x.json`, mode 120000, `---js`, `{process.env.X}`, `\\{x}`, `import x`, `<script>`, `<Foo />`, broken JSON, a rename out of the content folder.
- [ ] Run: FAIL, module not found. Implement. Run: PASS.
- [ ] Commit `feat(cms): check that a publish only holds content`.

### Task 3: Publish workflow

**Files:** create `.github/workflows/publish-content.yml`; modify `sync-deployment.yml` (add `workflow_call`), `post-dates.yml` and `slug-redirects.yml` (skip the two branch families), `seo-snapshot.yml` (squash-merge its PR).

Trigger: `pull_request_target` on develop, types opened, synchronize, reopened; same repo; the two prefixes. Concurrency per head branch, `cancel-in-progress: false`. Default permissions none. No dependency cache. Branch names and PR text reach scripts only through `env`.

| Job | Permissions | Does |
|---|---|---|
| check | contents write | From a develop checkout, runs `check-content.mjs` on the head sha. Then runs the date and redirect scripts on that sha, commits and pushes without force. Output: final sha |
| build | contents read | No kept credentials. Checks out the sha, merges develop locally, `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build` |
| publish | contents write, pull-requests write | Squash-merges with `--match-head-commit`, subject `fix(content): publish edits by <login>`. On `feature/content-*`, `git rebase --onto origin/develop <sha> origin/<branch>`, then `--force-with-lease` |
| deploy | contents write | Calls `sync-deployment.yml` |
| report | pull-requests write | Only if not merged. Comments `<!-- publish-failed:<current head sha> -->` plus the reason. Closes the PR on `feature/content-*` only |

Reasons, exact text: check, its output; conflict, "Someone else changed the same text. Ask Furqan to combine the two edits."; build, "The site could not be built with this edit:" and the first error line; other, "Publishing failed. Ask Furqan to look." A moved branch is not a failure: the newer run handles it.

- [ ] Write the five files. Verify: each parses as YAML, and `actionlint` is clean if available.
- [ ] Verify the rebase in a scratch git repo: a commit made after the checked sha survives, and with no later commit the branch equals develop.
- [ ] Commit `ci(cms): check, merge and deploy content edits automatically`.

### Task 4: Publish state, route and dashboard save

**Files:** create `lib/publish-state.ts`, `app/api/publish/route.ts`; modify `lib/github-save.ts`, `app/api/seo-edit/route.ts`, `components/seo-quick-edit.tsx`, `components/seo-dashboard-table.tsx`, `app/seo-dashboard/page.tsx`, `lib/seo-dashboard-data.ts`. Test: `tests/publish-state.test.mjs`.

**Produces:**
- `type PublishState = { kind: "clean" | "ready" | "publishing" | "published" } | { kind: "failed" | "stuck"; reason: string }`
- `publishState({ pr, ahead, headSha, comments, now }): PublishState`
- `failureReason(comments, headSha): string | null`, trusting only `github-actions[bot]` and a matching sha.
- `GET /api/publish`: state. `POST {action:"open"}`: `{branch}`, created or fast-forwarded, never forced. `POST {action:"publish"}`: state. 401 not signed in, 403 other origin or not a writer, 409 nothing to publish.
- `PendingPr` gains `failed?: string`.

- [ ] Failing tests. Open PR: publishing; open for 16 minutes: stuck. Closed unmerged at the same sha with a bot comment: failed with its reason; after a new save: ready. Merged 5 minutes ago with ahead 0: published; 11 minutes ago: clean. Merged with ahead 1: ready. Same comment by another user, or for another sha: ignored.
- [ ] Run: FAIL. Implement. Run: PASS.
- [ ] `commitToEditBranch` throws "Your edit is saved but publishing could not start. Try Save again." when no PR can be opened. Texts: "Saved. Publishing now, live in a few minutes." Badges: "Publishing", or "Not published: <reason>". No GitHub links.
- [ ] Commit `feat(seo): publish dashboard saves without a pull request to handle`.

### Task 5: Editor pill

**Files:** rewrite `app/keystatic/branch-guard.tsx`.

- [ ] On develop and signed in, POST open, then replace `/branch/develop` in the address and keep the rest. On failure keep today's warning and Save block.
- [ ] On the person's own content branch poll GET every 15 seconds and show: clean "No changes to publish."; ready "Your changes are private until you publish." with **Publish**; publishing "Publishing. This takes a few minutes."; published, only if this tab saw it publish, "Published. Live in a few minutes." with **Reload**; failed or stuck, the reason, with **Publish again** on failed only.
- [ ] While publishing, block Save, Create and Ctrl/Cmd+S, with a popup "Publishing. You can save again in a few minutes."
- [ ] Other branches keep today's pill. Buttons are keyboard reachable, status uses `role="status"`, the popup closes on Escape and returns focus.
- [ ] Verify in a browser with stubbed `/api/publish` answers for every state, at desktop and phone width. Run the accessibility review.
- [ ] Commit `feat(cms): add a Publish button to the editor`.

### Task 6: Rules and docs

- [ ] `.github/CODEOWNERS`: `* @Furqanali111`, then the three content folders with no owner, then `/web/content/posts.ts @Furqanali111`.
- [ ] Update `CLAUDE.md`, `11-git-workflow.md`, `16-keystatic-cms.md`, `16g-cms-seo-dashboard.md`, `PROGRESS.md`. Give Furqan's GitHub steps and the off switch (disable the workflow in Actions).
- [ ] Commit `docs(cms): describe automatic publishing`.

### Task 7: Whole-branch check

- [ ] `pnpm lint`, `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm build` all pass.
- [ ] `ponytail:ponytail-review`, `engineering:code-review`, then fix findings.
- [ ] Hand over the live test list. It needs the workflow on develop first, so Furqan merges this PR, then: one harmless publish, one refused edit, one save during a publish, one code PR to prove CODEOWNERS.
