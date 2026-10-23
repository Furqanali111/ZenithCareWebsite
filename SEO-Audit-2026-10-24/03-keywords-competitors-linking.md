# 03. Keyword clusters, competitors, internal linking

**Data limits:** no keyword tool, Search Console or competitor index was available. No search volumes, difficulty scores or traffic numbers are given. "Commercial value" is qualitative, from the business model (practice pays Zenith; practice bills Medicare). Prior internal docs exist in `WebSiteDoc/SEO/` (KEYWORD_RESEARCH, KEYWORD_TO_URL_MAP); this audit checks the live site against that intent mapping rather than redoing it.

## Keyword clusters and URL mapping (intent-based)

| Cluster | Intent | Customer | Existing target | Primary keyword (candidate) | Secondary | Gap / action |
|---|---|---|---|---|---|---|
| Outsourced CCM services | Commercial | Practice manager | `/services/chronic-care-management` | outsourced chronic care management | CCM services for physician practices, CCM staffing | Add "how outsourcing works", workflow, onboarding timeline, BAA. Link from 6+ articles |
| CPT 99490 / 99439 billing | Informational (high-intent) | Billing lead, MD | `/resources/cpt-99490-2026` | CPT 99490 | 99439, 99487, CCM reimbursement | Four pages overlap (F-05). Assign: 99490 = rates and rules; 99439 = add-on; time-tracking = audit evidence; how-billing-works = workflow overview. Cross-link each to the others |
| CCM compliance (consent, time, documentation) | Informational | Compliance, MD | consent + time-tracking posts | CCM consent requirements | CCM documentation requirements | Good coverage; add a checklist download or table |
| RPM | Commercial and informational | MD, practice manager | `/services/remote-patient-monitoring` | RPM services for primary care | RPM billing codes 99453/99454/99457 | Service page and `rpm-setup-guide` compete; keep the guide as "how to", service as "who does it" |
| CCM vs RPM vs PCM | Commercial investigation | MD | `/resources/ccm-vs-rpm-vs-pcm` | CCM vs RPM | PCM vs CCM | Strong. Link to each service page |
| TCM | Informational | MD | `transitional-care-management-guide` + TCM service | TCM 99495 99496 | 2 7 14 day rule | Fine |
| RCM / billing outsourcing | Commercial | Practice admin | `/services/revenue-cycle-management`, `/services/medical-billing`, billing guide | medical billing outsourcing for small practices | claim denial prevention | RCM hub and billing service overlap in title intent; billing page needs a distinct angle (specialty, denial rates) |
| Credentialing | Commercial and informational | New practice | `/services/provider-credentialing` + guide | provider credentialing services | payer enrollment | Good pairing |
| Virtual staffing | Commercial | Practice manager | `/services/virtual-staffing` + 5 role pages | virtual medical scribe / receptionist | remote medical staff for clinics | Role pages are broad; add comparison "virtual vs in-house" (exists as one article) |
| Specialty | Commercial | Specialty practices | `/who-we-serve/*` | CCM for primary care / geriatrics | internal medicine care management | Fine; keep to the three real specialties |
| Geography | Commercial | FL/TX/AZ/CA practices | none | n/a | Medicare Advantage by state | **Gap (F-09).** Do not create thin city pages. One substantive page per priority state is only justified if it has real state-specific content (payer mix, local rules) |
| Brand | Navigational | any | `/` | Zenith Care Solutions | thezcs | Name collision risk with other "Zenith" healthcare firms; Organization schema and `sameAs` help |

### Cannibalization checks
- **Likely:** CPT 99490 cluster (4 posts plus CCM page) and RPM (service + guide).
- **Possible:** `/services/care-management` (hub) vs `/services/chronic-care-management` for "care management services"; hub should target the umbrella term, CCM page the specific term.
- **Not found:** no duplicate titles or H1s across 52 pages. Verify real overlap in Search Console queries-by-page once connected.

## Competitor and content-gap analysis (limited evidence)

