# Keyword Clustering

**Site:** https://www.thezcs.com/
**Date:** 2026-10-19
**Builds on:** [`KEYWORD_RESEARCH.md`](KEYWORD_RESEARCH.md) (this pass), [`KEYWORD_TO_URL_MAP.md`](KEYWORD_TO_URL_MAP.md) (2026-10-16), and the workbook's "Keyword Clusters" sheet. Clusters below are reconciled against the live `web/lib/services.ts` catalog, not re-invented.

Each service gets its own cluster because each is a genuinely distinct search intent and a genuinely distinct deliverable (different CPT codes, different eligibility rules, different workflow) — not because the prior docs happened to list them separately. Grouping, say, CCM and PCM onto one page would force a buyer comparing the two programs to read past irrelevant content; the comparison itself already has its own home (`/resources/ccm-vs-rpm-vs-pcm`).

## Cluster 1 — Chronic Care Management (CCM)

- **Primary keyword:** chronic care management services
- **Secondary:** CCM services for medical practices, outsourced chronic care management, CCM company, CCM vendor
- **Long-tail:** chronic care management for primary care / internal medicine / geriatrics, CPT 99490 reimbursement 2026, HIPAA compliant CCM service
- **Related questions:** Who bills Medicare for CCM? Which patients qualify? Does CCM add work for my staff? (all three already answered as on-page FAQs in `lib/services.ts`)
- **Intent:** Commercial (buying/evaluating a vendor)
- **Audience:** Primary care, internal medicine, geriatric practice owners/managers
- **Business value:** Highest — Zenith's flagship, most-developed service (billing table, revenue example, 3 FAQs, dedicated blog support)
- **Content type:** Service page (exists) + supporting blog cluster (exists: `cpt-99490-2026`, `in-house-vs-outsourced-ccm`, `hipaa-checklist-outsourced-ccm`, `ccm-consent-requirements`, `ccm-time-tracking-requirements`, `how-ccm-billing-works`, `cpt-99439-vs-99490`)
- **Target URL:** `/services/chronic-care-management`
- **Existing page or new:** Existing, mature
- **Why not merged with anything:** CCM has a materially different CPT code set, time threshold (20 min), and eligibility rule (2+ chronic conditions) than PCM (1 condition) or RPM (device-based). A buyer searching "chronic care management" wants this program specifically, not a generic "care management" overview — that's what the category hub is for.

## Cluster 2 — Principal Care Management (PCM)

- **Primary keyword:** principal care management services
- **Secondary:** PCM services, PCM outsourcing, care management for one serious condition
- **Long-tail:** PCM vs CCM (covered by the comparison post), principal care management eligibility
- **Intent:** Commercial / informational (newer program, more buyer education needed)
- **Audience:** Specialists and primary care managing one high-risk condition per patient
- **Business value:** Medium — smaller addressable panel than CCM (single-condition patients only)
- **Target URL:** `/services/principal-care-management`
- **Existing or new:** Existing
- **Why separate from CCM:** Different eligibility rule (1 complex condition vs. 2+ chronic) and often a different billing physician (specialist vs. PCP). Conflating them risks a page that satisfies neither search.

## Cluster 3 — Remote Patient Monitoring (RPM)

- **Primary keyword:** remote patient monitoring services
- **Secondary:** RPM outsourcing, RPM workflow support, device-based monitoring coordination
- **Long-tail:** RPM setup guide, who supplies the RPM device
- **Intent:** Commercial
- **Audience:** Practices managing patients with vitals/device data (BP, glucose, weight)
- **Business value:** Medium-high; device + data review angle differentiates from the other 4 care-management programs
- **Target URL:** `/services/remote-patient-monitoring`
- **Existing or new:** Existing. "RPM setup guide" (informational) remains an unwritten content gap — see audit doc.
- **Why separate:** Device/data-review workflow is operationally distinct from CCM's phone-based coordination; a shared page would bury the "who supplies the device" question that is a real buyer blocker.

## Cluster 4 — Remote Therapeutic Monitoring (RTM)

- **Primary keyword:** remote therapeutic monitoring services
- **Secondary:** RTM workflow, therapy adherence monitoring, non-physiologic monitoring
- **Intent:** Commercial
- **Audience:** PT/rehab-adjacent and behavioral-health-adjacent practices tracking therapy adherence rather than vitals
- **Business value:** Lower volume than RPM/CCM but a distinct code set
- **Target URL:** `/services/remote-therapeutic-monitoring`
- **Existing or new:** Existing. Metadata defect found and fixed this pass (title was missing "Remote" — see changelog).
- **Why separate:** RTM tracks therapy/function data, not physiologic vitals — different program, different CPT family, genuinely different buyer question than RPM.

## Cluster 5 — Transitional Care Management (TCM)

