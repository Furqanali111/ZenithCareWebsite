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

- **Phase**: 2 (Core pages)
- **In flight**: `feature/resources-blog` (awaiting push + PR + merge)
- **Blocking anything?**: no

---

## Done

### 2026-10-11 — Planning complete
All 10 planning docs under `WebSiteDoc/` committed on `develop`. See [`WebSiteDoc/`](WebSiteDoc/) for the full set.

### 2026-10-11 — Repo scaffolded
Repo layout agreed: Next.js under `web/`, docs at root, `api/` reserved for future backend. `.gitignore`, `.editorconfig`, root `README.md`, git branches set up (`develop` as source of truth).

### 2026-10-11 — PR #1 (merged) — `feature/nextjs-bootstrap`
Commit `200b590`. Bootstrapped Next.js 16 + React 19 + Tailwind 4 under `web/`. Installed project deps (MDX, lucide, clsx, tailwind-merge, cva, @tailwindcss/typography) and shadcn/ui components (button, card, accordion, input, textarea, label, sheet, navigation-menu, alert, sonner, tabs, tooltip). `pnpm build` clean on stock scaffold.

### 2026-10-11 — PR #13 (awaiting push) — `feature/resources-blog`
Resources blog ships end-to-end: three real MDX posts (`cpt-99490-2026`, `in-house-vs-outsourced-ccm`, `hipaa-checklist-outsourced-ccm`), `/resources` index listing by date, `/resources/[slug]` dynamic route rendering each post with Article + Breadcrumb JSON-LD, author-bio strip reusing the `FounderMonogram` component, related-articles section, final CTA band. Sitemap now enumerates every post URL.

Technical approach that avoids the Next 16 Cache Components dynamic-route trap documented in `13-deferred-items.md` §6 (now removed since this PR solves it): a static `content/posts.ts` registry statically imports each `.mdx` file with its `export const frontmatter` ESM metadata, so `generateStaticParams` iterates known slugs at build time with no `fs.readdirSync` indirection and no empty-params moment. Added `web/types/mdx.d.ts` module declaration so TypeScript sees the named `frontmatter` export alongside the default React component (not covered by stock `@types/mdx`). All three post routes prerender as static (`○`).

