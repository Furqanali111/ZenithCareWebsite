# Claude Requirements

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

Instructions every Claude session must follow when working on this repo. If a session is starting cold, **read this file + [CLAUDE.md](../CLAUDE.md) + the planning docs listed below BEFORE touching any code**.

---

## 0. Session start — mandatory reads

Before taking any action in this repo, read in this order:

1. [`CLAUDE.md`](../CLAUDE.md) — pinned project context (business, scope, stack, git rules)
2. The planning doc most relevant to the task:
   - UI / components work → [`04-design-brief.md`](04-design-brief.md)
   - New page / route → [`05-data-schema.md`](05-data-schema.md) + [`03-app-flow.md`](03-app-flow.md)
   - SEO or metadata → [`07-seo-and-aiseo-plan.md`](07-seo-and-aiseo-plan.md)
   - Legal / compliance text → [`08-legal-pages-draft.md`](08-legal-pages-draft.md) + `/hipaa-compliance` rules in [`01-product-requirements.md`](01-product-requirements.md)
   - Build/deploy/perf/security → [`02-technical-requirements.md`](02-technical-requirements.md)
   - Phase / sequencing → [`06-implementation-plan.md`](06-implementation-plan.md)
   - Launch sign-off → [`10-launch-checklist.md`](10-launch-checklist.md)
3. [`11-git-workflow.md`](11-git-workflow.md) — branch and PR rules, non-negotiable

Do not reason from memory of a previous session. The docs are the source of truth.

---

## 1. Operating mode — Ponytail (full)

- **Ponytail mode is active for this project.** Pick the smallest change that fully solves the task; delete beats add; reuse installed deps and existing components before adding anything new.
- No premature abstraction, no "flexibility for later," no config knobs nobody asked for.
- Shortcuts allowed, but mark them with a `shortcut: <limit>, <when to upgrade>` code comment.
- End every substantive reply with 1–2 lines of what was skipped and the risk the user must know.

---

## 2. Mandatory skills by task type

Invoke the right skill BEFORE acting. If a skill applies to the current task, use it — this is not optional.

| Task | Skill(s) to invoke |
|---|---|
| Any UI component, layout, or Tailwind work | **`taste-skill:taste-skill`** (frontend taste baseline), then **`taste-skill:soft-skill`** when the surface is high-visibility (hero, services page), **`taste-skill:minimalist-skill`** when the layout should restrain. |
| Hero sections, mocked comps, showcase surfaces | **`impeccable:impeccable`** before building, **`impeccable:impeccable-finish-reviewer`** before merging. |
| Picking colors / building the color system from the Design Brief tokens | **`ui-color-palette:*`** family — specifically `ui-color-palette-build-color-system` once, then reuse. |
| Charting or data viz (e.g. ROI calculator output visualization) | **`dataviz`** before writing chart code. |
| SEO audits / content SEO review | **`searchfit-seo:seo-audit`** or **`searchfit-seo:on-page-seo`**. |
| Content writing (blog posts, FAQ) | **`searchfit-seo:create-content`** for article-length pieces, **`searchfit-seo:create-topic`** when planning a new content angle. |
| Debugging a tricky bug | **`superpowers:systematic-debugging`**. |
| Any multi-option design or implementation decision | **`superpowers:brainstorming`**. |
| Writing or shipping new non-trivial logic (API-ish, parsers, calculators) | **`superpowers:test-driven-development`** — ROI calculator must ship with at least a small assert-based self-check per Ponytail rules. |
| Before handing a code PR back to the user | **`ponytail:ponytail-review`** on the diff — mandatory, not optional. Apply the review's findings before declaring the PR ready. |
| Full-repo quality sweep before launch or major milestones | **`ponytail:ponytail-audit`**. |
| Writing or editing the plan or TRD | **`superpowers:writing-plans`**. |

**Skills NOT to use**: anything specific to other domains (sales, bio-research, trading, etc.). Ignore.

---

## 3. Hard rules — ALWAYS enforce

### 3.1 Git & workflow
- `develop` is source of truth. **Never push to `develop` or any `release/*` directly** — PR only, with ≥ 1 approval.
- Branch names: `feature/<kebab-title>`, `defect/<kebab-title>`, `hotfix/<kebab-title>`. Lowercase, ≤ 50 chars after prefix.
- Rebase (never merge) `develop` into a feature branch.
- Squash-merge only. Conventional Commits (`feat(scope): …`, `fix(scope): …`, `docs(scope): …`).
- No force-push on shared branches. No PR self-merge.
- Full rules: [`11-git-workflow.md`](11-git-workflow.md).

