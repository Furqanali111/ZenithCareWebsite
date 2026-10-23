# 05. Prioritized issue register, 30-day roadmap, measurement plan

Severity scale: Critical = blocks crawl or index; High = materially limits rankings, trust or conversion; Medium; Low. **No Critical findings** were verified. Effort: S under 2h, M half to 1 day, L multi-day. Source tool is the skill or method that surfaced it. Types: D = direct ranking relevance, I = indirect (trust, CTR, crawl, UX).

| ID | Category | Location | Evidence / repro | Sev | Impact (type) | Confidence | Fix | Tool | Effort | Dependencies | Validation |
|---|---|---|---|---|---|---|---|---|---|---|---|
| F-01 | Content accuracy | `/` vs `/services/chronic-care-management` | Fetch both; compare 99490 ($66 vs ~$62) and 99439 ($46 vs ~$47) | High | Trust, YMYL, AI quoting wrong numbers (I) | High | One sourced, dated rate constant; cite CMS PFS | on-page, manual | S | Owner confirms rates | Re-crawl, grep figures |
| F-02 | Authority / E-E-A-T | Site-wide, `lib/site.ts` | Formed 2026-10-22; no testimonials, phone empty, `sameAs`=LinkedIn; no delivery-model disclosure | High | Trust and link-earning (I, long-term D) | High | Real proof only: pilot case study (with consent), phone/WhatsApp, directory profiles, plain delivery-model page | ai-visibility, manual | M-L | Owner facts, consent | Manual review |
| F-03 | E-E-A-T | `/resources/*` Article schema and byline | Author Person "Furqan Ali" (software); no reviewer | High | Quality-rater and AI trust on billing content (I) | Medium | Add credentialed "Reviewed by" only if true; add `reviewedBy` | schema-markup | S | Owner confirms reviewer | Rich Results Test |
| F-04 | Internal linking | 14 articles | 5 articles with 2 inbound pages, 10 with 4 or fewer | Med-High | Discovery and relevance flow to money pages (D/I) | High | Add contextual links per file 03 table | internal-linking | M | None | Re-run link graph; inbound >= 5 each |
| F-05 | Cannibalization | CPT 99490 cluster; RPM | Four overlapping posts + CCM page; RPM service + guide | Medium | Split relevance (D) | Medium | Assign one sub-intent per page, cross-link, retitle if needed. Do not delete/redirect without GSC data | keyword-clustering | M | GSC queries | GSC query-to-page report |
| F-06 | On-page | `/` | `<title>` 63 chars, no head term | Medium | Relevance and truncation (D) | High | e.g. "Chronic Care Management and Billing Support for Medical Practices" (check length); keep brand last | on-page-seo | S | Owner agrees positioning | Re-fetch title |
| F-07 | Schema | `/services/care-management` | Two Service nodes | Medium | Ambiguity (I) | High | Emit one | schema-markup | S | None | JSON-LD parse |
| F-08 | Performance | Site | PSI 429; no CWV/mobile data | Medium (gap) | Page experience signal (D, minor) | n/a | Run PSI with API key or local Lighthouse (requires approval to install); check CrUX in GSC | technical-seo | S | API key | Report LCP/INP/CLS |
| F-09 | Content gap | Site | No state, EHR-integration, or vendor-evaluation pages for priority audience | Medium | Missed commercial queries (D) | Medium | Brief 4 to 6 substantive pages (file 03); no thin variants | content-strategy | L | Owner expertise | GSC impressions |
| F-10 | Sitemap | `app/sitemap.ts` | 38 URLs share one `lastmod` | Low | Crawl hint (I) | High | Derive from content updates; drop priority/changefreq | seo-audit | S | None | Fetch sitemap |
| F-11 | On-page | `/pricing`, `/how-it-works`, `/faq`, `/contact`, `/services` | Generic titles/H1 | Low-Med | Relevance (D) | High | e.g. "CCM and RCM Pricing Model", "How Outsourced Care Management Works" | on-page-seo | S | None | Re-fetch |
| F-12 | On-page | 7 pages | Descriptions 90 to 109 chars | Low | CTR only (I) | High | Expand to ~140 to 155 | seo-audit | S | None | Re-fetch |
| F-13 | Schema | FAQPage on 20 pages | FAQ rich results restricted to authoritative gov/health sites | Low | No SERP benefit expected (I) | High | Keep for readability; do not report as a win | schema-markup | none | None | n/a |
| F-14 | Measurement | n/a | No GSC/analytics access in this audit | Medium (gap) | Blind spot | n/a | Connect GSC (Domain property), GA4, bing WMT | all | S | Account access | Data present |
| F-15 | Content/images | Service pages | No illustrative images or diagrams; text-only | Low | Engagement (I) | Medium | One diagram per workflow page; alt text; `next/image` | on-page-seo | M | Design | Lighthouse |
| F-16 | Resources hub | `/resources` | H1 "Articles for practices evaluating CCM" while 6 of 14 articles are RCM/staffing; description 101 chars | Low | Topical mismatch (D) | High | Reframe H1; add topic filters or section anchors | on-page-seo | S | None | Re-fetch |

