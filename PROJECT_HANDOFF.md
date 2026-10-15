# PROJECT HANDOFF: Zenith Care Solutions Website

**Created**: 2026-10-15
**Branch at time of writing**: `develop` (clean working tree, no uncommitted changes)
**Production URL**: https://thezcs.com/
**Repository**: `D:\Project\ZenithCareWebsite`

---

## Executive Summary

**What it is**: Zenith Care Solutions is a B2B healthcare services company offering remote care management (CCM/PCM/RPM/RTM/TCM), revenue cycle management, and virtual staffing to U.S. physician practices. The website is a marketing + lead-gen site. Primary conversion is a booked 15-minute discovery call.

**What has been accomplished**: The website is functionally complete with 20+ public routes, three service-line category hubs with alternating image+text feature rows, individual service pages, blog content, an ROI calculator, legal pages, and full SEO plumbing (sitemap, robots.txt, canonical redirects, JSON-LD structured data, llms.txt). The site is deployed on Vercel at https://thezcs.com/.

**Current state**: All code is merged to `develop`. The working tree is clean. The latest PR (#33, `feature/page-imagery`) added AI-generated images to category hubs, renamed the founder placeholder from "Ali Hassan Kaleem" to "Furqan Ali", and removed unused image bands from home and contact pages. The build passes cleanly.

**Most important constraints**: No em dashes in generated text. No fabricated metrics or credentials. Practice is the billing provider (Zenith does not bill Medicare). Qualified claims only. No PHI collected on the site. WCAG 2.1 AA required. Follow git workflow in CLAUDE.md (never push to `develop` directly).

**Standing instruction**: "for future no need to commit or create pr just give me the pr body and commit i will do those my self" - do NOT run git commit/push/PR; only output commit message + PR body text.

**Next recommended task**: Address the user's unresolved concern: "the images capture attention and text does not" on the feature row sections. The category hub copy in `web/lib/categories.ts` needs to be rewritten with punchier, more compelling text that matches the visual impact of the AI-generated images.

---

## A. Project Overview

### Business
- **Company**: Zenith Care Solutions
- **Founder**: Furqan Ali (name used on the site; CLAUDE.md still references "Ali Hassan Kaleem" as the original founder name, but the codebase has been updated)
- **Operating model**: Subcontracted clinical staff provider based in Pakistan, serving U.S. physician practices
- **Revenue model**: Practices bill Medicare for CPT codes (99490, 99439, 99487, etc.); practices pay Zenith for clinical coordination labor

### Website Purpose
- B2B marketing and lead generation for U.S. medical practices
- Primary conversion: booked 15-minute discovery call (via Calendly, WhatsApp, email, or contact form)
- Zero PHI collected anywhere on the site

### Target Audience
- U.S. primary care, internal medicine, and geriatric physicians
- Practice managers / office managers
- Priority states: FL, TX, AZ, CA (high Medicare Advantage penetration)

### Three Service Lines
1. **Care Management** (CCM, PCM, RPM, RTM, TCM) - Medicare care-management program coordination
2. **Revenue Cycle Management** - medical billing, coding, credentialing, A/R follow-up
3. **Virtual Staffing** - remote scribes, schedulers, receptionists, coordinators, virtual assistants

---

## B. Technology Stack and Architecture

### Core Stack
| Component | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.4.0 |
| Language | TypeScript | ^5 |
| Runtime | React | 19.3.0 |
| Styling | Tailwind CSS v4 + shadcn/ui | tailwindcss ^4, shadcn ^4.21.4 |
| Content | MDX (blog posts) + JSON (FAQ) + TypeScript modules (service/category data) | @next/mdx ^16.4.0 |
| Animation | Motion (formerly Framer Motion) | ^14.1.0 |
| Fonts | Inter (body), Space Grotesk (display/headings), JetBrains Mono (code) | via next/font |
| Analytics | Plausible (cookieless, loads only in production) | script tag, conditional |
| Package manager | pnpm | 12.11.2 |
| Hosting | Vercel | - |
| Domain | thezcs.com | - |

### No Backend
- v1 is fully static / SSG-friendly
- No API routes, no database, no server-side secrets
- Contact form: Formspree (external, not yet configured)
- Booking: Calendly embed (external, not yet configured)
- WhatsApp: `wa.me` link (not yet configured, env var empty)

### Key Architecture Decisions
- **Tailwind v4** with CSS custom properties for theming (brand tokens defined in `globals.css`)
- **shadcn/ui** components (owned copies in `components/ui/`)
- **MDX** for blog posts via `@next/mdx`
- **Dark mode** via `next-themes` with class-based switching
- **`font-serif`** is actually mapped to Space Grotesk (a grotesk display face), not a serif font. This is intentional and documented in `layout.tsx`.
- **Security headers** (CSP, HSTS, X-Frame-Options, etc.) configured in `next.config.ts`
- **www-to-non-www redirect** (308) configured in `next.config.ts`

### Build/Dev Commands
```bash
cd web
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
```

### Environment Variables (names only)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (defaults to `https://thezcs.com`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email (defaults to `contact@thezcs.com`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp button/link (hidden when empty) |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly embed (hidden when empty) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domain |
| `NEXT_PUBLIC_CONTACT_PHONE` | Phone number (empty, not yet provisioned) |
| `NEXT_PUBLIC_BUSINESS_HOURS` | Displayed business hours |
| `NEXT_PUBLIC_FORMSPREE_ID` | Contact form endpoint (not yet configured) |

---

## C. Project Rules and Development Constraints

### From CLAUDE.md (mandatory)
1. **Git workflow**: `develop` is source of truth. Never push directly. All changes through PRs. Branch naming: `feature/<title>`, `defect/<title>`, `hotfix/<title>`. Squash-merge only. Conventional Commits (one-line subject, no body). Full details in `WebSiteDoc/11-git-workflow.md`.
2. **Standing instruction**: Do NOT commit or create PRs. Only output commit message + PR body text.
3. **No em dashes** in any generated text, comments, or documentation.
4. **Qualified claims only**: "typical", "representative", "actual results vary", "subject to eligibility".
5. **Zenith does not bill Medicare**: the practice is the billing provider.
6. **No fabricated metrics**, citations, or credentials.
7. **Ponytail mode active**: smallest complete change, reuse existing patterns, delete before add.
8. **Dangling references are intentional**: if a review suggests removing a reference to a missing asset, do NOT remove it. Add the missing target to `WebSiteDoc/13-deferred-items.md` instead.
9. **No PHI** collected on the site, in forms, or in any chatbot.
10. **WCAG 2.1 AA** is a hard requirement (healthcare sites get sued).
11. **Before handing a code PR back**: run `ponytail:ponytail-review` skill on the diff.

### Required Skills/Plugins (from CLAUDE.md)
- **Every task**: `ponytail:ponytail` (always active)
- **New component/page**: `superpowers:brainstorming` then `taste-skill:taste-skill`
- **Chart/metric/ROI**: `dataviz` skill
- **New blog post**: `searchfit-seo:on-page-seo` + `searchfit-seo:keyword-clustering`
- **Schema markup**: `searchfit-seo:schema-markup`
- **Accessibility**: `design:accessibility-review`
- **Bug fix**: `superpowers:systematic-debugging`
- **Pre-deploy**: `engineering:deploy-checklist` + `website-quality-checker`
- **Code review**: `engineering:code-review` + `ponytail:ponytail-review`
- **UI component/redesign**: `taste-skill:soft-skill` -> `21st:21st-ui` -> `impeccable:impeccable`

---

## D. Website Routes and Page Inventory

### Public Routes

| URL Path | Purpose | Status | Key Components |
|---|---|---|---|
| `/` | Homepage: hero, trust strip, service lines, how-it-works, revenue math, founder strip, CTA | Complete | `HomeHero`, `TrustStrip`, `Reveal`, `FounderMonogram` |
| `/about` | Founder story, team values, LinkedIn CTA | Complete | `FounderMonogram`, `BulletedListItem` |
| `/contact` | WhatsApp/email/Calendly CTAs + Formspree contact form + Calendly embed | Complete | `ContactForm`, `CalendlyEmbed` |
| `/faq` | FAQ page with categorized accordion items | Complete | `FaqSection` (uses Accordion) |
| `/roi-calculator` | Interactive CCM revenue calculator | Complete | `RoiCalculator` (client component with sliders) |
| `/services` | Services overview, grid of all service cards | Complete | `ServiceGrid`, `ServiceCard` |
| `/services/care-management` | Care Management category hub with feature rows | Complete | `CategoryLanding`, `FeatureRows` |
| `/services/revenue-cycle-management` | RCM category hub with feature rows | Complete | `CategoryLanding`, `FeatureRows` |
| `/services/virtual-staffing` | Virtual Staffing category hub with feature rows | Complete | `CategoryLanding`, `FeatureRows` |
| `/services/[service]` | Individual service detail pages (dynamic) | Complete | `FeatureGrid`, `HowItWorks`, `FaqSection` |
| `/who-we-serve/primary-care` | Specialty landing: Primary Care | Complete | - |
| `/who-we-serve/internal-medicine` | Specialty landing: Internal Medicine | Complete | - |
| `/who-we-serve/geriatrics` | Specialty landing: Geriatrics | Complete | - |
| `/resources` | Blog listing page | Complete | - |
| `/resources/[slug]` | Individual blog post pages (MDX) | Complete | - |
| `/hipaa-compliance` | HIPAA compliance overview | Complete | - |
| `/hipaa-statement` | HIPAA statement (legal) | Complete | `LegalPage` |
| `/privacy` | Privacy policy | Complete | `LegalPage` |
| `/terms` | Terms of service | Complete | `LegalPage` |
| `/accessibility` | Accessibility statement | Complete | `LegalPage` |
| `/llms.txt` | Machine-readable site summary for AI crawlers | Complete | Route handler (GET) |
| `/sitemap.xml` | Dynamic sitemap | Complete | `sitemap.ts` |
| `/robots.txt` | Robots directives | Complete | `robots.ts` |

### Individual Service Pages (via `/services/[service]`)
These are generated from the service registry in `lib/services.ts`. The exact slugs can be found by calling `getServiceSlugs()`. They include services like chronic-care-management, remote-patient-monitoring, transitional-care-management, medical-billing, medical-coding, provider-credentialing, ar-follow-up, medical-scribe, medical-scheduler, medical-receptionist, patient-care-coordinator, virtual-assistant, etc.

### Blog Posts (via `/resources/[slug]`)
| Slug | Topic |
|---|---|
| `cpt-99490-2026` | CPT 99490 guide for 2026 |
| `hipaa-checklist-outsourced-ccm` | HIPAA checklist for outsourced CCM |
| `in-house-vs-outsourced-ccm` | In-house vs. outsourced CCM comparison |

### Key Shared Components
- **`Nav`**: Top navigation with mega-menu (services by category), Who We Serve, About, Resources, FAQ, Contact. Mobile sheet menu.
- **`Footer`**: Site links, legal links, social links, disclaimers, copyright.
- **`WhatsAppButton`**: Floating CTA, hides when `NEXT_PUBLIC_WHATSAPP_NUMBER` is empty.
- **`PageHero`**: Reusable hero section with eyebrow, title, lead, primary/secondary CTAs.
- **`CategoryLanding`**: Shared layout for category hub pages (used by all 3 hubs).
- **`FeatureRows`**: Alternating 2-column image+text rows with `BrandFigure` + `Reveal`.
- **`BrandFigure`**: Wraps `next/image` with fill, rounded frame, hairline border.
- **`Reveal`**: Scroll-triggered entrance animation (opacity + transform via IntersectionObserver).
- **`TrustStrip`**: Trust/credibility indicators strip.
- **`ContactForm`**: Contact form (currently posts to Formspree when configured).

---

## E. Design System and Brand Direction

### Brand Colors (v3 "Warm Cyan" theme)
Defined in `web/app/globals.css` as CSS custom properties:

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-900` | `#0b2026` | Deep cyan-ink, dark bg, logo |
| `--color-brand-800` | `#123038` | Dark mode card bg |
| `--color-brand-700` | `#155e75` | Mid cyan |
| `--color-brand-100` | `#cde6ec` | Light cyan tint, badges |
| `--color-brand-50` | `#eaf4f6` | Lightest cyan tint |
| `--color-gold-500` | `#db7e4c` | Warm apricot accent |
| `--color-gold-100` | `#f8e3d5` | Apricot tint |
| `--color-teal-600` | `#0e7490` | Deep cyan, links, bullets |
| `--color-teal-500` | `#1596b0` | Cyan aurora |
| `--color-teal-400` | `#5fc7d6` | Bright cyan, dark mode accents |
| `--color-surface-0` | `#ffffff` | White |
| `--color-surface-50` | `#faf7f2` | Warm cream (light mode bg) |
| `--color-ink-900` | `#15232b` | Warm cyan near-black (text) |

### Typography
- **Body**: Inter (sans-serif), highly legible
- **Display/Headings**: Space Grotesk (modern grotesk), mapped to `--font-serif` utility
- **Monospace**: JetBrains Mono (CPT codes, prices)
- All loaded via `next/font` with `display: swap`

### Layout Conventions
- Max width: `max-w-7xl` (1280px) for content
- Section spacing: `section-rhythm` utility class (uses `--section-py` / `--section-py-lg` tokens)
- Side gutters: `px-6` (24px)
- Corner radius: `--radius: 0.75rem` base, scaled via multipliers

### Light/Dark Mode
- `next-themes` with class-based switching (`class="dark"`)
- Full dark mode token set in `globals.css`
- Theme toggle in nav

### Animation
- `Reveal` component: scroll-triggered opacity + translateY via IntersectionObserver
- Motion library available for more complex animations
- Keeps content at opacity 0 until observed (be aware when taking screenshots)

---

## F. Work Completed (This Session and Recent History)

### Session Work (feature/page-imagery branch, now merged as PR #33)

1. **Added AI-generated images to category hub pages**
   - Created `FeatureRows` component (`components/feature-rows.tsx`) for alternating image+text layout
   - Added 9 images to `public/categories/` (3 per category hub)
   - Integrated into `CategoryLanding` component
   - Files: `components/feature-rows.tsx`, `components/category-landing.tsx`, `lib/categories.ts`

2. **Renamed founder from "Ali Hassan Kaleem" to "Furqan Ali"**
   - Updated `lib/site.ts` (name + initials)
   - Updated `app/about/page.tsx` (all references)
   - Updated `app/llms.txt/route.ts`
   - Updated `app/resources/page.tsx` and `app/resources/[slug]/page.tsx`
   - Updated `components/contact-form.tsx`

3. **Removed intro text paragraphs from category hubs**
   - Removed `intro` from `CategoryContent` type
   - Removed all `intro: [...]` arrays from category data in `lib/categories.ts`
   - Removed intro rendering from `category-landing.tsx`

4. **Removed home page image band**
   - Removed `BrandFigure` import and image section from `app/page.tsx`
   - Deleted `public/home.jpg`

5. **Removed contact page image band**
   - Removed `BrandFigure` import and image section from `app/contact/page.tsx`
   - Deleted `public/contact.jpg`

6. **Build verified clean** after all changes

### Earlier Significant Work (prior sessions, already merged)
- v3 "Warm Cyan" visual redesign (brand colors, typography, layout)
- Service page content expansion (all three service lines fully populated)
- SEO plumbing: sitemap, robots.txt, canonical redirects, JSON-LD, llms.txt
- Non-www canonical redirect (308)
- Security headers (CSP, HSTS, etc.)
- ROI calculator
- Blog infrastructure with 3 MDX posts
- FAQ page with categorized questions
- Legal pages (privacy, terms, HIPAA statement, accessibility)
- Contact page with multi-channel CTAs

---

## G. Current SEO and AI SEO State

### Implemented
- **Sitemap** (`app/sitemap.ts`): Dynamic, covers all static routes, service pages, specialty pages, and blog posts
- **Robots.txt** (`app/robots.ts`): Allows all crawlers including AI bots (GPTBot, ClaudeBot, PerplexityBot)
- **Canonical redirect**: www to non-www (308) in `next.config.ts`
- **JSON-LD**: Organization, Website, Service, BreadcrumbList, Person, FAQ schemas via `lib/seo.tsx`
- **`/llms.txt`**: Machine-readable site summary for AI crawlers
- **Meta tags**: Title, description, OG data on all pages via `pageMetadata()` helper
- **Canonical URLs**: Set via `metadataBase` in root layout
- **Blog content**: 3 SEO-targeted MDX articles

### Not Yet Done / Needs Attention
- **Google Search Console**: Status unknown. Listed in deferred items as needing verification.
- **Bing Webmaster Tools**: Status unknown.
- **Plausible analytics**: Not yet configured (env var empty).
- **Per-page OG images**: Only the default `opengraph-image.tsx` exists. Individual pages (services, about, ROI calculator) would benefit from custom OG images.
- **SEO content workbook** (`WebSiteDoc/Content/Zenith_Care_Solutions_SEO_Website_Content.xlsx`): Exists in the repo but has **not been systematically inspected or applied** in this session. Future sessions should review it for keyword targets and content gaps.

### SEO Skills Available (searchfit-seo plugin)
- `searchfit-seo:on-page-seo` - Available, not invoked this session
- `searchfit-seo:schema-markup` - Available, not invoked this session (schema already implemented manually)
- `searchfit-seo:seo-audit` - Available, not invoked this session
- `searchfit-seo:keyword-clustering` - Available, not invoked this session
- `searchfit-seo:ai-visibility` - Available, not invoked this session
- `searchfit-seo:content-strategy` - Available, not invoked this session

---

## H. Current Git and Deployment State

### Branch
- **Current branch**: `develop`
- **Working tree**: Clean (no uncommitted changes)
- **Latest commit**: `e3a883a` - Merge pull request #33 from Furqanali111/feature/page-imagery

### Local Branches
Active branches include: `develop` (current), `feature/page-imagery` (merged), `feature/final-qa`, `feature/pre-launch-polish`, `release/v1.0.0`, and several others from prior work.

### Deployment
- Hosted on **Vercel** at https://thezcs.com/
- Domain: `thezcs.com` (non-www canonical)
- www redirect configured in `next.config.ts`
- Build status: **Passes locally** (last verified this session)
- Whether the latest `develop` is deployed to production: **Needs verification** (depends on Vercel auto-deploy configuration)

### Known Production Issues
- **Logo**: `public/logo.svg` is 15MB (user was handling this separately). `public/logo.png` may need replacement. The Organization JSON-LD references `/logo.png`.
- **Favicon**: Still using stock Next.js favicon per `WebSiteDoc/13-deferred-items.md`. Needs brand-navy "Z" favicon.

---

## I. Outstanding Issues and Incomplete Work

### P0 - Critical
_(None identified)_

### P1 - High Priority

1. **Feature row copy does not compete with images for attention**
   - **Description**: User flagged that category hub images are visually compelling but the accompanying text (headings + body paragraphs) reads flat and corporate
   - **Current state**: Unresolved. Two approaches proposed (sharper copy vs. visual hierarchy boost in component), user had not yet decided
   - **Files**: `web/lib/categories.ts` (feature row data for all 3 categories)
   - **Next action**: Rewrite the 9 feature row body paragraphs with punchier, shorter, more direct language. Headings are decent, body copy needs work.
   - **Verify**: Visual review on dev server

2. **Founder bio credential mismatch**
   - **Description**: The about page and home page still say "clinical pharmacist, oncology/BMT" under the name "Furqan Ali". These credentials were written for the original founder placeholder "Ali Hassan Kaleem". If Furqan Ali does not hold these credentials, this is a trust/compliance risk.
   - **Current state**: Flagged in prior session, not addressed by user
   - **Files**: `web/app/about/page.tsx`, `web/app/page.tsx` (founder strip)
   - **Next action**: Ask the user to confirm Furqan Ali's actual credentials before publishing
   - **Verify**: Manual review

### P2 - Medium Priority

3. **Commit message + PR body not yet provided**
   - **Description**: Per standing instruction, the user wants commit message + PR body text for the completed work on `feature/page-imagery`. However, PR #33 has already been merged, so this may be moot.
   - **Next action**: Confirm with user whether they still need this

4. **Logo replacement** (15MB logo.svg)
   - **Description**: User was handling this themselves
   - **Files**: `web/public/logo.svg`, `web/public/logo.png`

5. **External accounts not configured**
   - WhatsApp Business number: not provisioned
   - Calendly: not configured
   - Plausible analytics: not configured
   - Formspree form: not created
   - Google Search Console: status unknown
   - Full list in `WebSiteDoc/13-deferred-items.md` and `WebSiteDoc/14-go-live-accounts.md`

### P3 - Low Priority / Future

6. **Per-page OG images** for high-value pages
7. **CSP tightening** (currently uses `unsafe-inline`)
8. **HSTS preload submission** (after 30 days clean HTTPS)
9. **Favicon replacement** with brand icon
10. **SEO audit** using searchfit-seo skills
11. **AI visibility audit** using searchfit-seo:ai-visibility

---

## J. Important Decisions and User Preferences

### Explicitly Decided
- **Founder name**: Changed from "Ali Hassan Kaleem" to "Furqan Ali" (user's instruction)
- **No images on home page**: User said the home image band "looks so odd like it does not belong there" - removed
- **No images on contact page**: User requested removal
- **No images on about page**: User explicitly excluded about from image additions
- **Alternating image+text layout** for category hubs: User chose this pattern from a reference screenshot
- **Feature row images kept**: 9 AI-generated images in `public/categories/` are the approved set
- **Standing instruction**: Do not commit or create PRs, only provide commit message + PR body text

### Explicitly Rejected
- Full-width single image bands on home/contact pages (removed after user feedback)
- Intro text paragraphs on category hubs (removed, feature rows carry the story now)

### Unresolved
- Whether feature row text should be rewritten (copy approach) or visually boosted (code approach) - user said "both may make sense" but flagged copy as the core issue
- Whether Furqan Ali's credentials match what's displayed on the site

---

## K. Tools, Skills, and Workflows

### Actually Used This Session
| Tool/Skill | Purpose | Notes |
|---|---|---|
| `ponytail:ponytail` | Active for all code changes | Always on per CLAUDE.md |
| `ponytail:ponytail-review` | Reviewed uncommitted changes | Ran on feature/page-imagery diff |
| Built-in browser (`mcp__Claude_Browser__*`) | Preview verification | Used to check layout via DOM inspection |
| Git (via Bash) | Branch management, commits | Standard workflow |
| Next.js build | Validation | `pnpm build` verified clean |

### Available but Not Used This Session
| Tool/Skill | Purpose | When to Use |
|---|---|---|
| `searchfit-seo:*` | SEO audit, on-page optimization, schema, AI visibility | Before shipping new pages or content |
| `taste-skill:taste-skill` | Frontend design guidance | Before writing new component markup |
| `impeccable:impeccable` | Pixel-ready UI handoff | For finished UI sections |
| `design:accessibility-review` | WCAG 2.1 AA audit | Before shipping interactive/form pages |
| `21st:21st-ui` | shadcn/ui component recipes | When building/redesigning UI components |
| `engineering:deploy-checklist` | Pre-deployment validation | Before Vercel deployments |
| `website-quality-checker` | Google QRG-based quality check | Before public launch or major content push |
| `superpowers:brainstorming` | New feature planning | Before building new features |
| `claude-mem:*` | Memory/context persistence | Session start/end |
| `dataviz` | Chart/visualization design | ROI calculator or data displays |

---

## L. Next-Session Startup Instructions

### Checklist for the Next AI

1. **Read** `PROJECT_HANDOFF.md` (this file) and `CLAUDE.md` at the project root
2. **Read** `WebSiteDoc/12-claude-requirements.md` for task-specific planning doc references
3. **Check git state**: `git status`, `git branch --show-current`, `git log --oneline -5`
4. **Do NOT** commit, push, or create PRs (standing instruction: output text only)
5. **Do NOT** use em dashes in any generated text
6. **Ponytail mode** is always active: smallest complete change
7. **Verify** before changing: the working tree should be clean on `develop`
8. **Preserve** the user's existing work; check for uncommitted changes before any destructive git operation

### Exact Next Task

**Rewrite feature row copy** in `web/lib/categories.ts` to be more compelling and attention-grabbing alongside the AI-generated images.

The user said: "the images capture attention and text does not." The 9 feature row entries (3 per category hub) need body paragraphs rewritten with:
- Shorter, punchier sentences
- Direct language that speaks to the practice owner's pain
- Less "explaining what the program is" and more "here's what changes for you"
- The headings are decent and can stay or be lightly sharpened

**Important**: maintain qualified claims, no fabricated metrics, and Zenith is the labor provider (practice bills Medicare). No em dashes.

After the copy rewrite, provide commit message + PR body text per standing instruction.

---

## QUICK CONTEXT FOR THE NEXT AI

```
Project: Zenith Care Solutions (thezcs.com) - B2B healthcare marketing site
Stack: Next.js 16.4.0, Tailwind v4, shadcn/ui, TypeScript, MDX blog, Vercel
Branch: develop (clean)
Founder on site: Furqan Ali (credentials may need verification)

STANDING RULES:
- Do NOT commit/push/PR. Output commit msg + PR body text only.
- No em dashes anywhere.
- Qualified claims only. Practice bills Medicare, not Zenith.
- No fabricated metrics. No PHI.
- Ponytail mode: smallest complete change.
- Read CLAUDE.md for full skill/plugin requirements.

IMMEDIATE TASK:
Rewrite feature row body copy in web/lib/categories.ts to be punchier.
User feedback: "the images capture attention and text does not"
9 feature rows (3 per category hub) need more compelling copy.
Headings are okay. Body paragraphs are too corporate/explainer.

UNRESOLVED RISK:
About page says "clinical pharmacist, oncology/BMT" under "Furqan Ali".
If these aren't Furqan's actual credentials, this needs user confirmation.

KEY FILES:
- web/lib/categories.ts (feature row data for all 3 hubs)
- web/components/feature-rows.tsx (alternating image+text component)
- web/components/category-landing.tsx (shared hub layout)
- web/lib/site.ts (site constants, founder info)
- web/app/globals.css (brand tokens, theme)
- WebSiteDoc/13-deferred-items.md (deferred work catalog)
```

---

*This handoff was created on 2026-10-15 from the `develop` branch with a clean working tree. Verify the git state before making changes.*
