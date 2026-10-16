# SEO Priorities and Quick Wins

**Site:** https://thezcs.com/
**Date:** 2026-10-16

---

## Critical (Must Do Immediately, Days 1-3)

### 1. Verify Google Search Console and submit sitemap

**Evidence:** `site:thezcs.com` returns zero results. The site has no Google index presence.

**Action:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for `https://thezcs.com`
3. Verify ownership (DNS TXT record via Vercel, or HTML file upload)
4. Submit `https://thezcs.com/sitemap.xml`
5. Use URL Inspection tool to request indexing for the homepage, all 3 category hubs, and the top 5 service pages

**Effort:** 30 minutes
**Verification:** GSC shows "Sitemap submitted" status and pages begin appearing in "Pages" report

### 2. Verify Bing Webmaster Tools and submit sitemap

**Evidence:** No Bing presence confirmed; Bing powers Bing Copilot AI answers.

**Action:**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Import from GSC or verify separately
3. Submit sitemap

**Effort:** 15 minutes

### 3. Check Vercel deployment for indexing blockers

**Evidence:** Zero Google index is unusual for a site that has been deployed. Possible `x-robots-tag: noindex` header from Vercel preview/branch deployments.

**Action:**
1. Check if thezcs.com is deployed from a Vercel "Production" branch or a preview deployment
2. Run `curl -I https://thezcs.com` and check for `x-robots-tag` headers
3. Verify Vercel project settings: "Production Branch" must be the branch deploying to thezcs.com
4. Check Vercel > Settings > General > "Search Engine Indexing" (some plans block preview URLs)

**Effort:** 15 minutes
**Verification:** No `noindex` headers; Vercel confirms production deployment

### 4. Set up web analytics

**Evidence:** No traffic measurement exists. Cannot assess any future progress without it.

**Action:** Install Plausible Analytics or Vercel Analytics. Plausible is preferred (cookieless, no consent banner needed, simpler for small sites).

**Effort:** 30 minutes

---

## High Priority (Days 4-14)

### 5. Optimize homepage title and meta description

**Current title:** "Care Management, Billing & Virtual Staffing | Zenith Care Solutions"
**Issue:** Does not include primary commercial keyword. No one searches for "Care Management, Billing & Virtual Staffing".

**Recommended title:** "Outsourced Care Management, Billing & Staffing for Medical Practices | Zenith Care Solutions"
**Recommended meta:** "Zenith Care Solutions provides CCM, RPM, medical billing, coding, and virtual staffing for U.S. physician practices. HIPAA Business Associate. Your practice stays the billing provider."

**Effort:** 10 minutes
**Impact:** Homepage is the highest-authority page; its title affects brand and category rankings

### 6. Optimize service page titles for search intent

**Current pattern:** Uses service name but may not match how buyers search.

**Review and update these pages:**
- `/services/chronic-care-management`: Ensure title includes "outsourced" or "services for practices"
- `/services/medical-billing`: Ensure title includes "for medical practices" or "physician practices"
- All 14 service pages: Confirm each title is under 60 chars and includes the primary keyword from the keyword map

**Effort:** 1-2 hours across all pages
**Impact:** Title tag is the strongest on-page ranking signal

### 7. Add contextual links from blog posts to service pages

**Evidence:** Blog posts about CCM (CPT 99490 article, in-house vs outsourced, HIPAA checklist) do not link to `/services/chronic-care-management`.

**Action:** See Internal Linking Plan, Batch 1. Add 2-3 natural contextual links per blog post.

**Effort:** 30 minutes per post (1.5 hours total)
**Impact:** Passes link equity from informational content to commercial pages; improves user journey

### 8. Add service-to-blog contextual links

**Evidence:** Service pages have no links to supporting blog content.

**Action:** See Internal Linking Plan, Batch 2. Add 1-2 links from CCM service page to related blog posts.

**Effort:** 30 minutes
**Impact:** Keeps visitors engaged; signals topical authority to search engines

### 9. Update sitemap lastModified date

**Current:** All pages use `2026-10-13` as lastModified.
**Issue:** After adding breadcrumbs and related services (2026-10-16), the date should reflect the content change.

**Action:** Update `SITE_LAST_UPDATED` in `sitemap.ts` to `2026-10-16`.

**Effort:** 2 minutes
**Impact:** Signals freshness to crawlers, encourages recrawl of updated pages

---

## Medium Priority (Days 15-30)

### 10. Publish "CCM vs RPM vs PCM" comparison article

**Evidence:** This is the single most valuable new content piece. Searchers comparing care management programs have high commercial intent and no dedicated page exists.

**Action:** Write 1,500-2,000 word comparison guide with a clear table and links to all 5 care management service pages.

