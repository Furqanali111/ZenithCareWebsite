# SEO Audit: Zenith Care Solutions (thezcs.com)

**Date:** 2026-10-24 | **Branch:** `seo-audit-v2` | **Mode:** read-only (no site code changed)
**Detail files:** [01 skills and inventory](01-skills-and-inventory.md) | [02 technical and on-page](02-technical-and-onpage.md) | [03 keywords, competitors, linking](03-keywords-competitors-linking.md) | [04 schema, AI, trust](04-schema-ai-trust.md) | [05 issue register and roadmap](05-issue-register-and-roadmap.md) | raw data in `data/`

## 1. Executive summary

The technical foundation is sound. All 52 sitemap URLs return 200, canonicals are self-referencing, there are zero broken internal links (53 unique hrefs checked), http/www/trailing-slash all collapse to `https://thezcs.com` with a single 308, robots.txt allows all crawlers including AI bots, `llms.txt` exists, every page has one H1, a unique title and description, and JSON-LD is valid and parseable. No indexation blockers were found.

The constraint on organic growth is not technical. It is **authority, proof and content depth**:

1. The company was formed 2026-10-22 (`web/lib/site.ts`). There are no testimonials, case studies, external citations or measured backlinks. Healthcare-billing content is YMYL, so trust signals matter more than markup.
2. Blog authorship is a software engineer (Furqan Ali). The clinical credential (PharmD) belongs to the co-founder and is not attached to any article.
3. Fourteen strong articles exist, but most are weakly linked from commercial pages, and several overlap on the CPT 99490 intent.
4. The revenue figures disagree between pages (home uses $66, the CCM page says about $62).

**Not measurable in this audit:** Core Web Vitals (PageSpeed Insights API returned HTTP 429 quota errors), Google Search Console, analytics, backlinks, keyword volumes, and confirmed Google indexation. These are listed as evidence needed in file 05.

**Note on domain:** you gave `https://www.thezcs.com/`. Live behavior is `www` 308 to `https://thezcs.com/` (apex is canonical). That is correct and consistent with sitemap, canonicals and schema. Make sure Search Console uses a Domain property or the apex URL-prefix property.

## 2. Top 10 findings (ranked)

| # | ID | Finding | Sev | Evidence |
|---|----|---------|-----|----------|
| 1 | F-01 | Reimbursement figures conflict across pages: home "base $66 / add-on $46" vs CCM page "~$62 / ~$47". Unverified claim risk in a YMYL niche. | High | Live text of `/` and `/services/chronic-care-management` |
| 2 | F-02 | No external proof or measurable authority: no testimonials, case studies, third-party mentions, phone, or physical presence; entity formed 2 days ago. | High | `site.ts` (`formedOn`, empty `phone`), `sameAs` = LinkedIn only |
| 3 | F-03 | Articles lack clinically credentialed author or reviewer. Article schema author is Furqan Ali (software). | High | `/resources/*` JSON-LD, homepage founder bios |
| 4 | F-04 | Weak internal linking to the 14 articles: 5 have only 2 inbound pages, 10 have 4 or fewer. Service pages rarely link to supporting articles. | Medium-High | Inbound link count from crawl (`data/`) |
| 5 | F-05 | Cannibalization risk on the CPT 99490 / CCM intent: `cpt-99490-2026`, `how-ccm-billing-works`, `cpt-99439-vs-99490`, `ccm-time-tracking-requirements` plus the CCM service page. | Medium | Titles and H1s in crawl |
| 6 | F-06 | Home title is generic and 63 chars ("Care Management, Billing & Staffing"). Lacks the head terms practices search (chronic care management, RCM). | Medium | Live `<title>` |
| 7 | F-07 | Duplicate, inconsistent `Service` JSON-LD on `/services/care-management` (two Service nodes, different names). | Medium | JSON-LD dump |
| 8 | F-08 | Core Web Vitals, mobile rendering, Search Console and backlinks are unmeasured. | Medium (gap) | PSI HTTP 429 |
| 9 | F-09 | No state-aware or practice-size content for the stated priority states (FL, TX, AZ, CA) and no comparison/vendor-evaluation pages beyond one. | Medium | Keyword map in file 03 |
| 10 | F-10 | Sitemap `lastmod` is one hard-coded date for 38 non-article URLs; `priority`/`changeFrequency` are ignored by Google. | Low | `web/app/sitemap.ts` |

## 3. Highest-priority fixes (await your approval)

1. Reconcile all reimbursement numbers to one dated, sourced CMS figure (owner confirms). Effort: S.
2. Add a clinically credentialed reviewer line and `reviewedBy` to the article template, only after the owner confirms who actually reviews content. Effort: S.
3. Add contextual links from each service and specialty page to 2 to 3 relevant articles, and a "Related services" block in every article. Effort: M.
4. Rewrite the home title and the generic H1s on `/pricing`, `/how-it-works`, `/faq`. Effort: S.
5. De-duplicate `Service` JSON-LD on `/services/care-management`. Effort: S.
6. Measure: connect Search Console, run Lighthouse/PSI with a key, record baselines. Effort: S.
7. Resolve the CPT 99490 overlap by assigning one primary page per sub-intent and cross-linking. Effort: M.

## 4. What is working (verified)

- 52/52 sitemap URLs 200; sitemap matches routes; no noindex or `X-Robots-Tag` anywhere.
- One 308 hop for www, http and trailing slash; uppercase path returns a real 404 (not soft 404).
- HSTS, CSP, brotli, font preload, `lang="en"`, viewport present.
- BreadcrumbList on most inner pages; Article with dates and author on all 14 posts; Organization and WebSite on every page.
- Titles unique (0 duplicates); descriptions 90 to 154 chars, none over 160.
- Compliance posture is conservative: no guaranteed-revenue language found in the scanned pages.

## 5. Verification log (commands run)

- `curl -I` with Googlebot UA on 8 URL variants (status, redirect, headers).
- Node crawl of all 52 sitemap URLs: `data/crawl-script.mjs`, output `data/live-crawl-2026-10-24.json`.
- Status check of all 53 unique internal hrefs: all 200.
- PageSpeed Insights API x3: failed, quota 429 (documented, not retried).
- Three WebSearch SERP probes for competitor context (results thin and vendor-heavy; see file 03).

*Nothing in this report claims Google indexation, rankings, traffic, backlink counts or AI citations.*
