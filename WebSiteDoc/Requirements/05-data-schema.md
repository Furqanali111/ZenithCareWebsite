# Data Schema — Website Page Inventory

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

Every page on the site: what it is, who sees it, what it exists to do.

---

## 1. Marketing pages

### `/` — Home

- **What it does**: positions Zenith in 5 seconds, surfaces the revenue math, routes the visitor to the right next step (book a call, read services, use the ROI calculator).
- **Who sees it**: cold visitors from Google, LinkedIn clicks, direct URL, referrals. Every persona lands here first.
- **Purpose**: top-of-funnel conversion. Primary CTA = "Book a 15-min call". Secondary = WhatsApp.
- **Key sections**: hero + CTA, 3-step "how it works", revenue math block ("At 200 patients ≈ $13.2K/mo"), founder credibility strip (PharmD badge + photo), 2–3 service tiles, testimonial placeholder, final CTA band.
- **SEO target**: "chronic care management company", "ccm services"
- **Must-haves**: Organization + MedicalBusiness JSON-LD, OG image, one `<h1>`.

---

### `/services/chronic-care-management` — Core service page

- **What it does**: explains the CCM program in plain language, lists CPT codes with reimbursement figures, describes what Zenith handles vs. what the practice retains.
- **Who sees it**: practice managers researching outsourced CCM; physicians comparing vendors.
- **Purpose**: convince a researching buyer that Zenith can run their CCM program competently and compliantly. Primary CTA = "Calculate your ROI" + "Book a call".
- **Key sections**: what is CCM, who qualifies (patient criteria), CPT code table (99490, 99439, 99487, 99489, 99491, 99437), what Zenith delivers, what the practice retains, HIPAA posture callout, inline ROI preview, pricing framing ("per-patient-per-month, discussed on call"), FAQ excerpt, CTA.
- **SEO target**: "chronic care management services", "outsourced chronic care management", "ccm vendor"
- **Must-haves**: Service JSON-LD, long-form (1,500+ words), CPT table.

---

### `/who-we-serve/primary-care` — Specialty landing

- **What it does**: speaks directly to primary-care practice decision-makers, with examples relevant to that specialty's patient mix.
- **Who sees it**: Google long-tail searches like "ccm services for primary care".
- **Purpose**: specialty-tailored conversion. Same CTAs as home.
- **Key sections**: specialty-specific hero, typical patient conditions (hypertension, diabetes, COPD), typical panel size + revenue math, 1–2 relevant blog links, CTA.
- **SEO target**: "chronic care management for primary care"

### `/who-we-serve/internal-medicine` — Specialty landing

- **What it does**: same template as `/primary-care`, tailored to internal medicine (polychronic patients, hospital follow-ups).
- **Who sees it**: internal medicine practice managers.
- **Purpose**: specialty-tailored conversion.
- **SEO target**: "chronic care management internal medicine"

### `/who-we-serve/geriatrics` — Specialty landing

- **What it does**: same template, tailored to geriatrics (highest-eligibility patient panel, Medicare-dense).
- **Who sees it**: geriatric practice managers, group practice administrators.
- **Purpose**: specialty-tailored conversion.
- **SEO target**: "chronic care management geriatrics"

---

### `/roi-calculator` — Interactive calculator

- **What it does**: takes 2 inputs (eligible patient count, expected enrollment %) and returns a monthly + annual Medicare reimbursement estimate. Fully client-side; nothing is sent anywhere.
- **Who sees it**: visitors who need the number to justify a conversation internally.
- **Purpose**: give the buyer a concrete reason to book a call. CTA under the result: "Book a call to discuss your panel".
- **Key sections**: inputs panel, live result, assumptions footnote, CTA.
- **SEO target**: "ccm roi calculator"
- **Must-haves**: no data stored, no network calls, "estimates are illustrative" disclaimer.

---

### `/hipaa-compliance` — Compliance / trust page

