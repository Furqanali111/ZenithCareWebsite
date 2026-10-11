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

- **Phase**: 7 (Final QA — responsive / cross-device / a11y / functionality)
- **In flight**: `feature/final-qa` (awaiting push + PR + merge)
- **Blocking anything?**: no

---

## Done

### 2026-10-11 — PR #19 (awaiting push) — `feature/final-qa`
Final quality-assurance pass: responsive testing across 8 viewports, mobile/tablet layout fixes, accessibility verification, functionality checks. Tested live in the in-app Chromium browser at 320 / 768 / 1024 / 1920 (375 / 390 / 430 inherit the 320 mobile layout; 1366 sits between two verified-clean widths).

**Responsive issues found + fixed (3)**
- **Calendly embed overflowed by 24px at 320px** (`components/calendly-embed.tsx`): the widget hard-coded `minWidth: 320px`, which exceeded the padded column on a 320px screen. Removed the min-width and set `w-full`; the widget is fluid and fills its container. Verified no overflow at 320.
- **ROI calculator (and 8 other grids) overflowed/were fragile at mobile** (`components/roi-calculator.tsx` + 6 page files): grids written as `grid … md:grid-cols-[…]` with no base `grid-cols-1` fall back below `md` to an implicit max-content column that can exceed the container (the ROI number input forced a 289px column in a 222px card → 18px overflow). Added `grid-cols-1` to all bracket-template grids so mobile is an explicit single full-width column; `md:` still overrides on desktop (no desktop change). Numeric `md:grid-cols-N` grids were verified to already render full-width and left alone.
- **Desktop nav overflowed tablet width at 768px** (`components/nav.tsx`): the full nav (logo + 5 items + toggle + CTA) needs ~782px but the `md` breakpoint activated it at 768. Moved the desktop-nav / hamburger breakpoint from `md` to `lg` (1024) so tablets use the hamburger and the full bar appears only where it fits. Verified nav fits + no overflow at 1024.

**Functionality bug found + fixed (pre-existing, surfaced by QA)**
- **`/contact` returned 500 in dev and the PHI guard was broken** (`lib/validate.ts`): a load-time self-check threw because the patient-name regex `/\bpatient\s+[A-Z][a-z]+/` was case-sensitive lowercase and missed "Patient Smith" (capital P) — the realistic case a provider types. Production shipped the gap silently (self-check is NODE_ENV-guarded). Fixed the regex to match "Patient"/"patient" + a capitalized name, with a negative lookahead excluding common B2B phrases (`Care`, `Coordinator`, `Portal`, `Experience`) so legitimate messages ("Patient Care Coordinator", "Patient Portal") aren't blocked from submitting. Added self-check cases to lock both the catch and the exclusions. `/contact` now serves 200; the PHI warning actually works.

**Accessibility verified**
- Color contrast: all key text/background pairs pass WCAG AA (lowest 4.83:1); dark-mode body/heading/accent all ≥6:1. Computed, not estimated.
- Mobile nav: opens on tap, closes on Escape, focus returns to the trigger button, both services + all nav items present.
- `prefers-reduced-motion` rule confirmed in compiled CSS; focus-visible outline (links) + ring (buttons) rules present in CSS.
- Touch targets: nav icon buttons are 32px (passes WCAG 2.2 AA 24px minimum; below the 44px AAA target).

**Checks**: `pnpm lint` clean, `npx tsc --noEmit` clean, `pnpm build` passes (28 routes prerender static), no horizontal overflow at any tested viewport, no real console errors (remaining dev-console noise is HMR websocket + Next 16 PPR `instant`/Suspense warnings on the `◐` dynamic routes, both dev-only and expected).