Ponytail-review fixes applied before handoff: removed the dev-only `NODE_ENV !== "production"` guard on the posts-registry self-check so bad frontmatter actually fails the build (same bug the FAQ loader shipped with in PR #4 before its review); promoted founder identity to `lib/site.ts` as `founder = { name, initials, aboutUrl }` and swapped three hardcoded "Ali Hassan Kaleem, PharmD" / "AHK" call-sites (home / about / blog detail) to import from one source; replaced the arbitrary-variant `[&_h2]:…` className wall on the post detail page with `prose prose-neutral` + four brand-override selectors, matching the existing hipaa-statement pattern — also wired `@plugin "@tailwindcss/typography"` in `app/globals.css` since Tailwind 4 needs the CSS-side `@plugin` directive (installing the npm package alone wasn't enough). Also logged post hero images as a deferred asset slot in `13-deferred-items.md` for future rich-card image eligibility.

### 2026-10-11 — PR #12 (merged) — `feature/faq-page`
Real `/faq` ships. Authored 15 Q&As in `content/faq.json` grouped across the five existing categories (Basics 3, Billing 4, Compliance 3, Working With Us 3, Pricing 2) — each answer self-contained in the 50–200-word range so AI assistants can excerpt without surrounding context (per the AI-SEO plan). Page groups by category with H2 headings, renders each cluster inside a shadcn Accordion (`type="multiple"` — collapsed by default, user can expand multiple at once; the FAQPage JSON-LD ships the full answer corpus regardless of DOM state, which is what Google and AI crawlers actually read). Emits `FAQPage` + `BreadcrumbList` JSON-LD. The `getAllFaqs` / `getFaqsByCategory` / `getFaqCategories` helpers from `lib/faq.ts` light up with real content; build-time validation (duplicate id, empty question/answer) ran against all 15 and passed. No new deps.

Ponytail-review fixes applied before handoff: rewrote the `revenue-share-vs-per-patient` answer to remove a legal characterisation ("legal grey zone under the Anti-Kickback Statute") that put a specific regulatory claim in Zenith's voice — the Terms of Service posture is "not legal advice", so legal-sounding assertions on the FAQ were in conflict; the new copy keeps the differentiation ("predictable per-patient rate vs percentage of collections") without the legal framing. Also softened the onboarding timeline from a hard "2–4 weeks" plan with a per-week breakdown to a "3–6 weeks, scaled to panel size and EHR complexity" range with early / mid / launch phases — removes a trust-breaking SLA for the first-client onboarding where every workflow is new.

### 2026-10-11 — PR #11 (merged) — `feature/who-we-serve-pages`
Three specialty pages — `/who-we-serve/primary-care`, `/who-we-serve/internal-medicine`, `/who-we-serve/geriatrics` — ship with tailored copy. Still one dynamic route (`[specialty]/page.tsx`) with existing `generateStaticParams`; content comes from a per-specialty `SPECIALTY_CONTENT` map inside the file. Shape per page: hero → "why CCM here" + typical patient mix (two-column) → representative-revenue card (brand-navy, hero-sized number computed from the shared `CPT_RATES["99490"]` × panel × enrollment-rate, so a CMS reprice updates all three) → CTA band. Each page emits `Service` + `BreadcrumbList` JSON-LD via the existing `lib/seo.tsx` factories.

Content calibrated to the three audiences: primary care emphasises the broadest condition mix and large unenrolled-eligible panels; internal medicine leads on polychronic patients and the Complex-CCM code share; geriatrics leads on near-universal Medicare + chronic-condition density and the fact a substantial portion qualifies for Complex CCM. Caught and fixed a `&rsquo;` entity-in-JS-string bug in three places before build — same shape as the services-page bug from PR #7; the entities only interpret inside JSX, not inside array string literals.

Ponytail-review fixes applied before handoff: resized each specialty's example panel so the three hero revenue numbers are visibly distinct instead of collapsing to the same hundred-dollar bucket (primary 1500 × 30% → $29,700; internal 650 × 50% → $21,450; geriatric 500 × 70% → $23,100, with the specialty note explaining the Complex-CCM lift that makes real geriatric revenue the highest in practice); moved the generic Complex-CCM caveat into the shared revenue template so each specialty note now only adds specialty-specific colour (geriatric is the only one with a note after the refactor).

### 2026-10-11 — PR #10 (merged) — `feature/hipaa-compliance-page`
Real `/hipaa-compliance` ships. Five sections: hero → "zero PHI on this site" callout with ShieldCheck icon + two trust cards (BAA before any PHI, EHR stays system of record) → three safeguard cards mirroring the HIPAA Security Rule categories (Administrative / Physical / Technical) with specific items under each → side-by-side Minimum Necessary + Breach Notification paragraph pair → CTA card that links out to the formal `/hipaa-statement`. `BreadcrumbList` JSON-LD only (no Service LD — this is a trust posture, not a service). Reuses `BulletedListItem` for every bullet list; two co-located one-caller helpers (TrustCard, SafeguardCard).

Pulled the formal HIPAA Statement forward and shipped it on `/hipaa-statement` in the same PR (previously planned for `feature/legal-pages`), so the "Read the formal statement" CTA on the compliance page no longer lands on a stub. Content pastes from `WebSiteDoc/08-legal-pages-draft.md §3` with placeholders resolved: `LAST_UPDATED` = 2026-10-11, contact email = `site.email` (role aliases like `compliance@` to be swapped in once set up per `WebSiteDoc/14-go-live-accounts.md §2.4`), full mailing address noted on request only.

Ponytail-review fixes applied before handoff: softened the safeguards section intro so the Administrative / Physical / Technical bullets read as framework + process ("implementation specifics — written policies, device inventory, audit-log samples, workforce training records — are shared during BAA review on request") instead of absolute present-tense attestations that would create a HIPAA misrepresentation risk pre-first-client; relaxed the BAA-send SLA from one business day to two to account for the Pakistan↔U.S. time-zone math.

### 2026-10-11 — PR #9 (merged) — `feature/about-page`
Real `/about` ships. Five sections: hero with the AHK monogram + name + lead → three credential cards (Education / Specialty / Industry) → "Why Zenith exists" narrative (3 paragraphs) → "What this means for your practice" four-item bullet grid → CTA. `Person` + `Breadcrumb` JSON-LD via existing factories, including `hasCredential` (PharmD) and `knowsAbout` (CCM, clinical pharmacy, oncology, BMT, MTM, Medicare billing). Promoted the `FounderMonogram` component out of `app/page.tsx` into `components/founder-monogram.tsx` (second caller is a real use case per the ponytail rule); supports `size="md" | "lg"` so the About hero gets a larger badge than the home strip. Homepage updated to import from the new location.

Ponytail-review fixes applied before handoff: `FOUNDER_LINKEDIN` now defaults to empty and both call-sites (Person JSON-LD `sameAs` and the "Ali on LinkedIn" CTA) suppress themselves when blank — same guard pattern as the WhatsApp button, so neither Google nor a visitor hits a 404 until the real URL is confirmed; swapped the too-specific `knowsAbout: "Medicare CPT 99490"` for `"Medicare Billing"` which is the kind of topic string schema.org expects.

### 2026-10-11 — PR #8 (merged) — `feature/contact-page`
Full `/contact` ships. Three-door hero (WhatsApp / Email / Calendly jump-link, each hidden when its env is unset — same pattern as the floating WhatsApp button) → Formspree fallback form on a surface-50 band → inline Calendly embed below. Client-side PHI guard in `web/lib/validate.ts` scans the message field for SSN / MRN / DOB / "Patient &lt;Name&gt;" patterns and blocks the submit with an inline error naming what it caught; dev-only self-check throws on four positive + three negative cases. Form includes "do not submit patient information" disclaimer wired via `aria-describedby` on both the hint banner and the message textarea. CSP in `next.config.ts` opened to `assets.calendly.com` (script), `calendly.com` (frame + connect), `*.calendly.com` (img), and `formspree.io` (connect + form-action). Form hides entirely when `NEXT_PUBLIC_FORMSPREE_ID` is unset so a dead endpoint can&rsquo;t POST to "".

Ponytail-review fixes applied before handoff: dropped `noValidate` from the form so HTML5 `required` / `minLength` actually enforce before our fetch handler runs (otherwise blank submits bounce off Formspree as a generic 422 instead of focusing the empty field); narrowed the DOB regex to require a nearby trigger word (`dob` / `born` / `birth…`) so a provider mentioning "onboard by 03/15/2027" isn&rsquo;t blocked as a patient date of birth; stored the PHI pattern on component state directly instead of re-running `findPhi` on the sample string in `humanisePhi`; removed the dead `where: "message"` discriminant from the Status union.

### 2026-10-11 — PR #7 (merged) — `feature/services-page`
Long-form `/services/chronic-care-management` ships. Six sections: hero → CCM primer with eligibility criteria → six-row CPT code table (99490, 99439, 99487, 99489, 99491, 99437) with 2026 rate estimates → division-of-labor two-column strip (Zenith delivers / your practice keeps) → HIPAA Business Associate callout with link to `/hipaa-compliance` → final CTA band. Hand-rolled accessible `<table>` with `scope="col"` headers, `caption` for AT users, mono CPT numbers in brand-700. Links out to CMS Physician Fee Schedule as the authoritative source (E-E-A-T signal). Reuses existing `serviceLd` + `breadcrumbLd` factories.

Ponytail-review fixes applied before handoff: hoisted CPT rates to a single `CPT_RATES` map in `lib/roi.ts` (with `ANCHOR_PATIENTS` + `ANCHOR_MONTHLY` constants) so the services-page table, the ROI calculator, and the homepage revenue card all read from one source — next time CMS reprices, one file to edit; promoted `BulletedListItem` to `components/bulleted-list.tsx` so the eligibility list, division-of-labor columns, and future FAQ / who-we-serve bullets share the same markup; rewrote the "20+ minutes per enrolled patient" bullet to describe the actual work (meds, symptoms, follow-up, barriers to care) instead of anchoring the reader to the CMS billing floor.

### 2026-10-11 — PR #6 (merged) — `feature/home-page`
Real homepage shipped. Five sections: hero (centered stack, Fraunces display headline, single gold hairline accent under "Chronic Care Management", two CTAs), "How it works" (3 numbered steps on a surface-50 band), revenue math card (brand-navy surface, hero-sized $13,200 with mono CPT 99490 reference and a CTA to `/roi-calculator`), founder credibility strip (AHK monogram placeholder that swaps to a real `<Image>` when the portrait lands, per the dangling-reference rule), final CTA band. Service JSON-LD on the page via existing `serviceLd()` factory. Rejected the taste-skill's agency-flash defaults (OLED vibes, bento, scroll motion) — wrong audience for a 55-y-old practice manager at a desktop; kept generous whitespace, eyebrow pills, nested hero-number weight, and subtle `cubic-bezier` CTA transitions.

Ponytail-review fixes applied before handoff: rewrote the H1 as a clean declarative sentence ("Capture the recurring Medicare revenue your practice may be leaving on the table — through Chronic Care Management.") so it stops reading as a noun fragment; dropped `whitespace-nowrap` on the gold-underlined span so iPhone-SE visitors don't get horizontal scroll; aligned the FounderMonogram `aria-label` to the sighted experience ("Ali Hassan Kaleem, PharmD") so AT users aren't told they're seeing a "placeholder".

### 2026-10-11 — PR #5 (merged) — `feature/roi-calculator`
Client-side CCM revenue estimator at `/roi-calculator`. Two inputs (eligible Medicare patients + expected enrollment %), two stat tiles (monthly + annual reimbursement, each shown as a ±10% band so no number pretends to be exact). Math lives in `web/lib/roi.ts` as pure functions with a server-only dev self-check that throws when the 200-patient-100% anchor drifts from $13,200/mo. Added shadcn `slider` component. `Service` + `BreadcrumbList` JSON-LD on the page. Nothing stored, no network, no cookies. The homepage hero's "Estimate your ROI" CTA now resolves to a real page.

Ponytail-review fixes applied before handoff: removed the arbitrary 1,000-patient cap that silently halved reimbursement for larger panels; deleted the now-unused `clamp` helper; removed the unreachable `?? DEFAULT_ENROLLMENT_PCT` fallback on the Slider's `onValueChange`; dropped the duplicate `aria-label` from the Slider (the live Label text with the current % wins); added "(±10% band)" to both stat-tile captions so the range isn't unexplained.

### 2026-10-11 — PR #4 (merged) — `feature/content-infra`
Wired MDX via `@next/mdx` + `mdx-components.tsx` + `pageExtensions: ['ts','tsx','md','mdx']` in `next.config.ts`. Added typed FAQ loader at `lib/faq.ts` with build-time duplicate-id and empty-field validation that throws loudly in both dev and prod; current `content/faq.json` is still `{ items: [] }` — real Q&As ship with the FAQ page PR. Added optional Plausible script to the root layout with defence-in-depth gating (`NODE_ENV === "production"` AND `VERCEL_ENV` is undefined-or-"production" AND domain env is set); `plausible.io` allowlisted in CSP. New devDep: `@types/mdx`.

Also introduced `WebSiteDoc/13-deferred-items.md` as the single catalog of dangling references (missing assets, empty content, unset env vars, setup to-dos, time-based reminders, future-PR traps) — plus pinned the "never remove a dangling reference, add it to that doc instead" rule in `CLAUDE.md` and `12-claude-requirements.md` §3.9. The `PROGRESS.md` "Open questions" section now links to that doc instead of duplicating the list.

### 2026-10-11 — PR #3 (merged) — `feature/seo-plumbing`
Added `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`, `.well-known/security.txt`, dynamic OG image at `app/opengraph-image.tsx`, security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) in `next.config.ts`. JSON-LD factory helpers in `lib/seo.tsx` for Organization, Service, Person, Article, FAQPage, BreadcrumbList — with a dev-only self-check per Ponytail. Wired Organization LD site-wide via root layout; Service + BreadcrumbList on the CCM services page. Also pinned the standard PR body shape as `.github/PULL_REQUEST_TEMPLATE.md` and rewrote `WebSiteDoc/11-git-workflow.md` §6 accordingly.

