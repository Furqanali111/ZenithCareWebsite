# Service Pages Ranking Strategy (Nov 2026)

Goal: get the `/services/*` pages indexed and moving toward page 1 of Google for their commercial terms, starting with the care management pages.

Data pulled Nov 27, 2026: URL Inspection on all 20 service pages, Search Console for Oct 28 to Nov 26, a crawl of all 96 sitemap URLs, and a manual check of who ranks for the main terms. Builds on `SEARCH_PERFORMANCE_PLAN_OCT_2026.md` and `KEYWORD_TO_URL_MAP.md`. Does not repeat what they already cover.

## 1. Where things stand

**Indexing is mostly solved.** 17 of 20 service pages are "Submitted and indexed", all crawled between Nov 8 and Nov 26.

| Not indexed | Status | Action |
|---|---|---|
| `/services/medical-receptionist` | URL is unknown to Google | Request indexing (section 4, week 1) |
| `/services/care-management/cpt-codes` | Discovered, not crawled | Request indexing |
| `/services/revenue-cycle-management/denial-codes` | Discovered, not crawled | Request indexing |

The 26 CPT and denial code detail pages are all "Discovered, currently not indexed". Google knows them and has not spent crawl on them yet. That is normal for a new domain with low authority.

**Ranking is the real problem.** Last 30 days:

| Service page | Impressions | Avg position |
|---|---|---|
| `/services/remote-therapeutic-monitoring` | 9 | 26 |
| `/services/chronic-care-management` | 7 | 59 |
| `/services/principal-care-management` | 5 | 81 |
| `/services/transitional-care-management` | 2 | 53 |
| `/services/provider-credentialing` | 2 | 15 |
| `/services/remote-patient-monitoring` | 0 | none |
| `/services/patient-care-coordinator` | 0 | none |
| 8 other service pages | 1 each | 1 to 78 (single odd queries) |

Site wide: about 107 impressions, 4 clicks, all clicks from Pakistan. US: 85 impressions, average position 49, 0 clicks. The October 30 day target was 100 impressions per week; actual is about 25.

## 2. Why they don't rank

1. **Not technical.** Every service page has a unique title and description, canonical, one H1, Service + FAQPage + BreadcrumbList schema, sources, FAQ and CTA. Breadcrumb rich results pass. No on-page fix will move rankings much from here.
2. **No authority.** The domain is about 10 weeks old with close to zero sites linking to it (not measured: no backlink tool connected; assume near zero). The commercial results are held by vendors with years of links (Medsien, CareHarmony, CoachCare, Prevounce, MedBridge, CipherHealth). The informational results are held by CMS, Medicare.gov, AAFP, AJMC and Medical Economics. This is the single biggest gap.
3. **Lopsided topical depth.** 15 of 19 articles link to `/services/chronic-care-management`. Most other service pages have only 1 to 3 supporting articles. Google ranks a page higher when the site shows depth around its topic.
4. **No outside proof.** No reviews, case results or third-party mentions Google or a buyer can check. This matters more on health and money topics.

## 3. What "top of Google" realistically means

No one can promise a position. For a new domain:

| Tier | Example queries | Realistic timeline |
|---|---|---|
| Long tail, specific | "outsourced ccm staff for small practice", "tcm documentation checklist 99495", "pcm billing requirements 2026" | Top 10 in 1 to 3 months with a matching page |
| Mid tail | "principal care management services", "remote therapeutic monitoring services", "transitional care management outsourcing" | Top 10 in 3 to 6 months with authority work |
| Head terms | "chronic care management services", "medical billing services" | 6 to 12+ months, needs dozens of referring domains |

Win the long tail first. Every long-tail ranking sends real visits and links, which then lift the mid-tail and head terms.

## 4. The plan

Focus on 5 pages first instead of spreading across 20: **CCM, PCM, TCM, RTM, RPM** (the care management cluster; most content already exists and this is the core business). Add **medical billing** and **provider credentialing** in month 2. The staffing pages follow in month 3.

### Workstream A: Authority (owner: Furqan, about 2 hours a week). Biggest lever.

Target: 10 referring domains by Jan 31, 25 by Mar 31. Track in `SEO_BASELINE_AND_KPI_TRACKER.md`.

