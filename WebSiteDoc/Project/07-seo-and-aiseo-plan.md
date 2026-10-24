# SEO & AI-SEO Plan

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

The marketing site has one business job: show up when a U.S. practice decision-maker is researching outsourced CCM. This doc is the strategy for both classical SEO (Google / Bing search results) and AI-SEO (Google AI Overviews, Perplexity, ChatGPT browse, Claude).

---

## 1. Strategy in one paragraph

Rank for a tight cluster of **high-intent commercial keywords** (practices actively shopping for CCM vendors) and a wider cluster of **informational long-tail queries** (practice managers researching CCM mechanics). Win trust by writing content a credentialed clinician (PharmD) would publish — specific, cited, structured — because that same specificity is what LLMs quote back when they answer a user's question. Content type and schema markup matter more than keyword density.

---

## 2. Keyword clusters

### Cluster A — "Buy intent" (10 pages' worth of targeting; highest value)

| Keyword | Est. monthly US volume | Target page |
|---|---|---|
| chronic care management services | 1.3K | `/services/chronic-care-management` |
| ccm services for physicians | 300 | `/services/chronic-care-management` |
| outsourced chronic care management | 500 | `/services/chronic-care-management` |
| ccm vendor | 200 | `/services/chronic-care-management` |
| chronic care management company | 400 | `/` (home) |
| chronic care management for primary care | 150 | `/who-we-serve/primary-care` |
| chronic care management internal medicine | 100 | `/who-we-serve/internal-medicine` |
| chronic care management geriatrics | 70 | `/who-we-serve/geriatrics` |
| hipaa compliant ccm service | 90 | `/hipaa-compliance` |
| ccm roi calculator | 80 | `/roi-calculator` |

### Cluster B — "Research intent" (blog content; feeds AI-SEO)

| Keyword | Target article |
|---|---|
| cpt 99490 | "CPT Code 99490: Reimbursement, Requirements, and 2026 Rates" |
| cpt 99490 reimbursement 2026 | same |
| cpt 99439 vs 99490 | "99439 vs 99490: Base and Add-On Codes Explained" |
| complex ccm 99487 99489 | "Complex CCM (99487 / 99489): Which Patients Qualify" |
| how does chronic care management billing work | "How CCM Billing Actually Works (Step by Step)" |
| ccm patient consent requirements | "Documenting CCM Consent: What CMS Actually Requires" |
| ccm vs rpm | "CCM vs. RPM vs. PCM: Which Program Fits Your Panel" |
| chartspan alternative | "ChartSpan Alternatives: 5 Vendors to Shortlist in 2026" |
| careharmony vs chartspan | "CareHarmony vs. ChartSpan: Honest Comparison" |
| in-house vs outsourced ccm | "In-House vs. Outsourced CCM: True Cost for a 200-Patient Panel" |
| ccm time tracking requirements | "CCM Time Tracking: What Auditors Actually Check" |
| ccm medicare advantage | "CCM Under Medicare Advantage: What's Different" |

### Cluster C — Local / geographic (practice-manager searches)

Create a lightweight page per state in the top 5 target states (FL, TX, AZ, CA, NC) later. Not v1 — defer to month 3.

---

## 3. On-page SEO rules (apply to every page)

- Exactly one `<h1>` matching the primary keyword naturally
- `<title>`: primary keyword + brand, ≤ 60 chars
- Meta description: 140–160 chars, benefit-oriented, includes a number
- URL: short, keyword-first, kebab-case, no stop words (`/services/chronic-care-management` not `/our-services/the-chronic-care-management-service`)
- First 100 words include the primary keyword and the target reader ("practice manager", "primary care")
- At least 2 internal links out, at least 1 external link to an authoritative source (CMS.gov, HHS, AMA)
- Last-updated date visible on page
- Image `alt` text descriptive, not keyword-stuffed
- Breadcrumb nav on all non-home pages (+ `BreadcrumbList` JSON-LD)

---

## 4. Schema.org JSON-LD per page type

Centralize in `lib/seo.ts`. Emit as `<script type="application/ld+json">` from the page's layout.

