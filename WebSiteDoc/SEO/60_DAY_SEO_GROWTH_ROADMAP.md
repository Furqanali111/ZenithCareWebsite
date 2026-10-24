# 60-Day SEO and AI Search Ranking Growth Roadmap

**Site:** https://thezcs.com/
**Date:** 2026-10-16
**Status:** Plan only. Do not execute until reviewed and approved.

---

## Executive Summary

thezcs.com has 35 well-built pages with solid technical SEO (correct robots.txt, sitemap, canonicals, JSON-LD, breadcrumbs, llms.txt) but **zero Google index presence**. The site does not appear in any Google search results. This roadmap addresses that critical gap first, then builds organic visibility through content, internal linking, and off-page foundations.

**The single most important action:** verify Google Search Console and confirm Vercel is not blocking indexing. Everything else is secondary until the site is indexable.

---

## Companion Documents

| Document | Purpose |
|---|---|
| [SEO_BASELINE_AND_KPI_TRACKER.md](SEO_BASELINE_AND_KPI_TRACKER.md) | Current metrics baseline, KPI targets, weekly review checklist |
| [KEYWORD_TO_URL_MAP.md](KEYWORD_TO_URL_MAP.md) | Every target keyword mapped to its URL, with gap analysis |
| [INTERNAL_LINKING_PLAN.md](INTERNAL_LINKING_PLAN.md) | Specific links to add, with source, destination, and anchor text |
| [60_DAY_CONTENT_CALENDAR.md](60_DAY_CONTENT_CALENDAR.md) | Week-by-week publishing schedule with outlines and CTAs |

---

## Phase 1: Foundation (Days 1-7)

**Goal:** Get the site indexed and measurable. Nothing else matters until this is done.

### Day 1-2: Indexing and Verification

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 1.1 | Verify Google Search Console for thezcs.com | Site owner | 30 min | GSC property verified |
| 1.2 | Submit sitemap.xml in GSC | Site owner | 5 min | Sitemap status: "Success" |
| 1.3 | Request indexing for homepage via URL Inspection | Site owner | 10 min | Indexing requested |
| 1.4 | Check Vercel deployment headers: `curl -I https://thezcs.com` | Developer | 15 min | Confirm no `x-robots-tag: noindex` |
| 1.5 | Verify Vercel project is deployed from Production branch | Developer | 10 min | Production deployment confirmed |
| 1.6 | Verify Bing Webmaster Tools (import from GSC) | Site owner | 15 min | Bing WMT verified, sitemap submitted |

**Checkpoint:** If `x-robots-tag: noindex` is found, fix it immediately. This single header can explain the entire zero-index situation.

### Day 3-4: Analytics and Measurement

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 1.7 | Install Plausible Analytics (or Vercel Analytics) | Developer | 30 min | Analytics tracking live |
| 1.8 | Verify analytics fires on all page types (home, service, blog, legal) | Developer | 15 min | All pages tracked |
| 1.9 | Request indexing for category hubs and top 5 service pages in GSC | Site owner | 15 min | 8 URLs submitted for indexing |

### Day 5-7: Priority Indexing Requests

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 1.10 | Request indexing for remaining service pages in GSC | Site owner | 20 min | All 14 service pages submitted |
| 1.11 | Request indexing for blog posts and utility pages | Site owner | 10 min | All 35 URLs submitted |
| 1.12 | Verify robots.txt and sitemap are accessible from GSC | Site owner | 5 min | No crawl errors |

**Phase 1 Exit Criteria:**
- GSC verified, sitemap processed, no errors
- Bing WMT verified
- Analytics live on all pages
- No `x-robots-tag: noindex` headers
- All 35 URLs submitted for indexing

---

## Phase 2: On-Page Optimization + Internal Linking (Days 8-21)

**Goal:** Optimize existing pages for target keywords and connect content through internal links.

