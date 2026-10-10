### What
<!-- One or two sentences stating what this PR adds, changes, or removes. -->

### Why
<!-- The problem this solves or the goal it serves. Why now, not later. -->

### How
<!-- Approach, key decisions, trade-offs. Omit if the diff is obvious. -->

### Scope
<!-- Tick what this PR touches. -->
- [ ] Pages / routes
- [ ] Components
- [ ] Content (MDX / JSON)
- [ ] SEO / metadata
- [ ] Legal / compliance text
- [ ] Theming / design tokens
- [ ] CI / build config
- [ ] Dependencies
- [ ] Docs (`WebSiteDoc/`, `README`, `PROGRESS.md`)

### Checklist
- [ ] Rebased onto latest `develop`
- [ ] `pnpm lint` clean
- [ ] `pnpm build` passes
- [ ] No console errors on affected pages
- [ ] No new environment variables added without updating `web/.env.example`
- [ ] No PHI, secrets, or real client data in diff
- [ ] Relevant doc under `WebSiteDoc/` updated if behavior changed
- [ ] `PROGRESS.md` updated with a one-liner under **Done**
