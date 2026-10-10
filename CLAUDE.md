# Zenith Care Solutions — Project Context

Pinned context for every session in this repo. Read first.

> **Before you touch any code**, also read [`WebSiteDoc/12-claude-requirements.md`](WebSiteDoc/12-claude-requirements.md) — it tells you which planning doc to open for the task at hand, which skills (`taste-skill`, `impeccable`, etc.) are mandatory for which kind of work, and the hard rules to enforce (git flow, HIPAA, HTTPS, accessibility, SEO).

## The business

- **Brand**: Zenith Care Solutions (working name; also considering Zenith Health Partners)
- **Founder**: Ali Hassan Kaleem, PharmD (clinical oncology / BMT background)
- **Operating from**: Pakistan → serving U.S. providers
- **Legal entity (planned)**: Wyoming single-member LLC
- **Service**: Chronic Care Management (CCM) for U.S. primary care, internal medicine, geriatrics
- **Business model**: Subcontracted clinical staff provider. Zenith does NOT bill Medicare. The physician practice bills CMS using CPT 99490 / 99439 / 99487 / 99489 / 99491 / 99437 "incident to" supervision; the practice pays Zenith for care-coordination labor.
- **Pitch math**: 200-patient CCM panel ≈ $13.2K/month Medicare reimbursement for the practice at base code.
- **Expansion lane** (post-CCM): medical billing, provider credentialing, medical coding, AR follow-up — reuse same brand/domain.

## Target audience for the website

- U.S. primary care, internal medicine, geriatric physicians and practice managers
- States to prioritize: FL, TX, AZ, CA (high Medicare Advantage penetration)
- Decision-makers: often the practice manager / office manager, not the MD directly
- Reading on desktop at a clinic; booking a 15-min call is the primary conversion

## Website scope — what it IS and ISN'T

- IS: a B2B marketing + lead-gen + light client-ops site. Primary conversion = booked discovery call. Secondary = qualified `/get-started` form. Tertiary = chatbot-answered FAQ deflection.
- IS NOT: a patient portal, a CCM software platform, or an EHR. **Zero PHI is collected on the site, in the chatbot, or in any form.**
- Forms collect only provider contact info (name, practice, NPI, EHR, state, panel size). Explicit "do not submit patient information" disclaimer on every form AND above the chatbot input.
- All patient data stays inside the client practice's EHR / CCM platform.

## Page map (v1)

Marketing: `/`, `/services/chronic-care-management`, `/who-we-serve/{primary-care,internal-medicine,geriatrics}`, `/roi-calculator`, `/hipaa-compliance`, `/about`, `/resources` (blog), `/faq`
Conversion: `/contact` (WhatsApp + mailto + Formspree form + Calendly embed)
Legal: `/privacy`, `/terms`, `/hipaa-statement`, `/accessibility`
Global: floating scripted-chatbot widget, footer with disclaimers

Dropped from v1: `/pay`, `/get-started`, LLM chatbot, Resend/API routes. All contracting + payment happens off-site.

## Future service lines (same site, no rebrand)

Planned expansion under the Zenith brand: medical billing, provider credentialing, medical coding, AR follow-up, website development, chatbot development, customer care / BPO. Each ships as another `/services/*` MDX page + blog cluster. No architectural change needed — Next.js on Vercel scales to a 100-page multi-service agency site. **Client-facing products Zenith builds and sells live in their own repos, never in this one.**

## Backend ladder (climb only when needed)

Default = Next.js API routes on Vercel. Add in this order, only when a real feature demands it:
1. **Supabase** (Postgres + Auth + Storage + Realtime) — lead dashboard, client login area, chatbot transcripts, file uploads
2. **Vercel Cron** — scheduled jobs (digests, reports)
3. **Stripe Checkout / Payment Links** — for productized services with a fixed SKU (one-time audit, onboarding fee)
4. **Inngest** or **Trigger.dev** — long-running / background jobs beyond serverless limits
5. **Dedicated service** (Fly.io / Railway / AWS) — only for self-hosted LLMs, GPU work, or heavy video. Not expected before significant scale.