Three standard web searches for "outsourced chronic care management", "RPM services for primary care practices" and "virtual medical staffing" returned mostly vendor blogs and trade articles, many dated 2015 to 2021. Competitors that appeared: CapMinds, GeBBS, TriageLogic/RemotePatientPro, CoachCare, DocGo, Mindbowser, OnEdge, and Outsource Accelerator directories. I did not fetch or score their pages, and these results do not represent a ranked SERP, so no ranking comparison is claimed.

Observed patterns (from snippets only, to be validated):
- Competitor content is largely vendor-promotional and aging, which is an opening for current (2026) rules, worked examples and honest limits. Zenith's articles already do this ("Honest Cost Math", "Benefits, Limits").
- Pages that rank for RPM/CCM commonly carry tables of CPT codes, costs, and onboarding steps.

Differentiated gaps Zenith can credibly fill (needs owner-supplied facts):
1. A transparent "what the practice does vs what Zenith does" responsibility matrix for CCM (supervision, consent, billing).
2. A vendor-evaluation checklist for staffing (BAA, offshore data handling, supervision). One HIPAA vendor checklist exists; extend it to staffing and RCM.
3. Worked billing examples with dated CMS source links (Medicare Physician Fee Schedule), updated yearly.
4. Offshore delivery explained honestly: PHI access controls, US supervision, EHR access model. This is the top objection for a Pakistan-operated vendor; none of the audited pages treat it as a dedicated answer page (verify with the owner what can be stated).

Do not mass-produce state or keyword-variant pages. Each new page needs a distinct user question.

## Internal linking

Total links per page: global nav and footer contribute ~42 links on every page (fine, under 100). Inbound counts below exclude none; "52" means linked from every page.

| Inbound pages | URLs |
|---|---|
| 2 | `how-ccm-billing-works`, `rpm-setup-guide`, `transitional-care-management-guide`, `provider-credentialing-guide`, `in-house-vs-outsourced-ccm` |
| 3 | `reduce-claim-denials` |
| 4 | `medical-billing-outsourcing-guide`, `hipaa-checklist-outsourced-ccm` |
| 5 to 6 | `ccm-consent-requirements`, `cpt-99490-2026`, `virtual-medical-staffing-benefits`, `ccm-vs-rpm-vs-pcm` |
| 16 | `ccm-time-tracking-requirements`, `cpt-99439-vs-99490` (promoted in the article sidebar) |
| 52 | every service, specialty, legal and conversion page |

**Structure is flat and healthy for services (every service one click from any page via nav).** The weak side is the articles: they are reachable (resources index, 2 clicks from home) but receive almost no contextual links from the pages that should rank.

### Recommended contextual links (natural anchors, no exact-match stuffing)

| From | To | Anchor |
|---|---|---|
| `/services/chronic-care-management` | `cpt-99490-2026`, `ccm-consent-requirements`, `ccm-time-tracking-requirements`, `in-house-vs-outsourced-ccm` | "2026 CPT 99490 rates and rules", "consent documentation", "time tracking requirements", "in-house or outsourced" |
| `/services/remote-patient-monitoring` | `rpm-setup-guide`, `ccm-vs-rpm-vs-pcm` | "how to set up an RPM program", "CCM, RPM and PCM compared" |
| `/services/transitional-care-management` | `transitional-care-management-guide` | "the 2, 7 and 14 day rules" |
| `/services/provider-credentialing` | `provider-credentialing-guide` | "credentialing step by step" |
| `/services/medical-billing`, `/services/revenue-cycle-management`, `/services/accounts-receivable` | `medical-billing-outsourcing-guide`, `reduce-claim-denials` | "what to know before outsourcing billing", "preventing claim denials" |
| `/services/virtual-staffing`, role pages | `virtual-medical-staffing-benefits` | "benefits and limits of virtual staff" |
| `/hipaa-compliance`, `/security` | `hipaa-checklist-outsourced-ccm` | "vendor HIPAA checklist" |
| `/who-we-serve/*` | the 2 most relevant articles each | specialty-specific |
| Each article | its parent service page and 2 sibling articles | descriptive |
| `/pricing`, `/how-it-works`, `/faq` | relevant service and `/contact` | existing CTAs fine |

Breadcrumbs: BreadcrumbList schema exists on most inner pages; confirm a visible breadcrumb on articles and service pages (not verified in rendered UI).
