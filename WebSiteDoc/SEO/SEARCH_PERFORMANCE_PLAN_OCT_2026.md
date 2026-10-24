# Search Performance Improvement Plan (Oct 2026)

Source data: Google Search Console (`sc-domain:thezcs.com`, pulled Oct 25, 2026) and GA4 (property "Zenith Care Solutions", Sep 20 to Oct 25, 2026). The site is about 4 weeks old, so every number is small. Treat this as a baseline, not a trend.

Canonical host decision: **`https://thezcs.com` (non-www)**. Already enforced in `web/lib/site.ts`, `web/app/sitemap.ts`, `web/app/robots.ts`, and a Vercel 308 redirect from `www.thezcs.com` to `thezcs.com`. No change needed.

Related docs: `07-seo-and-aiseo-plan.md`, `SEO/KEYWORD_TO_URL_MAP.md`, `SEO/60_DAY_CONTENT_CALENDAR.md`, `SEO/SEO_BASELINE_AND_KPI_TRACKER.md`.

## 1. Baseline (what the data says)

### Search Console (Oct 12 to Oct 25)

| Metric | Value |
|---|---|
| Impressions | 24 |
| Clicks | 3 (all from Pakistan, likely internal) |
| Average position | 51.8 |
| US impressions | 12, average position about 70, 0 clicks |
| Sitemap | `https://thezcs.com/sitemap.xml`, 46 URLs submitted Oct 22, 0 errors |

Page indexing report: **51 indexed, 19 not indexed.** The 19 break down as:
- 13 "Page with redirect": expected (www and http variants redirecting to `https://thezcs.com`). No action.
- 2 "Alternate page with proper canonical tag": expected. No action.
- 4 "Discovered, currently not indexed": the only real gap. Identify the 4 URLs (click the row) and fix.

So most pages are indexed. The sitemap's own "indexed" count of 0 is lagging and is not a problem by itself.

### Queries Google already links to the site

| Query | Position | Page Google picked | Note |
|---|---|---|---|
| 99490 documentation checklist | 10 | `/resources` (index) | Best opportunity. No dedicated article exists |
| 99426 time requirement | 79 | `/resources` (index) | No dedicated article exists |
| transitional care management software | 94 | `/services/transitional-care-management` | Intent mismatch ("software") |
| rtm billing software | 96 | `/services/remote-therapeutic-monitoring` | Intent mismatch ("software") |
| virtual patient coordinators | 92 | `/services/patient-care-coordinator` | Good intent match, weak rank |
| 99490 cpt code | 100 | `/resources/cpt-99490-2026` | Article exists, needs strengthening |
| pcm care coordination | 100 | `/services/principal-care-management` | Good intent match |
| who is the founder? | 1 | `/` | Brand query. Make `/about` answer it |
| remote patient monitoring, zendesk hipaa | 89 to 155 | various | Off-target. Ignore |

No query sits between positions 11 and 30, so there is nothing to "nudge" yet. The first win is getting the 8 to 10 relevant queries from page 8+ to page 2.

### GA4 (Sep 20 to Oct 25)

- 104 sessions. Direct 97, Organic Social 5, Organic Search 1 (Bing), 0 from Google organic.
- Locations: Pakistan about 29 users. US users are mostly Iowa 12, Illinois 6, Oregon 3 (Iowa and Oregon are cloud data center regions, so likely bots or previews). China (Xinjiang) 6, likely bots. Real US prospect traffic is close to zero.
- Key events: **0 across every page.** No conversion is tracked.
- Home page: 45 of 60 users, 12 s average engagement. Inner pages hold attention (`/about` about 1m20s, `/services/*` 1m30s to 3m), but samples are 1 to 7 users.
- Events seen: page_view, session_start, first_visit, scroll (30% of users), user_engagement, click (2), form_start (1). No form_submit, no Calendly, WhatsApp or mailto events.
- `/contact`: 7 views, 18 s engagement.

### Content that already exists (do not duplicate)

Posts in `web/content/posts/`: `ccm-consent-requirements`, `ccm-time-tracking-requirements`, `ccm-vs-rpm-vs-pcm`, `cpt-99439-vs-99490`, `cpt-99490-2026`, `hipaa-checklist-outsourced-ccm`, `how-ccm-billing-works`, `in-house-vs-outsourced-ccm`, `medical-billing-outsourcing-guide`, `provider-credentialing-guide`, `reduce-claim-denials`, `rpm-setup-guide`, `transitional-care-management-guide`, `virtual-medical-staffing-benefits`.

Missing for the queries above: a documentation checklist article, and a 99426/99427 (principal care management time rules) article.

## 2. Priorities

The real bottleneck is not content quality, it is that almost no relevant US traffic reaches the site and nothing is measured. Order:

1. Measure conversions (no data means no learning).
2. Get the 4 unindexed pages crawled and linked.
3. Ship the two missing articles that match queries Google already shows.
4. Fix "software" intent mismatch on TCM and RTM pages.
5. Bring in the first real US visits (outreach, LinkedIn, directories, backlinks).

## 3. Action plan

### Week 1: measurement and indexing (small code changes)