- **Primary keyword:** transitional care management services
- **Secondary:** post-discharge care management, care transition coordination, TCM 7/14-day follow-up
- **Intent:** Commercial / informational
- **Audience:** Practices receiving hospital-discharged patients
- **Business value:** Medium; time-boxed (30-day) program, different sales motion (event-triggered, not panel-wide enrollment)
- **Target URL:** `/services/transitional-care-management`
- **Existing or new:** Existing
- **Why separate:** TCM is triggered by a discharge event with a strict 7/14-day contact window — this is a workflow-timing question no other care-management page answers.

## Cluster 6 — Care Management category hub

- **Primary keyword:** care management services for medical practices
- **Secondary:** Medicare care management programs, CCM/PCM/RPM/RTM/TCM comparison
- **Intent:** Commercial (umbrella researcher comparing programs before picking one)
- **Target URL:** `/services/care-management`
- **Existing or new:** Existing
- **Role:** Overview + program comparison entry point; must link to all 5 child pages (confirmed it does, via `RelatedServices` + nav mega-menu). Do not optimize this page for any single program's primary keyword — that would cannibalize the child pages (see mapping doc, cannibalization section).

## Cluster 7 — Revenue Cycle Management (RCM) category hub

- **Primary keyword:** revenue cycle management services
- **Secondary:** medical billing outsourcing, RCM for physicians
- **Target URL:** `/services/revenue-cycle-management`
- **Role:** Same umbrella-hub role as Cluster 6, for Billing/Coding/Credentialing/AR.

## Clusters 8–11 — RCM child services (Medical Billing, Medical Coding, Provider Credentialing, Accounts Receivable)

Each targets its own commercial keyword (`medical billing services for physician practices`, `medical coding services`, `provider credentialing services`, `medical accounts receivable follow-up`) at its own existing page. Kept separate because each is a distinct deliverable with a distinct buyer (billing = ongoing claim submission; credentialing = one-time payer enrollment; AR = aged-claim recovery) — a combined "RCM" page would force a credentialing-only buyer to read past unrelated billing content.

## Cluster 12 — Virtual Staffing & Admin Support category hub

- **Primary keyword:** virtual medical staffing services
- **Target URL:** `/services/virtual-staffing`
- **Role:** Umbrella hub introducing all 5 staffing roles (confirmed in workbook: "Category page introduces five roles").

## Clusters 13–17 — Staffing child services (Medical Scribe, Medical Scheduler, Medical Receptionist, Patient Care Coordinator, Virtual Assistant)

Each targets its own role-specific keyword (`remote medical scribe services`, `medical scheduling services`, `virtual medical receptionist`, `patient care coordinator services`, `healthcare virtual assistant services`). Kept as 5 separate pages, not merged, because a practice hiring (say) a scheduler has a different job-description search than one hiring a scribe — merging loses the role-specific long-tail.

## Cluster 18 — Who We Serve (specialty pages)

- **Primary keywords (one per page):** chronic care management for primary care / internal medicine / geriatrics
- **Target URLs:** `/who-we-serve/primary-care`, `/who-we-serve/internal-medicine`, `/who-we-serve/geriatrics`
- **Intent:** Commercial, specialty-qualified
- **Role:** Cross-links to both `/services/medical-billing` and `/services/virtual-staffing` already exist per page (confirmed in code) — these pages are the one place multiple categories intentionally co-occur, since a single practice specialty buys across all three categories.

## Cluster 19 — Informational / blog support cluster

Already covers (existing posts, confirmed in `web/content/posts/`): CCM vs RPM vs PCM comparison, how CCM billing works, CCM consent requirements, CPT 99439 vs 99490, CPT 99490 2026 rates, in-house vs outsourced CCM, HIPAA checklist for outsourced CCM, CCM time tracking requirements.

**Genuine remaining content gaps** (not yet written, carried over from `KEYWORD_TO_URL_MAP.md` and still accurate): a medical-billing-outsourcing guide (supports the RCM cluster, which currently has zero blog support), an RPM setup guide, a virtual-staffing-benefits piece, a ChartSpan-alternatives comparison, and a CCM-under-Medicare-Advantage piece. These are flagged as recommendations, not created in this pass — writing new long-form content is outside this task's scope (optimizing *existing* pages), and per the content-postponement note in `SEO_PRIORITIES_AND_QUICK_WINS.md`, comparison content should wait for verified differentiators.

## Cluster decisions NOT made (explicitly avoided)

- **No state-specific landing pages** (FL/TX/CA/AZ) — would be thin doorway pages at current traffic levels; already correctly postponed in the existing roadmap.
- **No merge of the 3 category hubs into one "services" mega-page** — each hub serves a genuinely different buyer motion (recurring patient enrollment vs. one-time/ongoing billing operations vs. staffing hire), confirmed by the distinct FAQ/trust content already written per category in `lib/services.ts`.
- **No separate page per keyword variation** (e.g. "CCM services" vs. "chronic care management services" vs. "outsourced CCM") — these all route to the single CCM service page; variations are secondary/semantic keywords on that one page, not separate URLs.