Passing items are in file 00 section 4. Items checked and clean: noindex, canonical, redirects, 404 handling, broken links, JSON-LD validity, uniqueness of titles/descriptions.

## 30-day implementation roadmap (after your approval)

| Week | Work | Findings |
|---|---|---|
| 1 | Connect GSC/GA4; run PSI/Lighthouse; record baselines. Owner decisions: CMS rates, reviewer, delivery-model disclosure, phone/WhatsApp/Calendly | F-08, F-14, F-01 (inputs) |
| 1 | Fix rate constants across pages; one `Service` node on care-management; retitle home and generic pages | F-01, F-06, F-07, F-11, F-12, F-16 |
| 2 | Contextual internal links service/specialty/article per file 03; "Related services" block in article template | F-04 |
| 2 | Reviewer/byline and `reviewedBy` (only if confirmed); Sources block with CMS links on articles | F-03 |
| 3 | Resolve CPT 99490 cluster roles and cross-links; sitemap `lastmod` cleanup | F-05, F-10 |
| 3 | Brief and write 2 differentiated pages: "How outsourced CCM works: responsibilities matrix" and "Offshore care teams: PHI, supervision, BAA" | F-09, F-02 |
| 4 | Pilot case study (if a real client exists), directory/profile submissions, re-crawl and compare to baseline | F-02 |

All page changes follow the repo workflow: `feature/*` branch, PR to `develop`, ponytail-review before handing back. Redirects: none proposed. Any future slug change would need 301s and a sitemap update, and is not recommended without GSC evidence.

## Baseline metrics and measurement plan

Baselines to capture before any change (all currently **unavailable** to this audit):

| Metric | Source | Cadence |
|---|---|---|
| Indexed vs excluded URLs, sitemap status | GSC Pages report | weekly |
| Impressions, clicks, CTR, average position by page and query, US only | GSC Performance | weekly |
| Pages with impressions and low CTR, positions 8 to 20 | GSC | biweekly |
| LCP, INP, CLS (field) | GSC CWV / CrUX; lab via PSI or Lighthouse | monthly |
| Organic sessions, `/contact` and Calendly conversions | GA4 | weekly |
| Referring domains and backlinks | Ahrefs/Semrush/GSC Links | monthly |
| AI referrals and manual prompt checks (ChatGPT, Perplexity, Google AI features) | GA4 referrers, manual log | monthly |
| Internal inbound links per article | Re-run `data/crawl-script.mjs` | after each linking PR |

Evidence needed from you: GSC access (or exports), GA4 access, a PageSpeed API key, any list of competitors you already track, confirmed CMS rates, reviewer identity, and whether any real client may be cited.

## Open questions requiring owner confirmation before publication
1. Current Medicare national and locality payment figures to display, with source and date.
2. Who actually reviews clinical/billing content, and their verified credentials.
3. Permitted public description of the delivery model and team location.
4. Whether phone, WhatsApp and Calendly will be live at launch.
5. Whether any pilot client exists and has consented to a case study.

## Correction after implementation (2026-10-24)

F-04 evidence was partly wrong. Service pages already render a tag-driven "resources" block (`SERVICE_TAGS` in `web/lib/services.ts`), capped at 6 links, and each article showed the same two newest posts as "Related reading". The real gaps were the cap, the repeated related pair, and no article-to-service link. Fixed in `feature/seo-audit-quick-fixes`: cap raised to 8, related posts ranked by shared tags, and a "Related service" link on each article. Lowest inbound count rose from 2 to 3; the two most-linked articles dropped from 16 to 13 to 14, so links are spread more evenly. Category hubs and specialty pages still link to no articles (open item).