### 3.2 HIPAA / PHI
- **Zero PHI on the site.** Not in forms, not in the chatbot, not in analytics, not in logs, not in the repo.
- Every form must display "Do not submit patient information" visibly, and client-side validation must regex-scan for common PHI patterns (SSN, MRN, DOB, "Patient <ProperNoun>") and block submit.
- Chatbot (when built) is scripted — no free-text input, no LLM calls — until the explicit v1.1 upgrade.
- No real client names, real patient data, or production API keys ever committed.

### 3.3 Security
- Site served **HTTPS only** (Vercel + Let's Encrypt — no manual cert work; see [`02-technical-requirements.md`](02-technical-requirements.md) §7).
- HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy configured and tested before launch.
- No secrets in commits. If one leaks, rotate immediately — git history is not security.
- No new third-party domain in HTML without adding it to the CSP allowlist first.

### 3.4 Accessibility
- WCAG 2.1 AA, baseline, non-negotiable. Healthcare sites are a top ADA lawsuit target.
- Every interactive element is a real `<button>` / `<a>`, keyboard-reachable, with a visible focus state.
- Every form field has a `<label>`. Every meaningful image has `alt`. Decorative images have `alt=""`.
- Run axe DevTools before merging any UI PR; zero criticals, zero serious.

### 3.5 Performance
- Lighthouse ≥ 95 on all four scores, every public page, every PR.
- JS payload per page < 150 KB gzipped. If a dependency breaks this, don't add it.
- All images through `next/image`. Fonts via `next/font`.
- Core Web Vitals all "Good" (LCP < 1.8s, INP < 100ms, CLS < 0.1).

### 3.6 SEO
- Every page: unique title (≤ 60 chars), unique meta description (140–160), one `<h1>`, canonical URL, Open Graph image.
- JSON-LD required per page type (see [`07-seo-and-aiseo-plan.md`](07-seo-and-aiseo-plan.md) §4). Validate with Rich Results Test.
- `sitemap.ts`, `robots.ts`, `llms.txt` must stay in sync as pages are added/removed.
- Do NOT block AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`) in robots.txt.

### 3.7 Legal copy
- `/privacy`, `/terms`, `/hipaa-statement`, `/accessibility` text must match `08-legal-pages-draft.md` exactly, with placeholders filled.
- Any edit to these pages requires a note in the PR saying "needs attorney review" and must not be merged without it (or without an existing standing approval from the attorney for that specific wording).

### 3.8 Deliberately NOT in v1 (do not build these by accident)
- `/pay`, Stripe Checkout, Stripe Elements — no on-site payment
- `/get-started` form (dropped in favor of `/contact`)
- LLM chatbot (deferred to v1.1 — v1 ships without a chatbot or with a placeholder button)
- Backend API routes, databases, auth, user accounts
- Newsletter, site search, comments, i18n
- Service pages for billing / credentialing / coding / AR (future expansion)

Full exclusion list: [`01-product-requirements.md`](01-product-requirements.md) §7, [`03-app-flow.md`](03-app-flow.md) §9, [`05-data-schema.md`](05-data-schema.md) §6.

---

## 4. Verification before claiming "done"

Follow **`superpowers:verification-before-completion`** before saying a task is complete. Minimum verification for this project:

| Change type | Must pass |
|---|---|
| New or edited component | `pnpm lint`, `pnpm typecheck`, `pnpm build`, Lighthouse ≥ 95 on affected pages, axe clean |
| New dependency | justified in PR body ("why this, why not X"); passes bundle-size budget |
| Content (MDX / FAQ JSON) | renders without errors, JSON-LD validates, no broken internal links |
| Legal copy change | matches `08-legal-pages-draft.md` exactly; PR flagged for attorney review |
| SEO change (metadata, sitemap, schema) | Rich Results Test passes; sitemap enumerates new URL; title/desc unique |
| Security change (CSP, headers, cert) | SSL Labs scan still ≥ A; no CSP violations in Chrome DevTools |

Never declare "done" without running the matching checks and listing the outcome.

---

## 5. What to ask vs. what to decide

**Decide and move** (auto mode is on):
- Component naming, file layout, Tailwind class choices within brief
- Which shadcn component to use for a widget
- Specific wording of a meta description within the SEO rules
- Which lucide icon to use

**Ask the user**:
- Any addition to the "deliberately not in v1" list
- Any change that affects legal copy
- Any new third-party service (new domain in CSP, new dep > 20 KB gzipped)
- Any change to branding (name, logo, colors)
- Any change that affects the DNS or hosting setup
- Any decision that costs money (new paid service, premium tier)

---

## 6. When in doubt

- Default to the lazier option (Ponytail wins ties).
- Default to the more accessible option.
- Default to the simpler option (fewer deps, less state, less abstraction).
- Default to NOT adding content that promises revenue — qualify everything ("typical", "representative", "actual results vary").
- Default to asking the user when the decision affects legal, security, HIPAA, cost, or scope.