### Home (`/`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Zenith Care Solutions",
      "url": "https://zenithcaresolutions.com",
      "logo": "https://zenithcaresolutions.com/logo.png",
      "sameAs": ["https://www.linkedin.com/company/zenith-care-solutions"]
    },
    {
      "@type": "MedicalBusiness",
      "name": "Zenith Care Solutions",
      "medicalSpecialty": ["Primary Care", "Internal Medicine", "Geriatric Medicine"],
      "areaServed": { "@type": "Country", "name": "United States" }
    }
  ]
}
```

### Services page (`/services/chronic-care-management`)
```json
{
  "@type": "Service",
  "serviceType": "Chronic Care Management",
  "provider": { "@type": "Organization", "name": "Zenith Care Solutions" },
  "areaServed": { "@type": "Country", "name": "United States" },
  "audience": { "@type": "MedicalAudience", "audienceType": "Physician" }
}
```

### About (`/about`)
```json
{
  "@type": "Person",
  "name": "Ali Hassan Kaleem",
  "jobTitle": "Founder, Zenith Care Solutions",
  "alumniOf": "...",
  "knowsAbout": ["Chronic Care Management", "Clinical Pharmacy", "Oncology", "Medicare Billing"],
  "sameAs": ["https://www.linkedin.com/in/...", "https://www.doximity.com/..."]
}
```

### Blog post (`/resources/[slug]`)
```json
{
  "@type": "Article",
  "headline": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": { "@type": "Person", "name": "Ali Hassan Kaleem, PharmD" },
  "publisher": { "@type": "Organization", "name": "Zenith Care Solutions" },
  "mainEntityOfPage": "https://zenithcaresolutions.com/resources/..."
}
```

### FAQ (`/faq`)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

Validate every page with Google's Rich Results Test before shipping.

---

## 5. AI-SEO (Google AI Overviews, Perplexity, ChatGPT, Claude)

LLMs crawl differently from Google. They favor **declarative, structured, cited content** and penalize JS-heavy pages they can't parse. Rules:

1. **Server-render every content page.** No critical text behind client-only React, no accordions that collapse the answer, no "read more" that hides content from a one-shot crawl.
2. **Ship `/llms.txt`** at the site root — a markdown index that tells AI crawlers where to look. Format:
    ```
    # Zenith Care Solutions
    > Remote Chronic Care Management services for U.S. primary care and internal medicine practices.

    ## Core pages
    - [Services](https://zenithcaresolutions.com/services/chronic-care-management): what we do, CPT codes, billing
    - [About](https://zenithcaresolutions.com/about): founder credentials
    - [HIPAA Compliance](https://zenithcaresolutions.com/hipaa-compliance): compliance posture
    - [FAQ](https://zenithcaresolutions.com/faq): common questions

    ## Articles
    - [CPT 99490 in 2026](https://zenithcaresolutions.com/resources/cpt-99490-reimbursement-2026)
    ...
    ```
3. **Phrase section headings as questions** when natural: *"How much does CCM reimburse per patient?"* instead of *"Reimbursement Overview"*. Matches how users phrase queries to AI assistants.
4. **Self-contained paragraphs**. Every paragraph should be quotable without needing context from the previous one. LLMs grab one snippet at a time.
5. **Cite primary sources inline**. Link out to CMS.gov, Federal Register, AMA CPT publications. LLMs weight content linking to authoritative sources higher.
6. **Author attribution with credentials** on every article (`Ali Hassan Kaleem, PharmD`). E-E-A-T signal that AI models now explicitly check for.
7. **Comparison tables** of vendors / codes / approaches — LLMs excerpt these verbatim.
8. **Last-updated date** prominent on every page. LLMs filter out stale content.
9. **FAQ page is marked up as `FAQPage`** — Google AI Overviews pull directly from this schema.
10. **Don't block AI crawlers.** `robots.txt` should allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `CCBot`, `Google-Extended`. Blocking is a business mistake for a top-of-funnel service.

---

## 6. Off-page SEO (do these in the first 90 days post-launch)

- **Google Business Profile** — set up with the U.S. virtual mailing address once formation is complete
- **LinkedIn Company Page** — fully filled, 2 posts/week minimum
- **Doximity** — Ali's physician-adjacent profile; link back to the site
- **Clutch** — list Zenith as a healthcare services provider; collect first client review
- **Crunchbase** — basic company entry (free tier)
- **G2** — list under "Chronic Care Management Software" category (even as services, you can appear)
- **GitHub Pages / Dev.to** — not relevant for this audience
- **HARO (Help a Reporter Out)** / **Qwoted** — Ali signs up as a source for "clinical pharmacist" and "chronic care management" queries. One quote in a healthcare publication = 1 solid backlink
- **Guest posts** on practice-management blogs (`PhysicianPractice.com`, `MedicalEconomics.com`, `Becker's Hospital Review`) — target 1 per quarter

---

## 7. Content calendar — first 90 days

### Pre-launch (Weeks 1–4)
- Write and ship the 3 seed posts listed in Phase 3 of the implementation plan

### Month 1 post-launch — publish weekly
- "99439 vs 99490: Base and Add-On Codes Explained"
- "Documenting CCM Consent: What CMS Actually Requires"
- "ChartSpan Alternatives: 5 Vendors to Shortlist in 2026"
- "CCM Time Tracking: What Auditors Actually Check"

### Month 2 — publish weekly
- "CareHarmony vs. ChartSpan: Honest Comparison"
- "CCM vs. RPM vs. PCM: Which Program Fits Your Panel"
- "How CCM Billing Actually Works (Step by Step)"
- "CCM Under Medicare Advantage: What's Different"

### Month 3 — publish weekly
- "In-House vs. Outsourced CCM: True Cost for a 200-Patient Panel"
- "Setting Up a CCM Workflow Inside Athena / eClinicalWorks / Elation"
- "The HIPAA Checklist for Partnering with an Outsourced CCM Vendor"
- Case study (first signed client — anonymized if needed)

Each post: 1,200–1,800 words, author bio, 2+ internal links, 2+ external citations, hero image, schema.

---

## 8. Technical SEO checklist (ship before launch)

- [ ] Sitemap.xml generated and accessible at `/sitemap.xml`
- [ ] robots.txt at `/robots.txt` — allows all, points to sitemap
- [ ] `llms.txt` at root
- [ ] All pages return 200 for canonical URL, 301 for `www` → apex
- [ ] HTTPS enforced; HSTS header set
- [ ] No broken internal links (run `linkinator` in CI)
- [ ] All images have `alt` attributes
- [ ] Core Web Vitals all green (Lighthouse)
- [ ] Mobile-friendly (Google Mobile-Friendly Test passes)
- [ ] Google Search Console verified; sitemap submitted
- [ ] Bing Webmaster Tools verified; sitemap submitted
- [ ] No duplicate titles / descriptions across pages
- [ ] 404 page returns actual 404 status (not 200)
- [ ] JSON-LD passes Rich Results Test for every page type

---

## 9. Measurement

Track these monthly in a simple sheet:

| Metric | Where | Target by month 6 |
|---|---|---|
| Organic sessions | Plausible | 500+/mo |
| Pages indexed in Google | Search Console | ≥ 95% of sitemap |
| Impressions | Search Console | 5K+/mo |
| Average position for cluster A keywords | Search Console | top 20 |
| Clicks from AI Overviews | Search Console (new report) | track for baseline |
| Referring domains | Ahrefs/Moz free tier | 15+ |
| Calendly bookings / month | Calendly | 8–12 |
| Conversion rate (session → booking) | Plausible goals | 1–2% |

---

## 10. Explicit do-nots

- No link schemes, PBNs, or paid directory links
- No AI-generated articles passed off as human-written (fine as drafting assist, not as the final published version — Ali must edit for voice + accuracy)
- No cloaking, no doorway pages, no exact-match-keyword domains in the backlink profile
- No fake reviews or review-swapping
- No testimonials with patient info — ever
