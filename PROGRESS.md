# Progress Journal

**Project**: Zenith Care Solutions — marketing website
**Updated**: 2026-10-11

This is the "what has been done / what is being done / what is next" log. It's intentionally short and lives at the repo root so a 3–4 day break (or a new teammate) can get up to speed in 60 seconds. **Update at the end of every PR.**

> New session? Also open:
> - [`CLAUDE.md`](CLAUDE.md) — pinned project context
> - [`WebSiteDoc/12-claude-requirements.md`](WebSiteDoc/12-claude-requirements.md) — session playbook
> - [`WebSiteDoc/06-implementation-plan.md`](WebSiteDoc/06-implementation-plan.md) — the full phase plan

---

## Current status

- **Phase**: 1 (Scaffold)
- **In flight**: `feature/global-layout-and-stubs` (not yet pushed — awaiting user to commit + PR)
- **Blocking anything?**: no

---

## Done

### 2026-10-11 — Planning complete
All 10 planning docs under `WebSiteDoc/` committed on `develop`. See [`WebSiteDoc/`](WebSiteDoc/) for the full set.

### 2026-10-11 — Repo scaffolded
Repo layout agreed: Next.js under `web/`, docs at root, `api/` reserved for future backend. `.gitignore`, `.editorconfig`, root `README.md`, git branches set up (`develop` as source of truth).

### 2026-10-11 — PR #1 (merged) — `feature/nextjs-bootstrap`
Commit `200b590`. Bootstrapped Next.js 16 + React 19 + Tailwind 4 under `web/`. Installed project deps (MDX, lucide, clsx, tailwind-merge, cva, @tailwindcss/typography) and shadcn/ui components (button, card, accordion, input, textarea, label, sheet, navigation-menu, alert, sonner, tabs, tooltip). `pnpm build` clean on stock scaffold.

### 2026-10-11 — PR #3 (awaiting push) — `feature/seo-plumbing`
Added `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`, `.well-known/security.txt`, dynamic OG image at `app/opengraph-image.tsx`, security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) in `next.config.ts`. JSON-LD factory helpers in `lib/seo.tsx` for Organization, Service, Person, Article, FAQPage, BreadcrumbList — with a dev-only self-check per Ponytail. Wired Organization LD site-wide via root layout; Service + BreadcrumbList on the CCM services page. Also pinned the standard PR body shape as `.github/PULL_REQUEST_TEMPLATE.md` and rewrote `WebSiteDoc/11-git-workflow.md` §6 accordingly.

### 2026-10-11 — PR #2 (merged) — `feature/global-layout-and-stubs`
Global layout, nav, footer, floating WhatsApp button, 404, and stubs for all 13 marketing + legal routes. Brand color tokens wired into Tailwind 4 `@theme`. Fonts via `next/font` (Inter + Fraunces + JetBrains Mono). `pnpm build` passes with 19 static routes. Env file (`.env.local` gitignored, `.env.example` committed) ready for WhatsApp number + contact email + Calendly URL.

Ponytail review applied before handoff: collapsed the single-item Services dropdown to a direct link; replaced the fake-button dropdown trigger with a focusable `<span>` (keyboard-reachable, no misleading affordance); hid WhatsApp / Calendly CTAs on `/contact` when their env vars are unset; deleted the unused `--font-heading` token.

Dark mode shipped in this PR (reversing an earlier decision to defer): `next-themes` with `attribute="class"`, defaults to OS preference, Sun/Moon toggle in the top nav. Icon swap is pure CSS via Tailwind `dark:` variant — no React state, no hydration dance. Brand palette has a matching `.dark` token block in `app/globals.css`.

---

## In progress

Nothing — PR #2 is ready for you to commit, push, review, and merge.

---

## Up next (ordered)

Pulled from [`WebSiteDoc/06-implementation-plan.md`](WebSiteDoc/06-implementation-plan.md) Phase 1 Days 3–5 and Phase 2.

