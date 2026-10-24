# Keyword Research

**Site:** https://www.thezcs.com/
**Date:** 2026-10-19
**Scope:** All 14 individual service pages, 3 category hubs, 3 who-we-serve specialty pages.

## 0. Before reading this: prior research already exists

This is not the first keyword-research pass on this site. Before writing anything new, the following were read in full:

- [`WebSiteDoc/Content/Zenith_Care_Solutions_SEO_Website_Content.xlsx`](../Content/Zenith_Care_Solutions_SEO_Website_Content.xlsx) — the "Keyword Clusters" sheet maps every service to one primary keyword, supporting terms, a target page, and a search intent. Confirmed it matches the live site's category structure (`rpm` = Care Management, `rcm` = Revenue Cycle Management, `staffing` = Virtual Staffing).
- [`KEYWORD_TO_URL_MAP.md`](KEYWORD_TO_URL_MAP.md) (2026-10-16) — a full commercial + informational keyword map with priority tiers, already covering every service page.
- [`INTERNAL_LINKING_PLAN.md`](INTERNAL_LINKING_PLAN.md) (2026-10-16) — specific link additions by batch.
- [`60_DAY_SEO_GROWTH_ROADMAP.md`](60_DAY_SEO_GROWTH_ROADMAP.md) and [`60_DAY_CONTENT_CALENDAR.md`](60_DAY_CONTENT_CALENDAR.md) — execution sequencing.
- [`SEO_BASELINE_AND_KPI_TRACKER.md`](SEO_BASELINE_AND_KPI_TRACKER.md) — baseline metrics (all "Unknown", no GSC/Bing access at the time).

**Finding:** those docs are 3 days old but already stale in one important way — the content calendar's top 4 "Critical/High" planned articles (`ccm-vs-rpm-vs-pcm`, `how-ccm-billing-works`, `ccm-consent-requirements`, `cpt-99439-vs-99490`) have since been written and published (`web/content/posts/`), and the internal-linking plan's Batches 1–3 (blog→service, service→blog, cross-category) are mostly already implemented in code. See [`SERVICE_PAGE_SEO_AUDIT.md`](SERVICE_PAGE_SEO_AUDIT.md) for the current-state audit that reconciles this.

This document does not repeat that research. It adds what was missing: **real competitor/SERP evidence**, since every existing doc explicitly flags "no paid keyword tool data available" and "no competitor research performed."

## 1. Data source limitations (stated up front, per instructions)

- **No Google Search Console or Bing Webmaster Tools access in this session.** Cannot report real impressions, clicks, average position, or CTR. The baseline tracker already flags this as the top-priority gap to close (verify GSC/Bing) — that is an account-access task, not a content task, and is unchanged by this work.
- **No paid keyword tool (Semrush, Ahrefs, Google Keyword Planner) access.** No search volume or keyword-difficulty numbers are reported anywhere in this document or the ones that reference it. Any volume figure in the pre-existing workbook or docs was already labeled an estimate there; this document does not add new unverified numbers.
- **Competitor research below comes from a small number of live web searches (3-10-2026... err 2026-10-19), not a keyword-tool competitor report.** Treat vendor claims quoted below as the vendor's own marketing, not independently verified facts.

## 2. Confirmed service scope (from the codebase, not assumed)

Read `web/lib/services.ts` (single source of truth for the mega-menu, sitemap, and all 14 service pages) to confirm the actual catalog before researching keywords for it:

| Category (`ServiceCategory`) | Hub URL | Services |
|---|---|---|
| `rpm` (labeled "Care Management") | `/services/care-management` | Chronic Care Management (CCM), Principal Care Management (PCM), Remote Patient Monitoring (RPM), Remote Therapeutic Monitoring (RTM), Transitional Care Management (TCM) |
| `rcm` ("Revenue Cycle Management") | `/services/revenue-cycle-management` | Medical Billing, Medical Coding, Provider Credentialing, Accounts Receivable (AR) |
| `staffing` ("Virtual Staffing & Admin Support") | `/services/virtual-staffing` | Medical Scribe, Medical Scheduler, Medical Receptionist, Patient Care Coordinator, Virtual Assistant |

Plus 3 who-we-serve specialty pages (primary care, internal medicine, geriatrics) and a `/roi-calculator` utility page. No service outside this list exists in the codebase; no new service was invented for this research.

## 3. Competitor / SERP evidence gathered (new, not in prior docs)

### Cluster: Chronic Care Management / outsourced CCM

Search: "outsourced chronic care management services for physician practices company"