### Days 8-10: Title and Meta Optimization + Blog Link Injection

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 2.1 | Update homepage title to include "Services" and target keywords | Developer | 10 min | Title updated |
| 2.2 | Update homepage meta description to mention CCM, RPM, billing, staffing | Developer | 10 min | Meta updated |
| 2.3 | Review and optimize titles for all 14 service pages (under 60 chars, include primary keyword) | Developer | 2 hrs | All service titles optimized |
| 2.4 | Add internal links from CPT 99490 article to CCM service page, ROI calculator, care management hub | Developer | 30 min | 3 links added (see Internal Linking Plan, Batch 1) |
| 2.5 | Add internal links from In-House vs Outsourced article to CCM service, About, Contact | Developer | 30 min | 3 links added |
| 2.6 | Add internal links from HIPAA Checklist article to HIPAA Compliance page, CCM service | Developer | 20 min | 2 links added |
| 2.7 | Add "Last updated" visible date to all 3 blog posts | Developer | 30 min | Freshness signals added |

### Days 11-14: Service-to-Blog Links + Cross-Links

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 2.8 | Add links from CCM service page to CPT 99490 article, In-House vs Outsourced article, HIPAA Checklist | Developer | 30 min | 3 links added (Internal Linking Plan, Batch 2) |
| 2.9 | Add link from care management hub to CPT 99490 article | Developer | 10 min | 1 link added |
| 2.10 | Update `SITE_LAST_UPDATED` in sitemap.ts to reflect content changes | Developer | 2 min | Sitemap freshness updated |

### Days 15-18: Cross-Category Links

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 2.11 | Add cross-category links per Internal Linking Plan, Batch 3 (CCM to billing, billing to CCM, coding to CCM, scribe to CCM, primary care to billing and staffing) | Developer | 1 hr | 6 contextual cross-links added |

### Days 19-21: Footer Enhancement + First Content Check

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 2.12 | Add "Who We Serve" links to site footer (Primary Care, Internal Medicine, Geriatrics) | Developer | 30 min | Footer updated |
| 2.13 | Check GSC: how many pages indexed so far? Any crawl errors? | Site owner | 15 min | GSC status documented |
| 2.14 | Check GSC Performance: any impressions or queries appearing? | Site owner | 10 min | Early data noted |

**Phase 2 Exit Criteria:**
- All page titles optimized for target keywords
- 8+ blog-to-service internal links added
- 4+ service-to-blog links added
- 6+ cross-category contextual links added
- Footer includes Who We Serve links
- First GSC data check completed

---

## Phase 3: Content Publishing (Days 15-56)

**Goal:** Publish 7 new articles targeting identified content gaps, at 1 per week.

Content creation runs in parallel with Phase 2 on-page work starting Day 15.

| Week | Days | Article | Primary Keyword | Status |
|---|---|---|---|---|
| 3 | 15-21 | CCM vs. RPM vs. PCM: Which Care Management Program Fits Your Panel? | ccm vs rpm vs pcm | Publish Day 18 |
| 4 | 22-28 | How Chronic Care Management Billing Actually Works | how does ccm billing work | Publish Day 25 |
| 5 | 29-35 | Documenting CCM Consent: What CMS Actually Requires in 2026 | ccm consent requirements | Publish Day 32 |
| 6 | 36-42 | CPT 99439 vs. 99490: Base and Add-On Code Explained | 99439 vs 99490 | Publish Day 39 |
| 7 | 43-49 | CCM Time Tracking: What Auditors Actually Check | ccm time tracking | Publish Day 46 |
| 8 | 50-56 | Medical Billing Outsourcing: What to Know Before You Switch | medical billing outsourcing | Publish Day 53 |
| 9 | 57-60 | ChartSpan Alternatives (conditional on verified data) | chartspan alternatives | Publish Day 58 |

**Per-article checklist (applies to every new article):**

- [ ] Clinical/billing review before publishing (do not publish unsupported compliance or reimbursement claims)
- [ ] Title under 60 characters, includes primary keyword
- [ ] Meta description under 155 characters, includes primary keyword
- [ ] Article schema (JSON-LD) added
- [ ] At least 2 internal links TO service pages
- [ ] At least 1 internal link TO another article
- [ ] At least 1 service page updated to link TO this article
- [ ] Question-based H2 structure (AI-search friendly)
- [ ] Comparison table where applicable (AI citation target)
- [ ] CTA linking to `/contact` or Calendly booking
- [ ] No fabricated statistics, customer results, or case studies
- [ ] Submit URL for indexing in GSC after publishing

See [60_DAY_CONTENT_CALENDAR.md](60_DAY_CONTENT_CALENDAR.md) for full outlines, sources, and link targets per article.

---