1. **Business directories with a profile link** (week 1 to 2): Clutch, GoodFirms, Crunchbase, LinkedIn company page (already live, check the website link). Fill every field, same name, email and description everywhere.
2. **Expert quotes for journalists** (weekly): register Muhammad Usman, PharmD as a source on Qwoted and Featured.com. Answer requests on CCM, medication management, chronic disease and practice operations. Each quote that runs is usually a link from a high-authority site.
3. **Contributed articles** (1 per month): pitch Physicians Practice, Medical Economics and KevinMD (accepts essays from clinicians, a good fit for a PharmD byline). Topic ideas: "What practices get wrong about CCM consent", "Why CCM programs stall at 30 patients". Link back to the matching service page once, where the site allows. Check each site's current submission rules first.
4. **Partner listings** (month 2): CCM and RPM software vendors need staffing partners for practices that buy the software but have no staff. Ask to be listed as a services partner. Same for billing companies that don't do care management.
5. **Ask warm contacts** (once): 3 to 5 clients, partners or associations you already know, for a mention with a link.
6. Skip: paid link packages, link exchanges, private blog networks and mass directory submissions. They risk a penalty and the site cannot afford one.
7. Google Business Profile: still skip unless a real service location applies (the mailing address is virtual).

### Workstream B: Supporting content (owner: Claude drafts, Muhammad Usman reviews before merge)

Two articles a month, each targeting a long-tail query for one priority service and linking to that service page in the first 150 words with a descriptive anchor (for example "our principal care management services", not "click here"). Each carries the service tag so it appears in the page's related articles block automatically.

| # | Article | Supports | Target query |
|---|---|---|---|
| 1 | TCM documentation checklist: 99495 vs 99496 | TCM | tcm documentation requirements |
| 2 | PCM billing requirements and eligible conditions | PCM | pcm billing requirements |
| 3 | RTM vs RPM: codes, devices and who can bill | RTM, RPM | rtm vs rpm |
| 4 | RPM billing requirements checklist | RPM | rpm billing requirements |
| 5 | Cost of outsourced CCM staff vs hiring in-house | CCM | ccm staffing cost |
| 6 | How much does outsourced medical billing cost | Medical billing | medical billing company cost |
| 7 | How long does provider credentialing take | Credentialing | how long does credentialing take |
| 8 | How to work down AR over 90 days | AR follow-up | reduce ar over 90 days |

Verify every rule and dollar figure against the current CMS source before publishing. Cite it on the page.

### Workstream C: On-site (owner: Claude, in code, as PRs)

1. **Proof blocks on service pages** once real material exists: a client result with permission, a testimonial, panel numbers. Needs Furqan to supply. Do not invent or anonymize fake results.
2. **Comparison page**: the postponed "ChartSpan alternatives" piece, once verified competitor data exists. Comparison queries convert well.
3. **Title and description rewrites** at the 30 day review, only for pages with 50+ impressions and CTR under 1%.
4. **Code pages**: keep them; they link to the service pages and target real queries ("99426 cpt code" already gets impressions). Review on Jan 31. If still not indexed, expand the top 10 by impressions and noindex the rest until they can be expanded.
5. **State pages** (FL, TX, AZ, CA): phase 2 only, and only with content unique to each state. Thin city or state copies are doorway pages and can hurt the whole site.

### Weekly checklist (Furqan, 30 minutes)

- Search Console, URL Inspection, Request indexing: up to 10 URLs a day. Week 1: `/services/medical-receptionist`, `/services/care-management/cpt-codes`, `/services/revenue-cycle-management/denial-codes`, then the top 7 code pages.
- Run `pnpm indexnow` after each content deploy (Bing and others).
- Post each new article on LinkedIn with a short summary.
- Answer 2 to 3 journalist requests.

## 5. Next 4 weeks

| Week | Authority (Furqan) | Content (Claude + review) | On-site |
|---|---|---|---|
| Dec 1 | Clutch, GoodFirms, Crunchbase profiles; Qwoted + Featured.com signup | Article 1 (TCM) | Indexing requests |
| Dec 8 | First journalist answers; pick contributed article topic | Article 2 (PCM) | |
| Dec 15 | Pitch 1 contributed article; email 3 warm contacts | Article 3 (RTM vs RPM) | |
| Dec 22 | Partner listing outreach (2 vendors) | Article 4 (RPM) | 30 day review |

## 6. KPIs (review every 2 weeks)

| KPI | Nov 27 | Dec 31 | Mar 31 |
|---|---|---|---|
| Service pages indexed | 17 of 20 | 20 of 20 | 20 of 20 |
| Referring domains | about 0 | 10 | 25 |
| Impressions on the 5 priority pages, per 30 days | 23 | 150 | 1,000 |
| Priority pages with any query in top 20 | 1 (RTM) | 3 | 5 |
| Non-brand US clicks per 30 days | 0 | 10 | 100 |
| Calls booked from organic | 0 | 1 | 5 |

Decision rules from `SEARCH_PERFORMANCE_PLAN_OCT_2026.md` section 4 still apply. If referring domains stay under 5 by Jan 31, content alone will not get these pages up: shift more time to workstream A.