- **What it does**: addresses the implicit "they're overseas, is this safe?" objection head-on. Explains BAA posture, encrypted comms, Minimum Necessary rule, training.
- **Who sees it**: physicians, compliance officers, cautious practice managers.
- **Purpose**: remove the single biggest trust blocker before the discovery call.
- **Key sections**: our role as Business Associate, we don't collect PHI on this site, our safeguards (administrative/physical/technical), BAA process, breach notification, contact.
- **SEO target**: "hipaa compliant ccm service"
- **Must-haves**: "No PHI collected via this website" statement; link to full HIPAA Statement legal page.

---

### `/about` — Founder / company

- **What it does**: tells Ali's story — PharmD, oncology/BMT background, why Zenith exists. Includes LinkedIn link.
- **Who sees it**: anyone evaluating credibility, especially physicians.
- **Purpose**: convert "clinically-led" positioning from a claim into evidence. The founder bio is the strongest trust asset.
- **Key sections**: founder photo, credentials and bio, why we started Zenith, LinkedIn/Doximity links, team (just Ali for v1), company facts (Wyoming LLC, year founded).
- **SEO target**: "ali hassan kaleem pharmd", branded
- **Must-haves**: Person JSON-LD with `sameAs` LinkedIn link.

---

### `/resources` — Blog index

- **What it does**: lists all blog posts, newest first, filterable by category.
- **Who sees it**: researchers, repeat visitors, Google traffic landing on a specific article and then browsing.
- **Purpose**: SEO content hub. Not a conversion page itself; funnels to individual posts.
- **Key sections**: featured post card, grid of recent posts, category filter.
- **SEO target**: category keywords ("ccm billing", "ccm compliance")

### `/resources/[slug]` — Blog post

- **What it does**: a single long-form article from `content/posts/*.mdx`.
- **Who sees it**: visitors from Google search for specific CCM questions.
- **Purpose**: capture informational-intent traffic, establish authority, link out to Services page.
- **Key sections**: hero image, title, author bio with credentials, date published + updated, body (1,200–1,800 words), inline CTA to Services, "Related posts", footer CTA.
- **SEO target**: article-specific keyword
- **Must-haves**: Article JSON-LD with Author Person, "last updated" visible on page.

---

### `/faq` — Frequently Asked Questions

- **What it does**: answers 15–20 common questions in accessible plain language.
- **Who sees it**: visitors with specific concerns before booking; also crawled directly by Google AI Overviews.
- **Purpose**: self-serve deflection AND AI-SEO (FAQ schema is prime for AI Overviews).
- **Key sections**: category tabs, question + answer accordion (expanded by default for SEO), "still have questions? Book a call" CTA.
- **SEO target**: question-shaped long-tail
- **Must-haves**: `FAQPage` JSON-LD covering every Q/A on the page.

---

## 2. Conversion page

### `/contact` — Three doors

- **What it does**: gives the visitor three equal ways to reach us without choosing a channel.
- **Who sees it**: visitors ready to engage.
- **Purpose**: book a call OR start a human conversation. Any channel = conversion.
- **Key sections**: big WhatsApp button, big email button, Formspree contact form (name, practice, email, state, role, message), Calendly embed below the fold, "no patient info" disclaimer.
- **Must-haves**: WhatsApp link with prefilled message, mailto with prefilled subject, Calendly inline embed, Formspree form endpoint from env var.

---

## 3. Legal pages

### `/privacy` — Privacy Policy

- **What it does**: tells visitors what data we collect, who processes it, and their rights (CCPA/VCDPA/CPA).
- **Who sees it**: anyone clicking the footer link; procurement teams; attorneys.
- **Purpose**: legal requirement + trust signal.
- **Content source**: `../Project/08-legal-pages-draft.md` §1 (attorney-reviewed before launch).

### `/terms` — Terms of Service

