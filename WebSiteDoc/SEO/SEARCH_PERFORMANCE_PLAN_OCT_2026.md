# Search Performance Improvement Plan (Oct 2026)

Source data: Google Search Console (`sc-domain:thezcs.com`, pulled Oct 25, 2026) and GA4 (property "Zenith Care Solutions", Sep 20 to Oct 25, 2026). The site is about 4 weeks old, so every number is small. Treat this as a baseline, not a trend.

Canonical host decision: **`https://thezcs.com` (non-www)**. Already enforced in `web/lib/site.ts`, `web/app/sitemap.ts`, `web/app/robots.ts`, and a Vercel 308 redirect from `www.thezcs.com` to `thezcs.com`. No change needed.

Related docs: `../Project/07-seo-and-aiseo-plan.md`, `KEYWORD_TO_URL_MAP.md`, `60_DAY_CONTENT_CALENDAR.md`, `SEO_BASELINE_AND_KPI_TRACKER.md`.

## 1. Baseline (what the data says)

### Search Console (Oct 12 to Oct 25)

| Metric | Value |
|---|---|
| Impressions | 24 |
| Clicks | 3 (all from Pakistan, likely internal) |
| Average position | 51.8 |
| US impressions | 12, average position about 70, 0 clicks |
| Sitemap | `https://thezcs.com/sitemap.xml`, 46 URLs submitted Oct 22, 0 errors |

Page indexing, URL by URL (checked Oct 25 with URL Inspection on all 51 sitemap URLs): **31 indexed, 20 not indexed.**
- 12 "Discovered, currently not indexed": `/pricing`, `/how-it-works`, `/refund-policy`, `/complaints`, `/security`, `/services/medical-receptionist`, and the articles `ccm-consent-requirements`, `how-ccm-billing-works`, `rpm-setup-guide`, `virtual-medical-staffing-benefits`, `transitional-care-management-guide`, `provider-credentialing-guide`.
- 7 "URL is unknown to Google": `/service-delivery`, `/privacy`, and the articles `ccm-time-tracking-requirements`, `cpt-99439-vs-99490`, `medical-billing-outsourcing-guide`, `reduce-claim-denials`, `ccm-vs-rpm-vs-pcm`.
- 1 "Crawled, currently not indexed": the article `hipaa-checklist-outsourced-ccm`.
- The 13 "Page with redirect" and 2 "Alternate page with proper canonical" entries in the report are expected (www and http variants). No action.

Internal links are not the cause: policy pages are in the footer on every page, articles are listed on `/resources`, and service pages show tag-driven related articles. This is crawl lag on a four week old site.

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

## 2. Already shipped (do not redo)

GA4 conversion events and key events; title and meta audit with rewrites for the weak pages; articles on the CPT 99490 documentation checklist and on CPT 99426 and 99427 PCM time rules; strengthened 99490 article, TCM and RTM wording, PCM and care coordinator pages, About page Person schema; sitemap property confirmed. (PR 85 and PR 86.)

## 3. Open work

### Indexing (manual, quota about 10 requests per day)

1. Use URL Inspection, Request indexing, starting with: `/pricing`, `/how-it-works`, `/resources/ccm-vs-rpm-vs-pcm`, `/resources/cpt-99439-vs-99490`, `/resources/ccm-time-tracking-requirements`, `/resources/how-ccm-billing-works`, `/security`, then the rest of the 20 pages above, and each new article the day it ships.
2. Re-run URL Inspection on the 20 pages after a week. A page still not indexed after 14 days needs more internal links, then another request.

### Measurement

3. Define internal traffic and a filter in GA4 (Admin, Data streams, Configure tag settings, Define internal traffic) so your own visits stop counting.
4. Review every 2 weeks and record in `SEO_BASELINE_AND_KPI_TRACKER.md`.

### Content: build topical depth

5. One new article every 2 weeks from `KEYWORD_CLUSTERING.md`. Candidates: CPT 99487 and 99489 (complex CCM), CCM patient eligibility, CCM staffing cost, how to start a CCM program, and the postponed ChartSpan alternatives piece once verified competitor data exists.
6. Each article links to its service page, uses a cover image and FAQ block, and carries tags that match `SERVICE_TAGS` so it appears on the service page automatically.

### Authority and first US visits

7. Post each new article on LinkedIn with a short summary, not just a link.
8. Submit to relevant directories and professional communities, and ask 3 to 5 contacts for a link.
9. Add a Google Business Profile only if a real service location applies (the mailing address is virtual, so do not use it as an office).
10. Keep AI crawlers allowed and `llms.txt` up to date.

## 4. KPIs and review cadence

Review every 2 weeks and record in `SEO_BASELINE_AND_KPI_TRACKER.md`.

| KPI | Baseline (Oct 25) | 30 day target | 90 day target |
|---|---|---|---|
| Search impressions per week | about 12 | 100 | 1,000 |
| Clicks per week (excluding internal) | 0 | 5 | 50 |
| Queries in positions 1 to 20 | 3 | 8 | 25 |
| Key events (calls booked, forms, WhatsApp) | 0 tracked | tracking live | first 3 to 5 leads |
| Sitemap URLs indexed | 31 of 51 | 41 of 53 | all |
| Google organic sessions in GA4 | 0 | 10 | 150 |

Targets are guesses for a brand new domain. Adjust after the first 30 days of clean data.

Decision rules at each review:
- Query at positions 8 to 20: add depth, internal links, FAQ.
- High impressions, low CTR: rewrite title and description.
- Page indexed but 0 impressions after 30 days: check intent match and internal links.
- Page not indexed after 14 days: add links and request indexing.

## 5. Open questions

- Who bills Medicare and can review the CCM and PCM articles for accuracy before each ships?