### 2026-10-11 — PR #18 (awaiting push) — `feature/seo-content-optimization`
SEO + AI-search optimization pass on top of the merged redesign (PRs #16, #17). No design changes, no fabricated claims — every new sentence derives from content already on the page.

**Structured data**
- New `websiteLd()` factory + sitewide `WebSite` JSON-LD (publisher-linked to the Organization node) in `app/layout.tsx`. Gives search + AI engines one canonical site identity. No SearchAction (no on-site search endpoint to honestly claim).
- `organizationLd()` gains a `knowsAbout` list (CCM, Patient Care Coordination, Medicare CCM billing, care-coordination staffing, HIPAA BA services) so engines map the brand to its offering catalogue.
- Fixed a `serviceLd` bug: the Patient Care Coordinator page emitted `serviceType: "Chronic Care Management"` (the helper's default). Now passes `serviceType: "Patient Care Coordination"`. Verified in rendered output.
- New reusable `<FaqSection>` component (`components/faq-section.tsx`): renders a house Accordion + emits `FAQPage` JSON-LD from the same data. Reuses the existing `faqPageLd` factory.

**On-page FAQs (highest AI-answer-engine signal)**
- CCM service page: 6 service-specific Q&As (billing model, eligibility, time requirement, CPT codes, EHR, BAA).
- Patient Care Coordinator page: 5 Q&As (scope, clinical-vs-admin boundary, pricing model, CCM combo, EHR access).
- Each who-we-serve specialty: 3 specialty-specific Q&As (eligibility %, why-it-fits, condition mix) pulled from each specialty's existing CONTENT.
- All service FAQs are DISTINCT from the general `/faq` corpus (15 Q), so no two URLs emit the same FAQPage (Google duplicate-FAQ guidance). Verified counts: CCM 6, PCC 5, each specialty 3, /faq 15.

**Metadata**
- Homepage `<title>` was `Zenith Care Solutions — Remote Chronic Care Management | Zenith Care Solutions` (78 chars, brand twice). Now `Chronic Care Management & Care Coordination` → pageMetadata appends the brand once (keyword-first, ~67 chars).
- Contact `<title>` was `Contact Zenith Care Solutions | Zenith Care Solutions` (double brand) → now just `Contact`.
- Tightened over-length meta descriptions: homepage (205→151 chars), CCM (184→159), PCC (212→159), primary-care (168→154). All now inside Google's ~160-char display window.

**Internal linking**
- CCM service page now links down to all three who-we-serve specialty pages with descriptive anchors ("primary care", "internal medicine", "geriatric"), completing the topic cluster (home → services → specialties → back to CCM).

**Technical SEO** — already strong from prior phases; verified unchanged and correct: robots.txt allows all crawlers incl. AI bots, sitemap enumerates every route (both services + 3 specialties + posts), every page has a canonical + OG + Twitter card, llms.txt lists both services. No new crawler rules added (per the brief: no arbitrary AI-crawler restrictions).

**Validation** — `pnpm lint` + `pnpm build` clean; 28 routes prerender static. Rendered JSON-LD validated in-browser on `/`, both service pages, a specialty page, and `/faq`: all parse, correct `@type`s, correct `serviceType`, correct FAQ counts. FAQ accordion renders + expands in dark mode.

### 2026-10-11 — PR #16 (awaiting push) — `feature/redesign-overhaul`
Visual overhaul across the whole marketing surface. Preserved: URLs, CPT math, legal content, forms, env guards, SEO/JSON-LD, Calendly, Formspree, Plausible, HIPAA language, founder bio, business facts. Changed: the design system, the hero rhythm, and the service offering.

**Design system refresh.** Dropped `Fraunces` (taste-skill flags it as the AI-default display serif) for `Plus Jakarta Sans` mapped onto the existing `--font-serif` token — zero markup changes to pick up the new face across 15 pages. Base radius bumped `0.5rem → 0.75rem` (softer modern-clinical feel; buttons/cards/pills scale through the existing `--radius-*` multipliers). New tokens: `--color-brand-50/100/800`, `--color-gold-100`, `--color-surface-100`, `--color-ink-700/400`, `--color-border-100`, `--section-py[/-lg/-hero/-hero-lg]`. New utilities: `.section-rhythm` (one source of truth for section vertical padding), `.bg-dotgrid` (honest clinical dot-grid for hero backgrounds, no gradient-slop). Global `prefers-reduced-motion` suppressor added at `@layer base`.

**New service: Patient Care Coordinator.** Second service line under `/services/patient-care-coordinator` with its own hero + trust strip + weekly-workflow cards (before-visit / during-and-after) + division-of-labor + why-Zenith + good-fit list + HIPAA callout + final CTA. Added to `nav.services`, so the Nav "Services" slot auto-promotes from a direct link to a hover-reveal menu with both CCM and PCC. Sitemap entry + `llms.txt` entry both added.

**Shared components.** `<TrustStrip tone>` — 4-column credibility row (HIPAA BA / PharmD-led / Inside your EHR / CMS-aligned billing) used under every hero. `<HeroEyebrow>` — small uppercase pill with a gold dot, enforced-sparingly per taste-skill's eyebrow count rule (max `ceil(sections / 3)` per page).

**Nav + Footer.** Nav height bumped 64 → 72px, inline Z-monogram glyph next to the wordmark, dropdowns re-styled with brand-50 hover state. Footer gains the same monogram, a wrapping micro-trust row (HIPAA BA / PharmD-led / Inside your EHR), and a cleaner 12-col layout.

**Homepage overhaul.** Centered hero → asymmetric split: left column has copy + CTAs, right column is a legitimate "data card" visual showing representative monthly revenue + three CPT stat pills — real data, not a fake product screenshot. Trust strip under hero. New "Two remote-staffing programs" services preview grid (CCM + PCC cards). Kept How-it-works (3-step), Representative-revenue navy band, Founder credibility strip, Final CTA. The navy band now shows the Complex-CCM ceiling ($15,800/mo at 20% complex mix) so it teaches a second thing instead of restating the hero's base figure.

**CCM + Who-we-serve pages.** New hero rhythm (dot-grid background + `<HeroEyebrow>`), trust strip under hero, h-11 CTAs. Dropped 3 of 4 inline eyebrow spans on the CCM page to pass taste-skill's eyebrow count check (6 sections, max 2 eyebrows total).

**Dark mode polish.** Added `dark:` overrides to the three places that use the fixed-light `--color-brand-50` chip (TrustStrip icon squares, HeroEyebrow pill, homepage ServiceCard icon squares) so they don't glare on the navy dark-mode background.

Ponytail-review fixes applied before handoff:
- **(critical)** The repo's `.gitignore` had `*patient*` as a HIPAA safety net, which silently excluded the new `web/app/services/patient-care-coordinator/page.tsx` from git. Local build worked because the file was on disk; a push would have landed the branch with the whole route missing (sitemap + nav → 404s). Narrowed the pattern to data-file extensions (`*patient*.pdf`, `*.csv`, `*.xlsx`, `*.json`) so the HIPAA intent stays but product-term source paths commit. Applied the same narrowing to `*phi*`.
- Added `/services/patient-care-coordinator` to the `llms.txt` route handler's Core-pages block so AI crawlers see the new service (the handler's HEADER is hand-maintained; worth replacing with a `nav.services` derivation later).
- Shortened the homepage H1 from 18 words to 11 ("Remote clinical staff for the work you can bill, but can't staff.") and dropped the hero font scale from `md:text-[3.5rem]` to `md:text-5xl lg:text-[3.25rem]` so the headline fits two lines on desktop at taste-skill §4.7's cap.
- Rewrote the navy "Representative revenue" band to show the Complex-CCM ceiling figure instead of restating the hero card's base figure — teaches base-vs-complex instead of duplicating a number. Figure derived from `CPT_RATES` so the lib/roi.ts single-source rule holds.

### 2026-10-11 — Planning complete
All 10 planning docs under `WebSiteDoc/` committed on `develop`. See [`WebSiteDoc/`](WebSiteDoc/) for the full set.

### 2026-10-11 — Repo scaffolded
Repo layout agreed: Next.js under `web/`, docs at root, `api/` reserved for future backend. `.gitignore`, `.editorconfig`, root `README.md`, git branches set up (`develop` as source of truth).

### 2026-10-11 — PR #1 (merged) — `feature/nextjs-bootstrap`
Commit `200b590`. Bootstrapped Next.js 16 + React 19 + Tailwind 4 under `web/`. Installed project deps (MDX, lucide, clsx, tailwind-merge, cva, @tailwindcss/typography) and shadcn/ui components (button, card, accordion, input, textarea, label, sheet, navigation-menu, alert, sonner, tabs, tooltip). `pnpm build` clean on stock scaffold.

### 2026-10-11 — PR #15 (awaiting push) — `feature/pre-launch-polish`
Static code-side audit for Phase 4 readiness. Scope: everything measurable from source without touching a browser. Confirmed: 11 route pages + 4 inherited via `LegalPage` each render exactly one `<h1>`; every page.tsx (16 files) exports `metadata`; `JsonLd` emitted on all 14 public routes; no `console.log/debug/info/warn` left anywhere; no raw `<img>` tags (FounderMonogram uses `role="img"` + `aria-label`); forms use `Label htmlFor` association pattern throughout; sitemap enumerates every route including the three posts; robots.txt allows all AI crawlers; security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) already in place via `next.config.ts`.