- **What it does**: governs use of the website (not the service contract — that's a separate signed agreement).
- **Who sees it**: footer visitors, procurement.
- **Purpose**: liability shield for the site itself.
- **Content source**: `../Project/08-legal-pages-draft.md` §2.

### `/hipaa-statement` — HIPAA Statement

- **What it does**: formal statement of our HIPAA posture as a Business Associate.
- **Who sees it**: compliance officers at prospective client practices.
- **Purpose**: convert the trust claim on `/hipaa-compliance` into a formal written posture.
- **Content source**: `../Project/08-legal-pages-draft.md` §3.

### `/accessibility` — Accessibility Statement

- **What it does**: commits to WCAG 2.1 AA, provides a reporting channel.
- **Who sees it**: assistive-technology users, ADA-compliance auditors.
- **Purpose**: ADA-lawsuit mitigation (healthcare sites are a top target).
- **Content source**: `../Project/08-legal-pages-draft.md` §4.

---

## 4. System / utility pages

### `/404` (`app/not-found.tsx`) — Not Found

- **What it does**: friendly 404 with 3 recovery links (Home, Services, Contact).
- **Who sees it**: broken links, typo'd URLs, old URLs after refactor.
- **Purpose**: avoid dead-ends; keep bounce rate down.

### `/sitemap.xml`

- **What it does**: machine-readable index of every public URL.
- **Who sees it**: Google, Bing, AI crawlers.
- **Purpose**: ensure full crawl + indexing.
- **Generated by**: `app/sitemap.ts`.

### `/robots.txt`

- **What it does**: tells crawlers what they're allowed to fetch (everything) and points to the sitemap.
- **Who sees it**: all crawlers.
- **Generated by**: `app/robots.ts`.

### `/llms.txt`

- **What it does**: markdown index of the site for AI crawlers (GPTBot, ClaudeBot, PerplexityBot).
- **Who sees it**: AI model crawlers that respect the emerging standard.
- **Purpose**: AI-SEO visibility.
- **Served from**: `public/llms.txt`.

### `/.well-known/security.txt`

- **What it does**: lists a security contact for responsible disclosure.
- **Who sees it**: security researchers.
- **Purpose**: receive bug reports before someone posts them publicly.

---

## 5. Global elements (not pages, present everywhere)

| Element | What it does | Where it lives |
|---|---|---|
| **Top nav** | Services ▾, Who We Serve ▾, About, Resources, FAQ, [Book a Call] | `components/Nav.tsx` |
| **Floating chatbot button** | Opens scripted FAQ panel (deferred to v1.1 — placeholder in v1) | `components/Chatbot.tsx` |
| **Floating WhatsApp button** | Opens `wa.me/` with prefilled message | `components/WhatsAppButton.tsx` |
| **Footer** | Logo, nav mirror, legal links, WhatsApp + email, disclaimers, copyright | `components/Footer.tsx` |
| **"Not medical advice" disclaimer** | Below footer on every page | `components/Footer.tsx` |

---

## 6. What is deliberately NOT a page

Called out so no one accidentally builds them in v1:

- `/pay` — contracts and payment are offline (email + Stripe Invoicing)
- `/get-started` — not needed; `/contact` is enough
- `/login`, `/signup`, `/account`, `/dashboard` — no user accounts
- `/cart`, `/checkout` — not e-commerce
- `/search` — site is small enough that nav suffices
- Per-service pages for billing / credentialing / coding / AR — add when Zenith starts selling those services
- Per-state landing pages — add in month 3 after launch
- Case study pages — add once first client signs and consents

---

## 7. Where each page's content comes from

| Page | Content source |
|---|---|
| `/`, `/services/*`, `/who-we-serve/*`, `/about`, `/hipaa-compliance`, `/roi-calculator`, `/contact` | Hard-coded in the Next.js component (JSX / inline MDX). Edited by dev or Ali via a PR. |
| `/resources`, `/resources/[slug]` | MDX files in `content/posts/`. Edited by Ali or dev via a PR. |
| `/faq` | `content/faq.json`. Edited via PR. |
| `/privacy`, `/terms`, `/hipaa-statement`, `/accessibility` | Static JSX built from `../Project/08-legal-pages-draft.md`. Attorney review before every change. |