**Effort:** 4-6 hours (writing + review)
**Impact:** Captures comparison searches, links to 5 service pages, strong AI citation candidate

### 11. Publish "How CCM Billing Works" guide

**Evidence:** Core buyer question. The existing CPT 99490 article covers rates but not the end-to-end billing workflow.

**Action:** Write step-by-step guide covering eligibility verification, consent, time tracking, claim submission, and reimbursement. Link to CCM service page and ROI calculator.

**Effort:** 4-6 hours
**Impact:** Answers the single most common question from practices evaluating CCM

### 12. Set up Google Business Profile

**Evidence:** Brand search for "Zenith Care Solutions" returns unrelated UK companies. A GBP with U.S. address would anchor the brand in Google's Knowledge Panel.

**Action:** Create GBP with verified U.S. address (Wyoming LLC address or virtual office). Add services, hours, website URL.

**Effort:** 1 hour (plus address verification wait time)
**Impact:** Establishes brand presence, improves "Zenith Care Solutions" search results

### 13. Create LinkedIn Company Page content

**Evidence:** LinkedIn page exists but content status is unknown. LinkedIn profiles rank well for brand searches and are a trust signal.

**Action:** Complete company page with description, services, logo. Post 1-2 times per week about care management topics.

**Effort:** 2 hours setup + 30 min/week ongoing
**Impact:** Builds referring domain, improves brand search results

---

## Low Priority (Days 30-60)

### 14. Add "Who We Serve" links to footer

**Evidence:** Specialty pages are in the header nav but not the footer. Adds sitewide link equity.

**Effort:** 15 minutes

### 15. Add visible "last updated" dates to service pages

**Evidence:** AI search engines and Google prioritize fresh content. Service pages show no date.

**Effort:** 1-2 hours (component + data)

### 16. Publish remaining content calendar articles

**Evidence:** See content calendar for full schedule.

### 17. Submit to healthcare directories

**Evidence:** Zero referring domains. Need foundational backlinks from legitimate sources.

**Action:** List on Clutch, Crunchbase, and relevant healthcare service directories (not link farms).

**Effort:** 2-3 hours
**Impact:** 3-5 referring domains from trusted sources

---

## Top 10 Actions by Impact (Ordered)

| # | Action | Type | Effort | Business Impact |
|---|---|---|---|---|
| 1 | Verify GSC + submit sitemap | Technical | 30 min | **Critical**: site has zero index presence |
| 2 | Check Vercel for indexing blockers | Technical | 15 min | **Critical**: may explain why site is not indexed |
| 3 | Verify Bing Webmaster Tools | Technical | 15 min | High: second search engine + AI search |
| 4 | Set up analytics | Technical | 30 min | High: no measurement = no optimization |
| 5 | Optimize homepage title + meta | On-page | 10 min | High: strongest page, weak current title |
| 6 | Add blog-to-service internal links | Linking | 1.5 hrs | High: connect content to commercial pages |
| 7 | Publish CCM vs RPM vs PCM article | Content | 5 hrs | High: captures comparison searches |
| 8 | Publish How CCM Billing Works guide | Content | 5 hrs | High: core buyer question |
| 9 | Optimize 14 service page titles | On-page | 2 hrs | Medium-High: every title is a ranking signal |
| 10 | Set up Google Business Profile | Off-page | 1 hr | Medium: brand presence anchor |

---

## Top 5 Existing Pages to Improve First

| # | Page | Current Issue | Fix |
|---|---|---|---|
| 1 | Homepage (`/`) | Title does not include "outsourced" or target keyword | Update title and meta description |
| 2 | `/services/chronic-care-management` | No links to/from blog content | Add contextual links to CPT 99490 article, in-house vs outsourced article |
| 3 | `/resources/cpt-99490-2026` | No link to CCM service page or ROI calculator | Add 2-3 contextual internal links |
| 4 | `/resources/in-house-vs-outsourced-ccm` | No link to CCM service page | Add contextual link in outsourcing discussion |
| 5 | `/services/medical-billing` | No supporting blog content | Prioritize medical billing outsourcing guide article |

---

## Work to Postpone

| Item | Why Postpone |
|---|---|
| State-specific landing pages (FL, TX, CA, AZ) | Too early; need organic traffic baseline first. Risk of thin doorway pages. Revisit Month 3+ |
| Competitor comparison pages (ChartSpan, CareHarmony) | Need verified differentiators and fair comparison data. Publish after core content is strong. |
| Case studies | Blocked by real client engagement. Cannot fabricate. |
| Video content | Lower priority than written content for search. Revisit when brand has traction. |
| Paid advertising | Focus on organic foundation first. Consider Google Ads for high-intent CCM keywords in Month 3 if organic is too slow. |