| # | Task | Where | Done when |
|---|---|---|---|
| 1 | Fire GA4 events: `generate_lead` style events for Calendly booking, WhatsApp click, mailto click, form submit. Then mark them as key events in GA4 | `web/components/ContactForm.tsx`, `CalendlyEmbed.tsx`, `WhatsAppButton.tsx`, `ContactEmailLink.tsx`; GA4 Admin | A test booking shows in Realtime and Key events |
| 2 | Define internal traffic and a filter in GA4. Exclude known bot regions in reports | GA4 Admin | Direct traffic from your IP no longer counts |
| 3 | Identify the 4 "Discovered, not indexed" URLs. Link each from the home page, a service page or the footer, then Request indexing | GSC, `web/components/Footer.tsx` | URLs show "Indexed" in URL Inspection |
| 4 | Check title and meta description uniqueness across all pages. Titles about 60 characters, descriptions about 150 to 160, each containing its primary term | `web/lib/pageMetadata.ts` and page `metadata` | No duplicate titles in a crawl |
| 5 | Confirm `https://thezcs.com/sitemap.xml` is the only sitemap property used in GSC and re-submit after content changes | GSC | 0 errors, count matches the sitemap |

### Weeks 2 to 3: content aimed at queries Google already shows

| # | Page | Target query | Approach |
|---|---|---|---|
| 6 | New: `/resources/cpt-99490-documentation-checklist` | 99490 documentation checklist | Answer-first checklist at the top, structured list, FAQ block with FAQ schema, link to `ccm-consent-requirements`, `ccm-time-tracking-requirements`, `/services/chronic-care-management` |
| 7 | New: `/resources/cpt-99426-99427-principal-care-management-time` | 99426 time requirement | State the time thresholds and who can bill, with a comparison table, a representative-result disclaimer where revenue is mentioned, and links to the PCM service page and `ccm-vs-rpm-vs-pcm` |
| 8 | Update: `/resources/cpt-99490-2026` | 99490 cpt code | Lead with a 2 sentence answer, add a code table (99490, 99439, 99487, 99489, 99491, 99437), a "last reviewed" date and reviewer name, FAQ schema, internal links |
| 9 | Update: TCM and RTM service pages | transitional care management software, rtm billing software | Say clearly this is a staffed service, not software. Keep "software" only where it genuinely helps (for example "works inside your EHR or CCM software"). Retarget H1 and title toward "TCM outsourcing for practices" and "RTM billing support" |
| 10 | Update: `/services/patient-care-coordinator`, `/services/principal-care-management` | virtual patient coordinators, pcm care coordination | Strengthen the opening paragraph, add FAQ schema and links from related posts |
| 11 | Update: `/about` | who is the founder? | Name Ali Hassan Kaleem, PharmD, with credentials in the first paragraph and Person schema |

Rules for every page: invoke the repo skills before writing (`searchfit-seo:on-page-seo`, `searchfit-seo:schema-markup`, `taste-skill` for layout), keep all claims qualified ("typical", "actual results vary"), no PHI, no em dashes.

### Weeks 3 to 8: build topical depth

1. One new article every 2 weeks, from the keyword cluster (see `KEYWORD_CLUSTERING.md`). Strong candidates: CPT 99487 and 99489 comparison, CCM patient eligibility, CCM staffing cost, how to start a CCM program.
2. Every article links to its service page, and each service page links to its 2 to 3 best articles (see `INTERNAL_LINKING_PLAN.md`).
3. Add Article, FAQ, Service and Organization schema where missing.

### Ongoing: first US visits and authority

- Post each new article on the founder's LinkedIn with a short summary, not just a link.
- Submit to relevant directories and professional communities. Ask 3 to 5 contacts for a link.
- Add Google Business Profile only if a real service location applies (the mailing address is virtual, so do not use it as an office).
- Keep AI crawlers allowed (already configured) and keep `llms.txt` up to date.

## 4. KPIs and review cadence

Review every 2 weeks and record in `SEO_BASELINE_AND_KPI_TRACKER.md`.

| KPI | Baseline (Oct 25) | 30 day target | 90 day target |
|---|---|---|---|
| Search impressions per week | about 12 | 100 | 1,000 |
| Clicks per week (excluding internal) | 0 | 5 | 50 |
| Queries in positions 1 to 20 | 3 | 8 | 25 |
| Key events (calls booked, forms, WhatsApp) | 0 tracked | tracking live | first 3 to 5 leads |
| Indexed pages | 51 | 55 | 65+ |
| Google organic sessions in GA4 | 0 | 10 | 150 |

Targets are guesses for a brand new domain. Adjust after the first 30 days of clean data.

Decision rules at each review:
- Query at positions 8 to 20: add depth, internal links, FAQ.
- High impressions, low CTR: rewrite title and description.
- Page indexed but 0 impressions after 30 days: check intent match and internal links.
- Page not indexed after 14 days: add links and request indexing.

## 5. Open questions

- Which 4 URLs are "Discovered, currently not indexed"? Needed before step 3.
- Does the Calendly embed expose a booking event we can capture (via the `calendly.event_scheduled` postMessage)? Confirm when implementing step 1.
- Who is the clinical reviewer named on articles? Pharmacist founder only, or an external physician too?
