# Service Page SEO Audit

**Site:** https://www.thezcs.com/
**Date:** 2026-10-19
**Method:** Read every service's entry in `web/lib/services.ts`, the shared template `web/app/services/[service]/page.tsx`, the 3 category-hub pages, the 3 who-we-serve pages, and all 8 blog posts in `web/content/posts/`. Compared current state against `KEYWORD_TO_URL_MAP.md`'s recommendations and the live competitor research in `KEYWORD_RESEARCH.md`.

## Headline finding

Most of this audit's "before" state is already good. A substantial SEO pass already happened (PR #18, "feature/seo-content-optimization", per `PROGRESS.md`) and the 3-day-old planning docs in this directory were mostly already executed in code, just not marked done in their own tracking tables. The real gaps were narrower than the planning docs suggest. This audit lists exactly what was found wrong and what remains a genuine recommendation (not yet acted on).

## A. Metadata

| Page | Before | Finding | After |
|---|---|---|---|
| `/services/remote-therapeutic-monitoring` | `metaTitle: "Therapeutic Monitoring (RTM)"` | **Defect.** Missing "Remote" — inconsistent with the service's own `name` field ("Remote Therapeutic Monitoring (RTM)") and with its sibling RPM's title pattern ("Remote Patient Monitoring (RPM) Services"). Also missing "Services", unlike most siblings. | `"Remote Therapeutic Monitoring (RTM) Services"` |
| All 14 service pages | `<title>` = `{metaTitle} \| Zenith Care Solutions` | **Recommendation, not fixed.** Several titles (e.g. CCM: 39 + 25 brand-suffix chars = 64; RPM: 66; new RTM fix: 71) exceed the project's own ≤60-char rule (`12-claude-requirements.md` §3.6) once the " | Zenith Care Solutions" suffix is counted. This is systemic across nearly every service page, predates this PR, and is a tradeoff against keeping the primary keyword readable in the title. Shortening all 14 titles is a bigger, riskier change than this task's scope (optimize, don't rewrite working copy) — flagged for a follow-up, not executed here. |
| `/services/provider-credentialing` | `metaTitle: "Credentialing & Enrollment"` | **Recommendation, not fixed.** Doesn't contain the primary keyword "provider credentialing services" the keyword map targets for this page. Reasonable editorial title, but weaker keyword match than its siblings. No GSC data exists to confirm this is actually underperforming, so left as a recommendation rather than changed speculatively. | Unchanged |
| All other 13 service pages | — | Titles and descriptions already match their keyword-map primary keyword, are unique, and fit within the content window. No changes needed. | Unchanged |

## B. Heading and content structure

Spot-checked `web/app/services/[service]/page.tsx` (the shared template every service renders through):

- Exactly one `<h1>` per page (the hero title from each service's `title` field) — confirmed, no duplicate H1 risk from the template.
- H2/H3 hierarchy: Capabilities → How it works → Who we serve → Revenue (care-management only) → Related resources → Cross-link note → FAQ → Related services → Final CTA. Logical, consistent across all 14 pages via the shared template (no risk of one page having a broken structure the others don't).
- Each service already answers 2-6 genuine buyer questions via its `faqs` array (CCM has 3, confirmed; most services have comparable counts). These emit `FAQPage` JSON-LD through the existing `FaqSection` component (confirmed in `PROGRESS.md` and the component itself).
- **No changes needed here.** The template-driven architecture means a structural fix would apply everywhere at once; no structural defect was found.

## C. Content depth vs. researched competitors

- **`/services/medical-billing`** — competitors researched (Outsource Strategies, My Physician Billing) lean on "dedicated biller per client" and specialty breadth as differentiators. Zenith's page doesn't yet make the "your practice stays the billing provider, Zenith does the labor" distinction as explicitly as the CCM page does for care management, even though that's the same real business model (per `CLAUDE.md`: "Zenith does NOT bill Medicare"). **Recommendation:** add one clarifying sentence to the medical-billing lead copy, mirroring CCM's existing FAQ ("Who bills Medicare for CCM, my practice or Zenith?"). Not made in this pass — it's a content-writing decision for the page owner, not a mechanical SEO fix, and the task's claims-hygiene rule means new copy needs the same care as existing copy.
- **`/services/medical-scribe`** — competitors (Physicians Angels, ScribeEMR) explicitly state where scribes physically work and whether scribing is AI, human, or hybrid. Zenith's page doesn't currently state this. **Recommendation, not fabricated or added:** this is a factual question about Zenith's actual operations that only the business owner can answer; adding an unverified claim here would violate the "no fabricated claims" rule.
- All other service pages read as comprehensive for their query (confirmed against each page's FAQ + capabilities + how-it-works sections) relative to the thin/outdated competitor pages found in research.

## D. Internal linking (the actual implementation gap, now fixed)

- **Blog → service links:** already present in all 8 posts (confirmed by grep: every post links to at least one `/services/...` URL; `cpt-99490-2026` and `ccm-vs-rpm-vs-pcm` link to 4+ each). `INTERNAL_LINKING_PLAN.md`'s Batch 1 status table says "Not started" — **that status is stale**, not accurate as of this audit.
- **Service → blog links:** present via the `ServiceResources` component (confirmed rendered on every service page). Batch 2 is also already done, contrary to the tracker's stale status.
- **Cross-category links (Batch 3):** a `CrossLinkNote` component already existed, driven by a `CROSS_LINKS` map — but **only 4 of 14 services had an entry** (`chronic-care-management`, `medical-billing`, `medical-coding`, `medical-scribe`). The other 10 (`principal-care-management`, `remote-patient-monitoring`, `remote-therapeutic-monitoring`, `transitional-care-management`, `provider-credentialing`, `accounts-receivable`, `medical-scheduler`, `medical-receptionist`, `patient-care-coordinator`, `virtual-assistant`) rendered nothing. **This was the single genuine, well-scoped gap found in this audit and has been fixed** — see `SERVICE_PAGE_OPTIMIZATION_CHANGELOG.md`.
- **Who-we-serve → RCM/staffing links:** already present (confirmed by grep in `who-we-serve/[specialty]/page.tsx`). Batch 3's who-we-serve rows were also already done.
- **Footer "Who We Serve" links:** confirmed present in `components/footer.tsx` (`QUICK_LINKS` already includes Primary Care / Internal Medicine / Geriatrics). Batch 4 already done.

## E. Structured data

- `serviceLd()`, `organizationLd()`, `breadcrumbLd()`, `faqPageLd()`, `websiteLd()` all already exist and are wired into the service-page template and layout per `PROGRESS.md` (PR #18). Spot-checked `web/lib/seo.tsx` confirms these factories exist. Did not find any page missing a `serviceType` or emitting a duplicate FAQ corpus (the FAQ-uniqueness fix from PR #18 was confirmed still in place).
- **No changes needed.**

## F. Technical / crawlability

- Already audited in full in `15-technical-seo-audit.md` (2026-10-16): 0 broken links, 0 orphan pages, max click depth 2, correct canonicals, correct robots.txt. Re-spot-checked the sitemap and `llms.txt` route — both are generated dynamically from `getAllPosts()` / the services registry, so **new blog posts and services never require a manual sync step** (confirmed by reading `app/sitemap.ts` and `app/llms.txt/route.ts`). The hard rule in `12-claude-requirements.md` §3.6 ("sitemap.ts, robots.ts, llms.txt must stay in sync") is structurally guaranteed here, not something that needs per-page upkeep.

## G. AI search visibility (Phase 7)

- Each service page already explains the service near the top (`lead` field), defines its CPT codes where relevant, and answers direct buyer questions in a self-contained FAQ block with matching JSON-LD. This already satisfies the task's AI-visibility guidance (explain early, define terms, answer questions directly, structured data matching visible content). No FAQ sections exist purely to stuff keywords — each one answers a real buyer question already present in the researched competitor landscape.

## Summary: what changed vs. what's a recommendation

**Changed (see changelog):** 1 metadata defect (RTM title), 10 missing cross-category internal links.

**Recommended, not changed (needs a content/product decision, not a mechanical fix):** service-page title length budget across all 14 pages; `provider-credentialing` title keyword match; medical-billing "who bills" clarifying sentence; medical-scribe location/AI-vs-human disclosure; 5 unwritten blog posts (medical-billing-outsourcing guide, RPM setup guide, virtual-staffing-benefits, ChartSpan-alternatives, CCM-under-Medicare-Advantage).