- Vendors surfacing in discussion: **GeBBS**, **CapMinds**, **CareOne Team** (a client example from a Baltimore internal-medicine practice), and an older **Flow Health** case. Most sources are from 2015–2021, so current offerings are unverified.
- **ChartSpan** (named explicitly in the prior `SEO_PRIORITIES_AND_QUICK_WINS.md` as a comparison target) was researched separately: a third-party profile reports it typically retains **30–40% of the CCM revenue it generates, with no upfront cost to the practice** (revenue-share model, not independently confirmed by ChartSpan's own materials). ChartSpan's own blog describes itself as a CCM-only vendor.
- **Genuine, already-true differentiator this supports:** Zenith's own site already states "Flat monthly pricing… no per-claim or per-patient fees" (`components/trust-strip.tsx`). This is a real, verifiable point of differentiation against a revenue-share competitor and can be used safely in content without fabricating anything, because it is already Zenith's stated model.
- Common concern raised across sources: practices worry about **opening EHR/chart access to a third party** and about **managing remote staff they didn't hire**. Zenith's existing "Documentation inside your EHR" and "Clinical oversight on every account" trust marks already speak to this; no new claim needed.
- Sources: [medicaleconomics.com — outsourcing CCM](https://www.medicaleconomics.com/view/outsourcing-ccm), [hcinnovationgroup.com](https://www.hcinnovationgroup.com/population-health-management/article/13027566/many-providers-eye-outsourcing-chronic-care-management), [gebbs.com](https://gebbs.com/blog/the-benefits-of-outsourcing-chronic-care-management/), [myshortlister.com/chartspan](https://www.myshortlister.com/chartspan/vendor-reviews), [chartspan.com/blog](https://www.chartspan.com/blog/chronic-care-management-guide/)

### Cluster: Medical billing / RCM outsourcing

Search: "medical billing services outsourcing company for physician practices"

- Named competitors: **Outsource Strategies International** (Tulsa, OK; AAPC-certified coders, multi-specialty), **My Physician Billing** (US-based, all 50 states, dedicated billing group per client, HIPAA-compliant), **Advantedge Healthcare Solutions** (older acquisition news, dated ~2010).
- Pricing benchmark quoted by one vendor: in-house biller costs **$40,000–$60,000/yr salary** plus benefits/training/software; outsourced billing fees commonly run **4–7% of collections**. These are vendor-sourced, unverified figures — useful as a content talking point ("here's the typical trade-off range") but not something to present as Zenith's own number.
- Performance benchmark quoted: industry-average clean-claim rate **75–85%**, vs. **95–98%+** for high performers. Same caveat — vendor claim, not verified independently.
- Content opportunity: none of the researched competitor pages clearly explain the "practice stays the billing provider, Zenith does the labor" distinction that Zenith's own CCM page already makes for care management. The medical-billing page could make the equivalent distinction explicit for RCM (who submits claims, who the payer relationship is with) — a genuine content-depth gap versus the researched competitors.
- Sources: [outsourcestrategies.com](https://www.outsourcestrategies.com/specialties-serve/), [mcpservers.org — My Physician Billing](https://mcpservers.org/servers/myphysicianbilling-com), [healthcarefinancenews.com](https://www.healthcarefinancenews.com/news/medical-billing-vendors-join-forces-target-physicians-need-outsourcing)

### Cluster: Virtual medical staffing / remote scribe

Search: "virtual medical staffing services remote medical scribe company for practices"

- Named competitors: **Virtual Medical Scribe / VMS** (brand of EZ MD Solutions), **Physicians Angels** (founded 2007, scribes work from a HIPAA-compliant data center, not from home), **ScribeEMR** (Woburn, MA; also offers coding and RCM, claims up to 60% documentation-time reduction), **VP Scribes** (reports 150+ clients across 26 states).
- A real differentiator worth flagging in content (not a new claim — it's a distinguishing *question*, not a fact about Zenith): several competitors emphasize whether scribes work from a controlled facility vs. from home, and whether scribing is AI-assisted, human, or hybrid. Zenith's existing FAQ/trust content should make its own answer to this explicit if it isn't already (see audit doc).
- Sources: [goodfirms.co — Virtual Medical Scribe](https://www.goodfirms.co/company/virtual-medical-scribe), [clutch.co — Virtual Medical Scribe](https://clutch.co/profile/virtual-medical-scribe), [scribeemr.com](https://scribeemr.com/about-us/)

## 4. Recommended keyword fields template (used in the clustering/mapping docs)

For every keyword surfaced (by the prior workbook/docs or by this pass), the clustering and mapping documents record: keyword, search intent, topic/semantic relationship, relevant service, existing ranking URL (none known — zero Google index per the baseline tracker), target URL, priority, and research source. No search volume or difficulty number is stated anywhere because none was verified.

## 5. What this document does NOT do

- It does not re-derive the full keyword list already in `KEYWORD_TO_URL_MAP.md` — see that document and [`KEYWORD_CLUSTERING.md`](KEYWORD_CLUSTERING.md) (this pass) for the complete set.
- It does not invent search volumes, rankings, or competitor pricing beyond what the cited sources state.
- It does not propose new service lines or pages outside the 14 services already in `web/lib/services.ts`.