Two concrete fixes shipped: promoted `llms.txt` from a static file in `public/` to a route handler at `web/app/llms.txt/route.ts` that reads the three posts (and any future posts) from the `content/posts.ts` registry — one source of truth, no manual two-file edit per new post; deleted `web/components/page-stub.tsx` which had zero importers after all its usages migrated to real content in PRs #7–#14.

Ponytail-review fix applied before handoff: the review flagged `llms.txt` being hand-maintained as a near-duplicate of the posts registry that will drift. Promoted to a route handler now instead of waiting for the "~10 posts" trigger — net ~15 lines added but kills a maintenance liability permanently. Route output confirmed as `○ Static` in build (prerenders alongside `/robots.txt` and `/sitemap.xml`).

### 2026-10-11 — PR #14 (merged) — `feature/legal-pages`
`/privacy`, `/terms`, `/accessibility` all ship with real content. Content pastes from `WebSiteDoc/08-legal-pages-draft.md` §1 (Privacy), §2 (Terms), §4 (Accessibility) with every placeholder resolved: dates = 2026-10-11, contact = `site.email` (same role-alias shortcut as hipaa-statement), governing law + venue = Wyoming, retention period = 3 years, analytics vendor = Plausible, address = "Wyoming, USA" (full mailing available on request). All four legal routes now have real text; next time an attorney reviews it&rsquo;s a copy edit, not a rewrite from a stub.

