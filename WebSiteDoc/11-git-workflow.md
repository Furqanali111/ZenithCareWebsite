# Git Workflow

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

Short, strict, unchanging. Everyone follows this.

---

## 1. Branches that exist

| Branch | Purpose | Who writes to it |
|---|---|---|
| `develop` | **Source of truth.** Reflects the next state we intend to release. Always green. | Nobody directly. **PR only.** |
| `release/vX.Y.Z` | A snapshot of `develop` prepared for production. Deployed from here. | Release engineer, cherry-picks only. |
| `feature/<short-title>` | A single new feature or page. | The developer building it. |
| `defect/<short-title>` | A single bug fix. | The developer fixing it. |
| `hotfix/<short-title>` | An urgent production fix that cannot wait for the next release. Cut from the latest `release/*`. | The on-call. |

**No other branches.** No `main`, no `master`, no `staging`, no personal long-lived branches.

## 2. Branch naming

- Lowercase, kebab-case, descriptive, short (≤ 50 chars after the prefix).
- Reference a ticket / issue number if there is one.

Good:
```
feature/roi-calculator
feature/chatbot-scaffold
feature/services-cpt-table
defect/mobile-nav-overlap-safari
defect/contact-form-formspree-500
hotfix/robots-blocking-crawlers
release/v1.0.0
release/v1.0.1
```

Bad:
```
my-branch
test
ali-work
feature/some-stuff-and-also-another-thing
Feature/UpdateHomepage
```

## 3. The flow

```
                                  ┌── cut ──► release/v1.0.0 ──► PROD
develop  ◄── PR (squash) ◄── feature/*   defect/*
   ▲                                    │
   └──── PR (squash) ◄──────────────────┘

(urgent) release/v1.0.0 ──► hotfix/* ──► PR ──► release/v1.0.1 ──► PROD
                                     └── also PR'd back into develop
```

### Starting work

```bash
git checkout develop
git pull --ff-only
git checkout -b feature/roi-calculator        # or defect/<title>
```

### Finishing work

1. Rebase onto latest `develop` (never merge `develop` into your branch):
   ```bash
   git fetch origin
   git rebase origin/develop
   ```
2. Push: `git push -u origin feature/roi-calculator`
3. Open a PR into `develop`. Fill the PR template (see §6).
4. Address review comments by pushing new commits (don't force-push once review has started).
5. When approved, **squash-merge** into `develop`. Delete the branch.

### Cutting a release

1. From latest `develop`:
   ```bash
   git checkout develop && git pull --ff-only
   git checkout -b release/v1.0.0
   git push -u origin release/v1.0.0
   ```
2. Vercel is configured to deploy `release/*` branches to production.
3. Tag the release after deploy:
   ```bash
   git tag -a v1.0.0 -m "v1.0.0 — initial launch"
   git push origin v1.0.0
   ```

### Hotfix

1. Branch from the latest `release/*` that is in production:
   ```bash
   git checkout release/v1.0.0 && git pull --ff-only
   git checkout -b hotfix/robots-blocking-crawlers
   ```
2. Fix, PR into `release/v1.0.1` (new release branch cut from `release/v1.0.0` + the fix) OR into the current `release/*` if we agree to patch it in place.
3. **Open a second PR** cherry-picking the fix into `develop` so the next release doesn't regress.

## 4. Protected-branch rules (set these in GitHub)

Both `develop` and every `release/*` must have:

- Require PR before merging
- Require at least **1 approving review**
- Require all status checks to pass (CI build, lint, typecheck)
- Require branches to be up to date before merging
- Require linear history (**squash merges only**)
- Require signed commits (nice-to-have, not blocking)
- **Disallow direct pushes** (including from admins)
- **Disallow force-push**
- **Disallow deletion**

## 5. Commit messages

Conventional Commits, **subject line only — no body**. One line, imperative, under ~70 chars. Everything else (why, how, risks, shortcuts) lives in the PR body, not the commit.

Format:
```
<type>(<scope>): <short imperative summary>
```

Types used in this repo: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.

Examples:
```
feat(roi-calculator): add client-side CCM revenue estimator
fix(contact-form): strip SSN patterns before Formspree POST
docs(seo): expand llms.txt with resources section
chore(deps): bump next to 14.2.5
```

Reason: subject-only commits read cleanly in `git log --oneline`, release notes, and PR titles. The PR body is where you explain the change — that's what reviewers and future-you will actually read.

**Attribution lines** (`Co-Authored-By:`, etc.) still belong in commits per the harness rule, appended on their own line(s) at the end. No prose body in between.

## 6. PR template

Create `.github/pull_request_template.md`:

```markdown
### What
<One-line summary of the change.>

### Why
<The problem this solves or the goal it serves.>

### How
<Approach notes, surprising decisions, trade-offs. Omit if obvious from the diff.>

### Scope touched
- [ ] Pages / routes
- [ ] Components
- [ ] Content (MDX / JSON)
- [ ] SEO / metadata
- [ ] Legal / compliance text
- [ ] CI / build config
- [ ] Dependencies

### Checklist
- [ ] Rebased onto latest `develop`
- [ ] Lint + typecheck pass locally
- [ ] Build succeeds locally
- [ ] Accessible (keyboard + screen-reader smoke tested if UI-touching)
- [ ] No console errors on affected pages
- [ ] No new environment variables added without updating `.env.example`
- [ ] No PHI, secrets, or real client data in diff
- [ ] Updated relevant docs under `WebSiteDoc/` if behavior changed

### Preview
<Vercel preview URL — auto-populated by the Vercel GitHub app.>
```

## 7. Hard rules (never break)

- **No direct push to `develop` or any `release/*`.** Admin override does not exist for these.
- **No merge of your own PR without an approval.** Even Ali.
- **No `--force` on shared branches.** `--force-with-lease` on your own feature branch is fine before review starts, forbidden after.
- **No secrets in commits.** If one slips, rotate immediately — git history is not security.
- **No merge commits to `develop`.** Squash-only keeps history linear.
- **No long-lived feature branches.** If a branch is open > 7 days, split the work or merge what's ready behind a feature flag.
- **No commit of `.env.local`, `node_modules/`, build artifacts, or editor config of a single machine.** Check `.gitignore`.
- **No PRs that mix unrelated changes** (e.g., "update homepage copy + fix contact form + bump deps"). Split them.

## 8. CI expectations (minimum)

Each PR to `develop` runs:
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck` (`tsc --noEmit`)
- `pnpm build`
- Chatbot script validator (`scripts/validate-chatbot.ts`) — if chatbot content is added later
- Link checker on changed MDX (soft-fail, not blocking)

All must pass before merge is allowed.

## 9. Versioning

Semantic versioning for release branches and tags:

- `vMAJOR.MINOR.PATCH`
- `MAJOR` — a redesign or a compliance-affecting change (bump deliberately)
- `MINOR` — a new page, new section, new feature
- `PATCH` — bug fix, copy edit, dependency bump

Launch is `v1.0.0`. The first bug fix after launch is `v1.0.1`. Adding `/who-we-serve/cardiology` is `v1.1.0`.