## Phase 4: Off-Page and Brand Presence (Days 15-45)

**Goal:** Build foundational referring domains and anchor brand search results.

### Days 15-21: Google Business Profile

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 4.1 | Create Google Business Profile for Zenith Care Solutions | Site owner | 1 hr | GBP created |
| 4.2 | Add services, hours, website URL, description | Site owner | 30 min | GBP complete |
| 4.3 | Begin address verification process | Site owner | 10 min | Verification in progress |

### Days 22-30: LinkedIn and Directory Listings

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 4.4 | Complete LinkedIn Company Page (description, services, logo, URL) | Site owner | 1 hr | LinkedIn page complete |
| 4.5 | Post first LinkedIn article (repurpose CCM vs RPM vs PCM content) | Content | 30 min | First LinkedIn post live |
| 4.6 | List on Clutch.co | Site owner | 30 min | Clutch profile created |
| 4.7 | List on Crunchbase | Site owner | 30 min | Crunchbase profile created |

### Days 30-45: Ongoing LinkedIn + Directory

| # | Task | Owner | Effort | Deliverable |
|---|---|---|---|---|
| 4.8 | Post 1-2 LinkedIn updates per week (repurpose blog content) | Content | 30 min/week | Consistent LinkedIn presence |
| 4.9 | Identify 2-3 healthcare service directories for listing | Site owner | 1 hr | Directory listings submitted |
| 4.10 | Monitor GBP verification and complete setup when verified | Site owner | 15 min | GBP fully verified |

**Phase 4 Exit Criteria:**
- Google Business Profile created and verification in progress
- LinkedIn Company Page complete with 4+ posts
- 3-5 directory listings submitted (Clutch, Crunchbase, healthcare directories)

---

## Phase 5: AI Search Optimization (Ongoing, Days 1-60)

**Goal:** Ensure content is structured for citation by AI search engines (Perplexity, ChatGPT, Bing Copilot, Google AI Overviews).

The site already has several AI-friendly elements in place:
- `llms.txt` at `/llms.txt` with full service listing and AI crawler notes
- Robots.txt allows all crawlers (including GPTBot, ClaudeBot, PerplexityBot)
- JSON-LD structured data on all pages
- FAQ schema with question-answer pairs

### Ongoing AI-SEO Tasks

| # | Task | Frequency | Notes |
|---|---|---|---|
| 5.1 | Use question-based H2s in every new article | Per article | "How does CCM billing work?" not "CCM Billing Process" |
| 5.2 | Include comparison tables in relevant articles | Per article | Tables are highly cited by AI engines |
| 5.3 | Write self-contained paragraphs that answer one question each | Per article | AI engines extract individual paragraphs |
| 5.4 | Cite CMS.gov and other authoritative sources | Per article | AI engines prioritize sourced content |
| 5.5 | Update llms.txt when new service pages or major content is added | As needed | Keep the AI-readable index current |
| 5.6 | Test AI search visibility monthly: search core topics in Perplexity, ChatGPT, Bing Copilot | Monthly | Track whether thezcs.com content appears in AI answers |

---

## Day 30 Checkpoint

**Date:** ~Day 30 from start

### Review Questions

1. **Indexing:** How many of 35 pages are indexed? (Target: 25+)
2. **Impressions:** Which queries generate impressions in GSC?
3. **Content gaps:** Are searchers finding the site for queries we lack content for?
4. **Technical health:** Any crawl errors, structured data warnings, CWV failures?
5. **Content velocity:** Are we on track with the publishing calendar? (Target: 2 new articles + 3 refreshes done)
6. **Backlinks:** Any organic backlinks appearing?
7. **AI visibility:** Does searching core topics in Perplexity or ChatGPT surface thezcs.com?

### Decisions at Day 30

- If indexing is below 15 pages: investigate technical blockers (check Vercel, DNS, server headers in detail)
- If a specific content topic shows early traction (impressions > clicks): optimize that page's title and meta for CTR
- If a planned article topic shows zero search demand in GSC data: consider replacing it with a topic that shows impressions
- If LinkedIn posts drive profile visits but no website traffic: add stronger CTAs and links in posts

---

## Day 60 Checkpoint

**Date:** ~Day 60 from start

### Review Questions

