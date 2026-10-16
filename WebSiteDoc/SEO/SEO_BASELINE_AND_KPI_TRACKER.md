# SEO Baseline and KPI Tracker

**Site:** https://thezcs.com/
**Date:** 2026-10-16
**Author:** AI-generated plan (requires human review and verification)

---

## 1. Current Baseline (as of 2026-10-16)

### 1.1 Indexation

| Metric | Value | Source |
|---|---|---|
| Pages in sitemap.xml | 35 | sitemap.ts inspection |
| Pages indexed by Google | **0** | `site:thezcs.com` returned no results |
| Pages indexed by Bing | Unknown | No Bing Webmaster Tools access |
| Google Search Console verified | Unknown | No GSC access in this session |

**Critical finding:** A `site:thezcs.com` search on Google returns zero results. The site appears to have no Google index presence at all. This is the single highest-priority issue.

Possible causes:
- Sitemap not submitted to Google Search Console
- Google Search Console not verified for thezcs.com
- Site too new or too recently deployed for Google to have discovered it
- DNS or hosting misconfiguration blocking Googlebot
- Vercel deployment settings preventing indexing (check `x-robots-tag` headers)

### 1.2 Technical SEO (from crawlability audit 2026-10-16)

| Metric | Value |
|---|---|
| Total indexable pages | 35 |
| HTTP status (all pages) | 200 OK |
| www redirect | 308 to non-www |
| http redirect | 308 to https |
| Trailing slash redirect | 308 to no-trailing-slash |
| robots.txt | Allows all crawlers |
| Sitemap XML | Valid, 35 URLs |
| Canonical tags | Correct on all pages |
| Broken internal links | 0 |
| Orphan pages | 0 |
| Max click depth | 2 |
| JSON-LD structured data | Organization, WebSite, Service, BreadcrumbList, FAQPage, Article |
| llms.txt | Present and accessible |
| Visible breadcrumbs | Added 2026-10-16 (service, category, specialty, blog pages) |

### 1.3 Content Inventory

| Content type | Count | Notes |
|---|---|---|
| Homepage | 1 | Comprehensive, well-structured |
| Service category hubs | 3 | Care Management, RCM, Virtual Staffing |
| Individual service pages | 14 | CCM, PCM, RPM, RTM, TCM + 4 RCM + 5 Staffing |
| Who-we-serve specialty pages | 3 | Primary Care, Internal Medicine, Geriatrics |
| Blog posts | 3 | CPT 99490, In-House vs Outsourced CCM, HIPAA Checklist |
| Utility pages | 1 | ROI Calculator |
| Trust/compliance pages | 2 | HIPAA Compliance, About |
| Legal pages | 4 | Privacy, Terms, HIPAA Statement, Accessibility |
| Contact | 1 | WhatsApp + email + Calendly |
| FAQ | 1 | Marked up as FAQPage |
| **Total** | **35** | |

### 1.4 Search Performance

| Metric | Value | Notes |
|---|---|---|
| Organic clicks/month | **Unknown** | No GSC access |
| Organic impressions/month | **Unknown** | No GSC access |
| Average position | **Unknown** | No GSC access |
| CTR | **Unknown** | No GSC access |
| Referring domains | **Unknown** | No Ahrefs/Moz access |
| Organic conversions | **Unknown** | No analytics access |
| Calendly bookings/month | **Unknown** | No Calendly analytics access |

### 1.5 Brand Visibility

| Channel | Status |
|---|---|
| Google search for "thezcs.com" | No results found |
| Google search for "Zenith Care Solutions" | Returns unrelated companies (UK care providers, Zenith Technology Solutions) |
| LinkedIn Company Page | Listed at linkedin.com/company/zenith-care-solutions (link exists in site footer, page status unverified) |
| Google Business Profile | Not set up (per project docs) |
| Industry directories (Clutch, G2, Crunchbase) | Not listed |

---

## 2. Data and Account Access Needed

These are required before Day 1 execution can begin:

| Item | Priority | Why |
|---|---|---|
| Google Search Console verification | **Critical** | Cannot track indexing, impressions, queries, or submit sitemap without it |
| Bing Webmaster Tools verification | High | Second search engine for U.S. healthcare audience, also powers Bing Copilot |
| Vercel deployment headers check | **Critical** | Verify no `x-robots-tag: noindex` is being sent by Vercel |
| Google Analytics or Plausible setup | High | Cannot measure traffic, engagement, or conversion without it |
| Ahrefs or Semrush account (free tier) | Medium | Keyword position tracking and backlink monitoring |
| Calendly analytics access | Medium | Track booking conversions |
| Google Business Profile setup | Medium | Required for local/brand search presence |

---

## 3. KPIs and Targets

### 3.1 Leading Indicators (track weekly)

| KPI | Baseline | Day 30 Target | Day 60 Target |
|---|---|---|---|
| Pages indexed by Google | 0 | 25+ of 35 | 35 of 35 |
| Pages indexed by Bing | Unknown | 20+ | 35 |
| Sitemap processed without errors | Unknown | Yes | Yes |
| GSC "Valid" pages | 0 | 25+ | 35 |
| New blog posts published | 3 | 5-6 | 8-10 |
| Internal linking improvements shipped | 0 | Core batch done | All done |

### 3.2 Lagging Indicators (track monthly)

| KPI | Baseline | Day 30 Target | Day 60 Target |
|---|---|---|---|
| Organic impressions/month | 0 | 200+ | 1,000+ |
| Organic clicks/month | 0 | 20+ | 100+ |
| Branded search impressions | 0 | 50+ | 200+ |
| Top-20 keyword positions (commercial) | 0 | 3-5 keywords | 8-12 keywords |
| Referring domains | 0 | 3-5 | 8-12 |
| Calendly bookings from organic | 0 | Track baseline | 1-2 |

**Important caveats:**
- These targets assume the site gets indexed in the first week. If indexing is delayed due to a technical blocker, all targets shift.
- Organic traffic for a new domain in a competitive B2B niche typically takes 3-6 months to build meaningful volume. The Day 60 targets are early-stage indicators, not mature performance.
- Keyword position targets are qualitative (appearing in top 20 for any commercial term) rather than guaranteeing specific positions.

### 3.3 Quality Metrics

| KPI | Target |
|---|---|
| Core Web Vitals (all pages) | Pass |
| Mobile usability errors (GSC) | 0 |
| Structured data errors (GSC) | 0 |
| Crawl errors (GSC) | 0 |
| 404 pages in GSC coverage | 0 |

---

## 4. Weekly Review Checklist

Every Monday, check:

- [ ] GSC > Pages: any new "Not indexed" pages? Any crawl anomalies?
- [ ] GSC > Performance: impressions trend, new queries appearing, CTR
- [ ] GSC > Sitemaps: last processed date, any errors?
- [ ] GSC > Experience > Core Web Vitals: any regressions?
- [ ] Bing Webmaster Tools: index status, any issues?
- [ ] Content calendar: is this week's planned content on track?
- [ ] New backlinks acquired this week (check Ahrefs/Moz if available)

---

## 5. Day 30 Review Protocol

At Day 30, answer these questions:

1. **Indexing**: Are all 35 pages indexed? If not, which are missing and why?
2. **Impressions**: Which queries are generating impressions? Do they match target keywords?
3. **Content gap**: Are there queries appearing in GSC that don't have dedicated content?
4. **Technical**: Any crawl errors, structured data warnings, or Core Web Vitals failures?
5. **Competitor check**: Search top 5 target keywords. Who ranks? What do their pages look like?
6. **Content velocity**: Are we on track with the publishing calendar?
7. **Backlinks**: Any organic backlinks? From which sources?

**Decision point:** Based on Day 30 data, adjust the content calendar for Days 31-60. Double down on topics showing early traction. Deprioritize topics with no signal.

---

## 6. Day 60 Review Protocol

At Day 60, answer these questions:

1. **Ranking progress**: How many target keywords are in the top 20? Top 50?
2. **Traffic**: What is the organic click trend line? Growing, flat, or declining?
3. **Conversion**: Any Calendly bookings attributed to organic search?
4. **Content performance**: Which pages get the most impressions? Clicks? Highest CTR?
5. **AI visibility**: Does searching Zenith's core topics in Perplexity/ChatGPT surface thezcs.com content?
6. **Authority**: How many referring domains? From what quality of sources?
7. **Next 60 days**: What should the Days 61-120 plan prioritize?

**Deliverable:** A short "SEO Month 2 Report" summarizing findings and the updated plan for the next period.