1. **`feature/content-infra`** — MDX pipeline (`@next/mdx` wired in `next.config.ts`), `content/faq.json` loader + typed read helper, Plausible/Umami script in `layout.tsx`.
2. **`feature/roi-calculator`** — client-side calculator (TDD per Ponytail — ship with assert-based self-check). **Build this BEFORE the real homepage** so the hero's "Estimate your ROI" CTA doesn't send users to a stub (ponytail-review finding on PR #2).
4. **`feature/home-page`** — real homepage (hero, 3-step how-it-works, revenue math, founder credibility strip, final CTA). Invoke `taste-skill` + `impeccable` per [`12-claude-requirements.md`](WebSiteDoc/12-claude-requirements.md).
4. **`feature/services-page`** — long-form `/services/chronic-care-management` with CPT table.
5. **`feature/contact-page`** — WhatsApp + mailto + Formspree form + Calendly inline embed + client-side PHI guard.
6. **`feature/about-page`** — founder bio with PharmD credentials + Person JSON-LD.
7. **`feature/hipaa-compliance-page`** — trust page content.
8. **`feature/who-we-serve-pages`** — specialty-tailored content for primary care, internal medicine, geriatrics.
9. **`feature/faq-page`** — accordion rendering `content/faq.json` + FAQPage JSON-LD. First 15 Q&As authored.
10. **`feature/resources-blog`** — `/resources` index + `[slug]` dynamic route + 3 seed MDX posts.
11. **`feature/legal-pages`** — paste attorney-reviewed copy from [`08-legal-pages-draft.md`](WebSiteDoc/08-legal-pages-draft.md) into the four legal routes.
12. **Phase 4 polish** — Lighthouse ≥ 95 everywhere, axe clean, keyboard + screen reader audit, UptimeRobot, HSTS preload submission (after 30 days clean).
13. **Launch** — [`WebSiteDoc/10-launch-checklist.md`](WebSiteDoc/10-launch-checklist.md).

---

## Decisions log

Short record of non-obvious decisions so we don't re-litigate them.

| Date | Decision | Why |
|---|---|---|
| 2026-10-11 | No backend, no DB, no payments on site. Contracts + payment happen off-site via email, Stripe Invoicing, PayPal, bank transfer. | B2B healthcare sales — $5-figure contracts aren't bought on a webpage. |
| 2026-10-11 | Scripted (button-based) chatbot, deferred to v1.1; v1 ships without a chatbot. | HIPAA safety + simplicity. LLM chatbot is a bigger PHI risk than it's worth at launch. |
| 2026-10-11 | `web/` subfolder, not root; `api/` reserved. No pnpm workspaces yet. | Keeps room for backend without monorepo overhead today. |
| 2026-10-11 | Next 16 / React 19 / Tailwind 4 (not 14 / 3 as docs originally said). | Latest `create-next-app` resolved them. Tailwind 4 moves config into CSS `@theme` — docs will catch up. |
| 2026-10-11 | Hardcode footer year (`© 2026`) with a yearly-bump comment. | Next 16 Cache Components mode refuses `new Date()` during prerender. |
| 2026-10-11 | Dropped `/resources/[slug]` stub for now. | Next 16 Cache Components requires non-empty `generateStaticParams`; add route back when the MDX pipeline + first post exist. |

---

## Open questions / blockers

- [ ] GitHub branch-protection rules not yet applied on `develop` and `release/*` — set in GitHub Settings → Branches per [`11-git-workflow.md`](WebSiteDoc/11-git-workflow.md) §4.
- [ ] No attorney retained yet — needed before Phase 4 so legal pages can go live.
- [ ] Hero photo of Ali in clinical attire — needed for Phase 2 real homepage; placeholder is fine until then.
- [ ] Calendly account not yet confirmed set up with the "15-min CCM discovery" event type.
- [ ] WhatsApp Business number not yet confirmed. The floating WhatsApp button hides itself if `NEXT_PUBLIC_WHATSAPP_NUMBER` is blank, so unset is safe.
- [ ] **Rotate `web/public/.well-known/security.txt` `Expires:` field before 2027-10-11** (RFC 9116 — well-behaved security researchers will treat the domain as having no security contact once the date passes). Add a yearly calendar reminder.
- [ ] Add `web/public/logo.png` — Organization JSON-LD references it. Google Rich Results Test will warn until the file exists.

---

## How to update this file

End every PR with a one-liner under **Done**, dated. Move the next item from **Up next** into **In progress** when you start it. If you make a decision worth not re-litigating, add it to the **Decisions log**. Keep it tight — this is a journal, not a wiki.