Ponytail-review fixes applied before handoff: extracted a shared `<LegalPage title lastUpdated effectiveDate?>` component in `web/components/legal-page.tsx` and refactored all four legal pages (privacy, terms, accessibility, and the previously-shipped hipaa-statement) to use it — one place to tune the eyebrow, Fraunces H1, date-line format, and the long `prose prose-neutral …` className wall; added a sixth bullet to the Privacy state-rights list ("Other U.S. states — residents of states with comprehensive consumer privacy laws, including CT, UT, TX, MT, IA, OR, DE, NJ, and others …") so the page doesn&rsquo;t read as frozen at the 2023-era CCPA/VCDPA/CPA snapshot.

### 2026-10-11 — PR #13 (merged) — `feature/resources-blog`
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

`feature/redesign-overhaul` — code done, build + lint clean, ponytail-review pass applied. Awaiting commit + push + PR + merge. After this merges, remaining work is the OPERATIONAL side of Phase 4 (actual Lighthouse / axe / keyboard / screen-reader runs against the Vercel preview, UptimeRobot setup, HSTS preload submission) + launch per [`WebSiteDoc/10-launch-checklist.md`](WebSiteDoc/10-launch-checklist.md). PR #15 (`feature/pre-launch-polish`) merged earlier today on `develop`.

---

## Up next (ordered)

Pulled from [`WebSiteDoc/06-implementation-plan.md`](WebSiteDoc/06-implementation-plan.md) Phase 1 Days 3–5 and Phase 2.

1. **Phase 4 polish** — Lighthouse ≥ 95 everywhere, axe clean, keyboard + screen reader audit, UptimeRobot, HSTS preload submission (after 30 days clean).
2. **Launch** — [`WebSiteDoc/10-launch-checklist.md`](WebSiteDoc/10-launch-checklist.md).

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
