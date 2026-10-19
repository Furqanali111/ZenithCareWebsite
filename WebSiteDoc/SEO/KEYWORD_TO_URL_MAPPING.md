# Keyword to URL Mapping

**Site:** https://www.thezcs.com/
**Date:** 2026-10-19
**Relationship to existing docs:** [`KEYWORD_TO_URL_MAP.md`](KEYWORD_TO_URL_MAP.md) (2026-10-16) already built this exact mapping in detail and remains accurate — URLs, priorities, and the cannibalization section there were re-verified against the current `web/lib/services.ts` and found still correct. This document does not restate it; it adds the per-URL fields the task explicitly asks for (supporting topics, recommended internal links, competing URLs, keep/optimize/merge/redirect/create decision) in one place, and re-confirms the cannibalization check against the code as it exists today (not 3 days ago).

## Per-URL map

| URL | Primary keyword | Secondary keywords | Long-tail | Questions the page answers | Supporting topics | Internal links (confirmed in code) | Competing URL(s) | Action |
|---|---|---|---|---|---|---|---|---|
| `/` | chronic care management company (brand/entity) | care management, billing, staffing company | — | What does Zenith do? | All 3 categories, ROI figure | Links to all 3 category hubs, ROI calculator, about, contact | None (brand term) | Keep |
| `/services` | — (navigation page) | all 14 service names | — | What services exist? | — | Links to all 14 service pages + 3 hubs | None | Keep |
| `/services/care-management` | care management services for medical practices | CCM/PCM/RPM/RTM/TCM overview | — | Which program fits my practice? | Program comparison | Links to all 5 rpm-category children | `/resources/ccm-vs-rpm-vs-pcm` (internal, complementary not competing) | Keep as umbrella; do not add any single program's primary keyword here |
| `/services/chronic-care-management` | chronic care management services | CCM for primary care, outsourced CCM | CPT 99490 reimbursement, CCM consent, CCM time tracking | Who bills Medicare? Which patients qualify? Does it add staff work? | Billing table, revenue example | → `/services/medical-billing` (cross-category, confirmed), → all 3 who-we-serve pages, → 7 blog posts | ChartSpan, GeBBS, CapMinds, CareOne Team (external) | Keep, mature |
| `/services/principal-care-management` | principal care management services | PCM outsourcing | PCM vs CCM | What is PCM? Who determines eligibility? | — | → `/services/medical-billing` (cross-category, added this pass) | External PCM vendors (not separately researched — lower priority) | Keep |
| `/services/remote-patient-monitoring` | remote patient monitoring services | RPM outsourcing | RPM setup guide (unwritten) | Who supplies the device? | — | → `/services/patient-care-coordinator` (cross-category, added this pass) | RPM device/platform vendors | Keep |
| `/services/remote-therapeutic-monitoring` | remote therapeutic monitoring services | RTM workflow | — | How is RTM different from RPM? | — | → `/services/chronic-care-management` (cross-category, added this pass) | — | Keep; title defect fixed this pass (was missing "Remote") |
| `/services/transitional-care-management` | transitional care management services | post-discharge coordination | TCM 7/14-day window | How fast must follow-up happen? | — | → `/services/medical-scheduler` (cross-category, added this pass) | — | Keep |
| `/services/revenue-cycle-management` | revenue cycle management services | RCM outsourcing | — | Which RCM service do I need? | — | Links to Billing/Coding/Credentialing/AR | — | Keep as umbrella; do not add any single child's primary keyword here |
| `/services/medical-billing` | medical billing services for physician practices | billing outsourcing | clean claim rate, in-house vs outsourced cost | Who submits claims, Zenith or my practice? | — | → `/services/chronic-care-management` (cross-category, confirmed) | Outsource Strategies International, My Physician Billing, Advantedge | Keep. Content-depth gap identified (see audit): page doesn't yet make the "who bills" distinction as explicitly as the CCM page does |
| `/services/medical-coding` | medical coding services | coding outsourcing | ICD-10/CPT/E&M coding | — | — | → `/services/chronic-care-management` (cross-category, confirmed) | — | Keep |
| `/services/provider-credentialing` | provider credentialing services | payer enrollment | CAQH, revalidation | — | — | → `/services/care-management` (cross-category, added this pass) | — | Keep |
| `/services/accounts-receivable` | medical accounts receivable follow-up | denial management, AR follow-up | aged claims, appeals | — | — | → `/services/chronic-care-management` (cross-category, added this pass) | — | Keep |
| `/services/virtual-staffing` | virtual medical staffing services | remote medical staff | — | — | — | Links to all 5 staffing children | Virtual Medical Scribe (EZ MD Solutions), Physicians Angels, ScribeEMR, VP Scribes | Keep as umbrella |
| `/services/medical-scribe` | remote medical scribe services | virtual scribe | AI-assisted vs human scribing | Who reviews/authenticates notes? | — | → `/services/chronic-care-management` (cross-category, confirmed) | Virtual Medical Scribe, Physicians Angels, ScribeEMR, VP Scribes | Keep. Consider adding the "where do your scribes work from / AI vs human" distinction competitors lean on (see research doc) |
| `/services/medical-scheduler` | medical scheduling services | remote appointment scheduler | — | — | — | → `/services/transitional-care-management` (cross-category, added this pass) | — | Keep |
| `/services/medical-receptionist` | virtual medical receptionist | remote front desk | — | — | — | → `/services/revenue-cycle-management` (cross-category, added this pass) | — | Keep |
| `/services/patient-care-coordinator` | patient care coordinator services | prior auth, referral tracking | — | — | — | → `/services/chronic-care-management` (cross-category, added this pass) | — | Keep |
| `/services/virtual-assistant` | healthcare virtual assistant services | admin support | — | — | — | → `/services/revenue-cycle-management` (cross-category, added this pass) | — | Keep |
| `/who-we-serve/primary-care` | chronic care management for primary care | — | — | — | — | → `/services/medical-billing`, → `/services/virtual-staffing` (confirmed) | — | Keep |
| `/who-we-serve/internal-medicine` | chronic care management internal medicine | — | — | — | — | Same pattern as primary-care | — | Keep |
| `/who-we-serve/geriatrics` | chronic care management geriatrics | — | — | — | — | Same pattern | — | Keep |
| `/roi-calculator` | CCM ROI calculator | CCM revenue calculator | — | — | — | Linked from homepage, CCM page, blog posts | — | Keep |
| `/hipaa-compliance` | HIPAA compliant CCM service (trust/entity) | — | — | — | — | Linked from `hipaa-checklist-outsourced-ccm` post | — | Keep |

## Cannibalization re-check (confirmed against current code, 2026-10-19)

The three risks already identified in `KEYWORD_TO_URL_MAP.md` were re-verified and remain low-risk, with no change needed:

1. **"chronic care management services"** — homepage targets the brand/entity term ("chronic care management company"); the service page targets the commercial-service term. Homepage copy was spot-checked and does not repeat the service page's primary keyword verbatim. No action needed.
2. **"care management services"** — the category hub (`/services/care-management`) targets the umbrella term; each of its 5 children targets its own specific program. Confirmed the hub's own copy does not target any single program's primary keyword (it links out instead). No action needed.
3. **"revenue cycle management"** — same hierarchy pattern, re-confirmed for the RCM hub and its 4 children. No action needed.

**New check performed this pass:** verified no two service pages' `metaTitle` in `web/lib/services.ts` are duplicates or near-duplicates of each other (all 14 are distinct strings; one defect found and fixed — see changelog). Verified no two pages share an identical `metaDescription`.

## Pages explicitly NOT created (and why)

Per the task's "do not create unnecessary pages" instruction and the existing roadmap's own postponement list: no state-specific landing pages, no competitor-comparison landing pages beyond the blog-post format already planned, no separate page for keyword variations of an existing service's primary term.
