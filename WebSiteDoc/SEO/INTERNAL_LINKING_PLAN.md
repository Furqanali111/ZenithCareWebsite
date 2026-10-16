# Internal Linking Plan

**Site:** https://thezcs.com/
**Date:** 2026-10-16
**Current state:** 35 pages, max click depth 2, no orphan pages, breadcrumbs added 2026-10-16, related-services cross-links added 2026-10-16.

---

## 1. Current Internal Linking Assessment

### What is already strong

- **Homepage:** 76+ internal links covering all major pages
- **Navigation mega-menu:** All 14 service pages linked from header
- **Footer:** All 14 services, quick links, resources, legal, contact
- **Breadcrumbs:** Added to service, category, specialty, and blog pages (2026-10-16)
- **Related services:** Each service detail page links to 3-4 sibling services in the same category (2026-10-16)
- **Click depth:** Every page reachable in 1-2 clicks from homepage

### What is weak

1. **Blog posts do not link to relevant service pages.** The CPT 99490 article about CCM does not link to `/services/chronic-care-management`. The HIPAA checklist article does not link to `/hipaa-compliance`.
2. **Service pages do not link to blog content.** No service page links to related articles that expand on the topic.
3. **Who-we-serve pages are not in the footer.**
4. **Cross-category links are missing.** Care management pages do not link to RCM or staffing pages, even when contextually relevant (e.g., CCM page could mention billing support).
5. **No contextual anchor text variety.** Most internal links use generic "Learn more" or "Explore" anchors rather than descriptive text.

---

## 2. Priority Internal Linking Changes

### Batch 1: Blog-to-Service Links (Critical, Days 8-10)

These are the highest-impact changes because they connect informational content to commercial pages.

| Source Page | Destination | Anchor Text (natural, varies) | Where to Place |
|---|---|---|---|
| `/resources/cpt-99490-2026` | `/services/chronic-care-management` | "chronic care management services" or "our CCM service" | Within the article body where CCM is first discussed in detail |
| `/resources/cpt-99490-2026` | `/roi-calculator` | "estimate your practice's CCM revenue" | Near reimbursement figures section |
| `/resources/cpt-99490-2026` | `/services/care-management` | "five Medicare care management programs" | Where the article mentions related programs |
| `/resources/in-house-vs-outsourced-ccm` | `/services/chronic-care-management` | "Zenith's chronic care management service" | In the outsourcing section or conclusion |
| `/resources/in-house-vs-outsourced-ccm` | `/about` | "about our team" or "our clinical background" | Where trust/credentials are discussed |
| `/resources/in-house-vs-outsourced-ccm` | `/contact` | "book a consultation" | In the conclusion |
| `/resources/hipaa-checklist-outsourced-ccm` | `/hipaa-compliance` | "HIPAA compliance posture" or "how we handle HIPAA" | Where HIPAA requirements are listed |
| `/resources/hipaa-checklist-outsourced-ccm` | `/services/chronic-care-management` | "CCM outsourcing" | Where outsourced CCM is discussed |

### Batch 2: Service-to-Blog Links (High, Days 11-14)

Add contextual links from service pages to relevant blog content to keep visitors engaged.

| Source Page | Destination | Anchor Text | Where to Place |
|---|---|---|---|
| `/services/chronic-care-management` | `/resources/cpt-99490-2026` | "CPT 99490 reimbursement breakdown" or "2026 CPT 99490 rates" | In the billing/reimbursement section or FAQ area |
| `/services/chronic-care-management` | `/resources/in-house-vs-outsourced-ccm` | "in-house vs. outsourced CCM comparison" | Near the "how it works" or value proposition section |
| `/services/chronic-care-management` | `/resources/hipaa-checklist-outsourced-ccm` | "HIPAA checklist for outsourced CCM" | In FAQ or compliance section |
| `/services/care-management` (hub) | `/resources/cpt-99490-2026` | "CPT 99490 guide" | In the comparison table area or intro |

### Batch 3: Cross-Category Contextual Links (Medium, Days 15-18)

| Source Page | Destination | Anchor Text | Where to Place |
|---|---|---|---|
| `/services/chronic-care-management` | `/services/medical-billing` | "medical billing support" | In "how it works" section: "Your practice bills Medicare... need billing support?" |
| `/services/medical-billing` | `/services/chronic-care-management` | "care management programs like CCM" | In intro: "We handle billing for services including..." |
| `/services/medical-coding` | `/services/chronic-care-management` | "CCM coding (99490, 99439)" | Where CPT codes are mentioned |
| `/services/medical-scribe` | `/services/chronic-care-management` | "CCM documentation requirements" | Where documentation workflows are discussed |
| `/who-we-serve/primary-care` | `/services/medical-billing` | "medical billing" | Where practice operations are discussed |
| `/who-we-serve/primary-care` | `/services/virtual-staffing` | "virtual staffing" | Where admin burden is discussed |

### Batch 4: Footer Enhancement (Low, Days 19-21)

| Change | Details |
|---|---|
| Add "Who We Serve" column to footer | Add Primary Care, Internal Medicine, Geriatrics links |
| Consider adding "Resources" section to footer | Link to top 2-3 blog posts for crawl equity |

---

## 3. Links for New Content (as published)

When new blog posts are created per the content calendar, add these links:

| New Article | Links TO (from article) | Links FROM (to article) |
|---|---|---|
| CCM vs RPM vs PCM | `/services/chronic-care-management`, `/services/remote-patient-monitoring`, `/services/principal-care-management`, `/services/care-management` | All 5 care management service pages should add a link to this comparison |
| How CCM Billing Works | `/services/chronic-care-management`, `/roi-calculator`, `/resources/cpt-99490-2026` | CCM page FAQ section, ROI calculator page |
| CCM Consent Requirements | `/services/chronic-care-management`, `/hipaa-compliance` | CCM page FAQ section |
| CPT 99439 vs 99490 | `/services/chronic-care-management`, `/resources/cpt-99490-2026` | CPT 99490 article (add link to the new piece) |
| Medical Billing Outsourcing Guide | `/services/medical-billing`, `/services/medical-coding`, `/services/revenue-cycle-management` | RCM category hub, billing service page |
| ChartSpan Alternatives | `/services/chronic-care-management`, `/contact`, `/about` | CCM service page (in FAQ or comparison context) |

---

## 4. Anchor Text Guidelines

**Do:**
- Use descriptive, natural phrases: "chronic care management services", "how CCM billing works", "our HIPAA compliance posture"
- Vary anchors pointing to the same page (do not use the same exact text every time)
- Place links where a reader would naturally want more detail
- Use 2-5 words for most anchors

**Do not:**
- Use "click here", "read more", or "learn more" as the only anchor text for internal links (these are acceptable for CTAs, not for contextual body links)
- Force exact-match keywords into every anchor
- Link the same page more than twice from a single page body (navigation and breadcrumb links are separate)
- Add links that interrupt the reading flow

---

## 5. Implementation Tracking

| Batch | Pages | Est. Links | Status | Target Date |
|---|---|---|---|---|
| 1: Blog-to-Service | 3 blog posts | ~8 links | Not started | Days 8-10 |
| 2: Service-to-Blog | 2-4 service pages | ~4 links | Not started | Days 11-14 |
| 3: Cross-Category | 6+ service pages | ~6 links | Not started | Days 15-18 |
| 4: Footer | Footer component | 3-6 links | Not started | Days 19-21 |
| 5: New content (ongoing) | Per content calendar | 3-5 per new post | Not started | Days 22+ |