1. **Ranking progress:** How many target keywords in top 20? Top 50?
2. **Traffic:** Organic click trend line (growing, flat, declining)?
3. **Conversion:** Any Calendly bookings from organic search?
4. **Content performance:** Which pages get the most impressions? Clicks? Best CTR?
5. **AI visibility:** Does thezcs.com appear in AI search answers for CCM/billing topics?
6. **Authority:** How many referring domains? Quality?
7. **Next period:** What should Days 61-120 prioritize?

### KPI Targets (see Baseline Tracker for full detail)

| Metric | Day 30 Target | Day 60 Target |
|---|---|---|
| Pages indexed (Google) | 25+ of 35 | 35 of 35 |
| Organic impressions/month | 200+ | 1,000+ |
| Organic clicks/month | 20+ | 100+ |
| Top-20 keyword positions | 3-5 keywords | 8-12 keywords |
| Referring domains | 3-5 | 8-12 |
| New articles published | 2 | 7 |

**Important:** These are early-stage indicators for a brand-new domain. Meaningful organic traffic in a competitive B2B healthcare niche typically takes 3-6 months. The Day 60 targets measure whether the foundation is working, not whether the site has reached maturity.

---

## What This Plan Does NOT Cover

| Item | Why | When to Revisit |
|---|---|---|
| State-specific landing pages (FL, TX, CA, AZ) | Risk of thin doorway pages without traffic data | Month 3+, after GSC shows geographic demand |
| Paid search (Google Ads) | Organic foundation first | Month 3 if organic traction is too slow for high-intent CCM keywords |
| Case studies | Require real client data and permission | When first client engagement completes |
| Video content | Lower priority than written content for search | When brand has traction and team capacity |
| Link building outreach | Premature for a new domain with no content authority | Month 3+, after 10+ articles published |
| EHR-specific integration guides | Good topic, lower priority | Month 3+, as a content cluster expansion |
| Pricing page | Custom per practice, a page would be too vague or misleading | Not planned |

---

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Vercel `x-robots-tag: noindex` blocking indexing | Critical: explains zero-index state | Day 1 priority: check headers immediately |
| GSC verification delayed (DNS propagation, domain ownership) | High: blocks all measurement | Have domain registrar credentials ready; use HTML file upload as fallback |
| Content publishing falls behind 1/week cadence | Medium: delays traffic growth | Have 2 articles drafted ahead; clinical review is the bottleneck, schedule it weekly |
| Google does not index pages despite correct technical setup | Medium: new domain delay | Submit individual URLs via URL Inspection; build backlinks from directories to signal importance |
| Competitor content outranks new articles | Medium: expected for a new domain | Focus on depth, accuracy, and unique comparison tables; do not compete on domain authority yet |
| Medical/billing content contains inaccuracies | High: compliance and trust risk | Every article with CPT codes, eligibility, or consent requirements must pass clinical/billing review before publishing |

---

## Weekly Cadence (After Phase 1)

| Day | Activity | Time |
|---|---|---|
| Monday | Check GSC (index status, impressions, errors), check analytics | 15 min |
| Tuesday-Thursday | Write or review that week's article | 4-6 hrs total |
| Friday | Publish article, submit URL in GSC, add internal links, update sitemap date | 1 hr |
| Friday | Post LinkedIn update (repurpose article) | 30 min |

**Total weekly time commitment:** ~6-8 hours (writing, review, publishing, monitoring)

---

## Ownership

| Role | Responsibilities |
|---|---|
| **Site owner** | GSC/Bing WMT verification, GBP setup, directory listings, content approval, LinkedIn posting |
| **Developer** | Title/meta updates, internal link implementation, footer changes, analytics setup, sitemap updates, article page creation |
| **Content/clinical reviewer** | Review every article for accuracy before publishing (CPT codes, eligibility, consent, billing workflows) |

---

## How to Use This Plan

1. **Start with Phase 1.** Do not skip to content or off-page work until the site is indexable and measurable.
2. **Follow the companion documents** for specific implementation details (which links to add, which keywords target which URLs, what to write each week).
3. **Use the weekly cadence** to maintain momentum without overwhelming a small team.
4. **Check in at Day 30 and Day 60** using the review protocols in the Baseline Tracker.
5. **Adjust based on data.** If GSC shows unexpected queries or zero traction on a planned topic, pivot. The content calendar is a guide, not a contract.