### 2026-10-11 — PR #2 (merged) — `feature/global-layout-and-stubs`
Global layout, nav, footer, floating WhatsApp button, 404, and stubs for all 13 marketing + legal routes. Brand color tokens wired into Tailwind 4 `@theme`. Fonts via `next/font` (Inter + Fraunces + JetBrains Mono). `pnpm build` passes with 19 static routes. Env file (`.env.local` gitignored, `.env.example` committed) ready for WhatsApp number + contact email + Calendly URL.

Ponytail review applied before handoff: collapsed the single-item Services dropdown to a direct link; replaced the fake-button dropdown trigger with a focusable `<span>` (keyboard-reachable, no misleading affordance); hid WhatsApp / Calendly CTAs on `/contact` when their env vars are unset; deleted the unused `--font-heading` token.

Dark mode shipped in this PR (reversing an earlier decision to defer): `next-themes` with `attribute="class"`, defaults to OS preference, Sun/Moon toggle in the top nav. Icon swap is pure CSS via Tailwind `dark:` variant — no React state, no hydration dance. Brand palette has a matching `.dark` token block in `app/globals.css`.

---

## In progress

`feature/resources-blog` — code done, build + lint clean. Awaiting ponytail-review pass, then commit + push + PR + merge.

---

## Up next (ordered)

