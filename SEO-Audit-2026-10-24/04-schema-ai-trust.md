# 04. Structured data, AI visibility, healthcare trust

## Structured data audit (parsed from live HTML on all 52 pages)

| Type | Where | Status |
|---|---|---|
| Organization | every page | Valid. Has name, legalName, url, logo, sameAs (LinkedIn only), contactPoint (email), knowsAbout. No address by design (virtual mailing address is intentionally excluded) |
| WebSite | every page | Valid, no SearchAction (correct: no on-site search) |
| BreadcrumbList | most inner pages | Present on service, specialty, article, about, faq and legal pages. Not found on `/` (expected) or `/roi-calculator` (low impact) |
| Service | service, hub, specialty, home | Valid, `provider` references the Organization by `@id`, `areaServed` US |
| FAQPage | home, services, specialties | Valid and matches visible FAQs. See F-13 |
| Article | all 14 posts | Present with headline, description, dates, author Person, publisher, image key, mainEntityOfPage. See F-03 |
| Person | `/about` | Furqan Ali |
| JSON-LD parse errors | 0 of 52 | Pass |

Findings:
- **F-07** `/services/care-management` emits two `Service` nodes ("Care Management Programs" and "Care Management"), likely one from the hub template and one from a generic service template. Keep one.
- **F-13** Google restricts FAQ rich results to well-known government and health authority sites (since Aug 2023). A new B2B vendor should not expect FAQ rich results. The markup is valid and harmless and helps machine readability; keep, but do not count on SERP display.
- Organization `logo` points to `/logo.png`, which exists (200 expected; `public/logo.png` present). Not re-fetched.
- Schema content matches visible content in the pages sampled. The Service `audience: MedicalAudience` is reasonable for a B2B vendor.
- Not run: Google Rich Results Test and Schema Validator (need manual or authenticated tools).
- Recommendation (needs owner input): add `reviewedBy` or a second `author` on articles once a credentialed reviewer is confirmed; add `sameAs` for additional verified profiles when they exist. Do not add Review/AggregateRating schema without real reviews.

## AI search visibility assessment (SearchFit ai-visibility workflow, content and technical signals)

I did not query ChatGPT, Gemini, Perplexity or Google AI Overviews, so there is **no measured visibility score**. Findings are readiness signals only.

| Signal | Status |
|---|---|
| Crawl access | Pass. `robots.txt` allows all agents; no WAF challenge observed for a Googlebot-UA fetch |
| `llms.txt` | Present, accurate, lists 25+ pages, states what Zenith does not do. Useful for some agents; Google does not use it |
| Service definitions | Clear and consistent across home, `llms.txt` and schema (Zenith is a staff provider; the practice bills Medicare) |
| Direct answers | Strong: FAQ blocks on home, service and specialty pages, plus question-style article titles |
| Original/supporting content | Good article set; lacks first-hand data, case studies, named reviewers |
| Citations to authority | Check that CMS Physician Fee Schedule, CPT and CMS CCM booklet links appear in articles (not verified per article). Recommend a "Sources" block with dated CMS links |
| Entity verifiability | Weak: new LLC, LinkedIn only, no phone, no directory/profile presence yet (Crunchbase, Google Business Profile not applicable without a physical presence, industry directories) |
| Consistency | Mixed: reimbursement numbers differ (F-01) and a dated $ figure can be repeated by AI systems |

No guarantee of inclusion in any AI product follows from these changes.

## Healthcare trust and claims review

| Item | Observation | Action |
|---|---|---|
| Financial claims | Home: 200 patients x $66 = $13,200/month, labeled "representative" and "typical panel". CCM page: ~$62 (99490), ~$47 (99439). Inconsistent | **Owner to confirm** the CMS 2026 national and locality figures; use one source of truth (a shared constant) and cite CMS |
| "Increase" / "lifts by roughly 20%" | Qualified as representative of a 1-in-5 Complex-CCM mix | Keep the qualification adjacent to the number |
| Compliance claims | "HIPAA Business Associate, from day one"; clear that Zenith does not bill Medicare. No SOC 2/HITRUST claims found | Do not add certifications that do not exist; keep `/security` regulatory status statement |
| Co-founder credential | "Doctor of Pharmacy (PharmD)" for Muhammad Usman | **Owner to confirm** license/degree wording and whether it may appear as reviewer |
| Founder expertise | Furqan Ali is described as software; clinical authority is not shown on articles | Add a reviewer line only if true |
| Testimonials / clients | None on site (correct for a company formed 2026-10-22) | Do not invent. Plan: pilot case study with written consent when real |
| Contact and identity | Email only; phone, WhatsApp and Calendly URLs are empty env vars (hidden when unset) | Provide at least one real-time channel; it is a conversion and trust issue |
| Offshore delivery | Operating location not stated plainly in the pages sampled; `llms.txt` states WY mailing address as virtual | Owner decides how to disclose delivery model; buyers will ask. Misleading omission risk should be reviewed by counsel |
| PHI | Forms say do not submit patient info (per project rules); not re-tested | Verify on `/contact` before launch |

Findings: **F-01**, **F-02**, **F-03**, plus the offshore-disclosure note under F-02.