Hard rule: **never store client PHI or client production data in this repo.** Each healthcare client gets its own isolated environment under its own BAA scope.

## Tech stack (decided — v1 is a fully static site)

- **Framework**: Next.js 14 App Router, static-friendly (SSG). Keep SSR option open for future, but v1 can `output: 'export'` if we want pure static.
- **Styling**: Tailwind CSS + shadcn/ui
- **Content**: MDX for blog/resources + plain JSON for chatbot script
- **Hosting**: Vercel (free tier)
- **Backend**: **NONE.** No API routes, no database, no server-side secrets at launch.
- **Booking**: Calendly embed (off-site)
- **Contracts**: email + e-sign (Dropbox Sign free tier or signed PDF). Off-site.
- **Payments**: Stripe Invoicing / PayPal / bank transfer. Sent per-client via email. Off-site. No `/pay` page on the site.
- **Chatbot**: **scripted decision tree**, not an LLM. `chatbot.json` + ~100-line React component. User clicks pre-defined options; bot replies with pre-written answers. Zero API calls, zero cost, zero HIPAA risk. LLM-powered upgrade deferred to v2 — same content corpus will be reusable.
- **Contact**: three doors — WhatsApp link (`wa.me/<number>` with prefilled message), `mailto:` link, Formspree free-tier fallback form (50 submissions/mo). No API route needed.
- **Analytics**: Plausible or Umami (cookieless)
- **Error monitoring**: Sentry free tier (optional)

Rejected: WordPress, Wix/Squarespace, separate backend, Stripe Checkout, Resend API route, LLM chatbot (deferred to v2), Chatbase/Crisp.

## Compliance posture

- Site itself: **not** a HIPAA "covered entity" surface because no PHI is collected. Still ship a HIPAA Statement page describing operational posture (BAA with every client, encrypted comms, trained staff, no PHI stored off-platform).
- Business ops: HIPAA Business Associate. Sign a BAA with each client practice before touching patient data. Use HHS sample BAA template; attorney review once.
- Legal pages required: Privacy Policy, Terms of Service, HIPAA Statement, Accessibility Statement (WCAG 2.1 AA — healthcare sites get sued), Cookie notice if any trackers.
- State notices: add CCPA (California), VCDPA (Virginia), CPA (Colorado) blurbs in the Privacy Policy.
- Claims hygiene: all revenue examples qualified ("typical", "representative", "actual results vary"). Attribution of "we do not bill Medicare" on the compliance page.

## Key references in this repo

- `Doc/Zenith_CCM_Launch_Roadmap (1).pdf` — master strategy doc (business model, formation, outreach)
- `Doc/Proposal For Single member LLC - Mr. Ali Hassan.pdf` — LLC formation proposal
- `Doc/Scounts_Professional_Payment_Approval_Website_Guide-1.pdf` — unrelated reference from another project

## Working style

- Ponytail mode / lazy senior dev: smallest change that fully works. No premature abstraction.
- Reuse installed deps and existing components before adding anything new.

## Git workflow — HARD RULES

Full details: `WebSiteDoc/11-git-workflow.md`. Core rules every session must follow:

- `develop` is the source of truth. **Never push to `develop` directly.** Every change goes through a PR.
- `release/vX.Y.Z` branches are cut from `develop` and deployed to production from there.
- Branch naming: `feature/<short-title>` for features, `defect/<short-title>` for bugs, `hotfix/<short-title>` for urgent production fixes cut from the latest `release/*`.
- All lowercase, kebab-case, descriptive, ≤ 50 chars after prefix.
- Rebase onto latest `develop` before opening a PR (never merge `develop` into a feature branch).
- Squash-merge only — linear history on `develop`.
- Conventional Commits for messages: `feat(scope): …`, `fix(scope): …`, `docs(scope): …`, etc.
- No force-push on shared branches. No direct push to `develop` or any `release/*` under any circumstance, including admin.
- No merge of your own PR without at least one approval.
- Hotfixes must be back-ported to `develop` via a second PR so the next release doesn't regress.