Pulled from [`WebSiteDoc/06-implementation-plan.md`](WebSiteDoc/06-implementation-plan.md) Phase 1 Days 3–5 and Phase 2.

1. **`feature/legal-pages`** — Privacy / Terms / Accessibility (HIPAA Statement already shipped in PR #10). Paste attorney-reviewed copy from [`08-legal-pages-draft.md`](WebSiteDoc/08-legal-pages-draft.md).
2. **Phase 4 polish** — Lighthouse ≥ 95 everywhere, axe clean, keyboard + screen reader audit, UptimeRobot, HSTS preload submission (after 30 days clean).
3. **Launch** — [`WebSiteDoc/10-launch-checklist.md`](WebSiteDoc/10-launch-checklist.md).

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

The full catalog of placeholders, missing assets, env vars that need production values, external accounts to set up, time-based reminders, and known traps lives in [`WebSiteDoc/13-deferred-items.md`](WebSiteDoc/13-deferred-items.md). Check that first before asking "is X ready to fill in?"

The step-by-step runbook for creating each external account and wiring it to Vercel (sign-up URLs, which env var it maps to, which Vercel scope to use, DNS steps for the custom domain, launch-day smoke tests, troubleshooting table) lives in [`WebSiteDoc/14-go-live-accounts.md`](WebSiteDoc/14-go-live-accounts.md).

Session-level blockers only — things that actively prevent the next PR from being merged — go here. Currently: none.

---

## How to update this file

End every PR with a one-liner under **Done**, dated. Move the next item from **Up next** into **In progress** when you start it. If you make a decision worth not re-litigating, add it to the **Decisions log**. Keep it tight — this is a journal, not a wiki.
