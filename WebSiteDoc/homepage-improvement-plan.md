# Zenith Care Solutions Homepage: Improvement Plan

> Analysis date: 2026-10-16
> Branch: `feature/homepage-improvement-plan`
> Status: Plan only. No code changes.

---

## A. Executive Summary

### Strengths
1. **Strong data-driven hero.** The ledger card with real CPT 99490 rates and a derived $13,200/mo figure gives the homepage a concrete, quantitative hook that most healthcare B2B competitors lack.
2. **Clean three-line service taxonomy.** Care Management, Revenue Cycle, Virtual Staffing is clear and maps to actual service pages.
3. **Honest claims posture.** Every revenue figure is qualified ("representative", "actual results vary"), the compliance disclaimers are present, and no fabricated testimonials or stats appear.
4. **Good technical SEO foundation.** Canonical URLs, sitemap.xml, structured data (Organization + Service JSON-LD), OG metadata, security headers, www redirect all in place.
5. **Solid design system.** Warm Cyan palette, Space Grotesk display font, consistent section rhythm tokens, reduced-motion support, CSS-only hero entrance (good LCP).
6. **Comprehensive footer.** Full service directory, contact info, legal links, disclaimer.

### Weaknesses
1. **Hero headline is generic.** "Remote clinical support for the work your practice needs to deliver" does not name the outcome (revenue, time savings, compliance) and reads as vague agency copy.
2. **No "Who We Serve" section on the homepage.** The audience pages (Primary Care, Internal Medicine, Geriatrics) exist but the homepage does not segment visitors toward them.
3. **No social proof of any kind.** No testimonials, no client count, no engagement metrics, no team size. The founder strip is the only trust signal beyond compliance badges.
4. **"How It Works" is CCM-specific but the homepage is multi-service.** The three steps (identify, enroll, bill 99490) only describe the care management flow. RCM and staffing visitors get no process explanation.
5. **Revenue math section is CCM-only.** $13,200 and $15,800 figures are relevant only to care management. Practice managers evaluating billing or staffing see no value framing for their need.
6. **Missing homepage sections from the SEO workbook.** "Why ZCS" (differentiators), "Who We Serve" (audience segmentation), and "Resources" (blog preview) are recommended in the workbook but not implemented.
7. **Title tag does not target the primary keyword.** Current: "Remote Clinical Services | Zenith Care Solutions" (49 chars). The workbook recommends "Healthcare Support Services for Medical Practices | ZCS".
8. **Dark mode is the default visual.** The production site renders in dark mode first. For a healthcare B2B audience accustomed to light, clinical interfaces, this may reduce trust.

### Opportunities
1. Add a "Who We Serve" section that routes visitors by specialty.
2. Replace the generic hero headline with a specific outcome statement.
3. Add a "Why Zenith" differentiator section (operational partner, not software; inside your EHR; one BAA).
4. Add a blog/resources preview section linking to published articles.
5. Make the "How It Works" process generic across all three service lines.
6. Add an FAQ accordion with 3-4 homepage-level questions (maps to FAQ schema).
7. Improve the meta title to include the primary keyword theme.

---

## B. Top 10 Priority Improvements

| # | Improvement | Impact | Confidence | Effort | Dependency |
|---|-------------|--------|------------|--------|------------|
| 1 | Rewrite hero headline + subtext to name the outcome | High | High | Low | None |
| 2 | Add "Who We Serve" audience routing section | High | High | Medium | None |
| 3 | Make "How It Works" service-agnostic | Medium | High | Low | None |
| 4 | Add "Why Zenith" differentiator section | High | High | Medium | Copy approval |
| 5 | Add resources/blog preview section | Medium | Medium | Medium | Blog posts exist |
| 6 | Add homepage FAQ with FAQPage schema | Medium | High | Low | None |
| 7 | Fix title tag + meta description to match keyword strategy | High | High | Low | None |
| 8 | Add homepage-level FAQ schema (JSON-LD) | Medium | High | Low | #6 |
| 9 | Improve hero ledger card to be less CCM-specific | Medium | Medium | Medium | Copy approval |
| 10 | Add structured data: breadcrumb + WebSite SearchAction | Low | High | Low | None |

---

## C. Section-by-Section Recommendations

### 1. Navigation / Header

**Current**: Sticky header, logo (WebP, 240x72), mega-menu with three service columns, "Who We Serve" dropdown, About/Resources/FAQ links, theme toggle, "Book a call" CTA. Breaks to hamburger at `lg` (1024px).

**Problem**: No issues. Well-structured, accessible, keyboard-navigable. The mega-menu reads the service registry, so it never drifts.

**Recommendation**: Keep as-is. Minor: consider adding a phone number or WhatsApp icon to the header if the business wants direct-call conversion from the nav bar.

**Priority**: Low (no change needed)

---

### 2. Hero Section

**Current implementation**:
- Eyebrow badge: "For U.S. physician practices"
- H1: "Remote clinical support for the work your practice needs to deliver."
- Subtext: 3-line paragraph describing all three service lines
- Primary CTA: "Book a 15-minute call"
- Secondary CTA: "Estimate your ROI" (text link)
- Trust row: "HIPAA Business Associate" | "Inside your EHR"
- Right column: Ledger card showing $13,200/mo at CPT 99490 with stat pills
- Aurora background with dot-grid texture

**Problems**:
1. The H1 is vague. "Remote clinical support for the work your practice needs to deliver" does not name who, what outcome, or what makes Zenith different. A practice manager scanning this cannot tell if Zenith is a software platform, a consulting firm, or a staffing company.
2. The subtext is dense and reads like a legal disclaimer rather than a value proposition. "Your practice retains billing responsibility while our team provides dedicated operational and clinical support" is accurate but unpersuasive.
3. The ledger card is excellent for CCM-interested visitors but irrelevant for billing/staffing prospects. 66% of the right column is CCM-specific on a multi-service homepage.
4. "Estimate your ROI" as secondary CTA is CCM-specific.

**Recommended content changes**:

**Proposed H1** (requires business confirmation):
> "Care management, revenue cycle, and virtual staffing for your practice."

Alternative (outcome-focused):
> "The remote team your practice needs but cannot hire."

**Proposed subtext**:
> "Zenith runs care coordination, billing, and administrative work inside your EHR, under one BAA. Your practice stays the billing provider. We provide the clinical and operational staff."

**Proposed secondary CTA**: Change "Estimate your ROI" to "See all services" (links to /services), keeping the ROI link in the ledger card where it contextually belongs.

**Proposed trust row additions**: Add "Flat monthly pricing" and "No long-term contracts" if the business can confirm these.

**Design changes**:
- Keep the aurora + dot-grid, keep the CSS-only reveal entrance.
- Consider making the ledger card cycle or tab between CCM, RCM, and Staffing value propositions (a static example for each service line).
- Reduce the subtext paragraph to 2 lines max.

**Animation**: Keep as-is. CSS-only `reveal-up` is good for LCP. No JS gate.

**Priority**: P1 (highest impact, low effort)

---

### 3. Trust Strip

**Current**: 4-column strip: HIPAA BA, Trained clinical staff, Inside your EHR, CMS-aligned billing. Each has an icon, label, and detail line.

**Problem**: "CMS-aligned billing" with CPT codes is again CCM-specific. A billing or staffing prospect does not care about CPT 99490.

**Recommendation**: Replace "CMS-aligned billing" with something service-agnostic like "One operational partner" or "Flat monthly pricing" (if confirmable). Alternatively, keep as-is since care management IS the anchor service.

**Priority**: P3 (low impact)

---

### 4. Service Lines Section ("Three service lines. One operational partner.")

**Current**: Three cards (Care Management, Revenue Cycle, Virtual Staffing) with icon, label, blurb, "Explore" link.

**Problem**: Solid section. The heading and cards are clear. Minor: the blurbs are short abbreviation lists ("CCM, PCM, RPM, RTM & TCM") that mean nothing to a first-time visitor.

**Recommendation**:
- Rewrite blurbs to state the outcome rather than listing acronyms.
  - Care Management: "Monthly patient coordination that generates recurring Medicare revenue for your practice."
  - Revenue Cycle: "Billing, coding, and credentialing support that gets more of what you earn collected."
  - Virtual Staffing: "Remote medical staff who handle the admin slowing your team down."
- Add a brief one-liner above the cards explaining why three lines matter: "Everything a practice needs to capture unbilled revenue and recover staff hours, under one BAA."

**Priority**: P2

---

### 5. How It Works Section

**Current**: Three steps: Identify & enroll, Deliver monthly care coordination, You bill, we invoice. All three describe the CCM enrollment process.

**Problem**: This section is CCM-specific. A visitor interested in medical billing or a remote scribe sees a process that does not apply to them.

**Recommendation**: Rewrite as a service-agnostic process:
1. **Discovery call** - "Tell us what your practice needs. We confirm scope, systems, and a timeline."
2. **Onboarding** - "We set up inside your EHR or PM system under a signed BAA. Your team reviews and approves."
3. **Ongoing delivery** - "Our team does the work. You get monthly reports and a predictable invoice."

Keep the heading: "Three steps. Your practice stays in control." (variation)

**Priority**: P1

---

### 6. Revenue Math Section (Complex-CCM band)

**Current**: $15,800/mo figure for a 200-patient panel with 20% complex-CCM mix. "Estimate your panel's number" CTA linking to the ROI calculator.

**Problem**: Good section, but again CCM-only. The section transitions from "three service lines" to "here is the math for one of them" without signposting.

**Recommendation**:
- Add a brief intro line above the figure: "For practices running care management programs:"
- Consider adding a second, smaller value-frame for RCM/staffing: "For billing and staffing: flat monthly rate, no per-claim fees. Scope confirmed during discovery."
- Keep the $15,800 figure, it is the strongest quantitative hook on the page.

**Priority**: P2

---

### 7. Founder Credibility Strip

**Current**: FA monogram, "Zenith is run by a trained pharmacist, not a call centre." Bio paragraph mentioning Furqan Ali's clinical oncology / BMT background.

**Problem**: Good section. It is the only trust/credibility signal on the homepage beyond compliance badges. However:
- "Not a call centre" is a comparison to unnamed competitors. It works but could be stronger with a positive frame.
- The credentials ("Clinical Pharmacist", "Oncology / BMT") need business confirmation (noted in prior session).

**Recommendation**:
- Consider changing "not a call centre" to a positive differentiator: "Zenith is run by a clinical pharmacist who built every workflow."
- Add a professional headshot if available (the monogram is a placeholder aesthetic).
- [REQUIRES CONFIRMATION] Verify "Clinical Pharmacist" and "Oncology / BMT" credentials before production.

**Priority**: P3 (the section already works)

---

### 8. MISSING: "Who We Serve" Audience Section

**Current**: Does not exist on the homepage. The SEO workbook recommends it.

**Recommendation**: Add a three-card section linking to /who-we-serve/primary-care, /who-we-serve/internal-medicine, /who-we-serve/geriatrics. Each card should name a pain point specific to that specialty:
- **Primary Care**: "High patient volumes, limited staff, and Medicare programs your panel qualifies for but no one has time to run."
- **Internal Medicine**: "Complex chronic patients who need monthly coordination to stay out of the ER."
- **Geriatrics**: "Patients with five or more conditions, polypharmacy, and post-discharge risk."

Position: after the service lines section, before "How It Works."

**Priority**: P1

---

### 9. MISSING: "Why Zenith" Differentiator Section

**Current**: Does not exist. The SEO workbook recommends a "Why ZCS / A Partner for Your Practice" section.

**Recommendation**: Add 4 differentiators in a grid:
1. **Operational partner, not software** - "We provide trained clinical and admin staff, not a platform you have to learn."
2. **Inside your EHR** - "Your data stays in your system. No PHI exported. No new platform to adopt."
3. **Your practice bills, we invoice** - "You keep the revenue. We charge a flat monthly rate for the labor."
4. **Clinical pharmacist-led** - "Founded by a PharmD with oncology and BMT training." [REQUIRES CONFIRMATION]

Position: after the revenue math section, before the founder strip.

**Priority**: P1

---

### 10. MISSING: Resources / Blog Preview

**Current**: Does not exist on the homepage. Published blog posts exist at /resources.

**Recommendation**: Show the 2-3 most recent blog posts in a card grid. Title: "From the blog" or "Practical reading for practice teams." Each card shows title, category, reading time, and a link.

Position: after the founder strip, before the final CTA.

**Priority**: P2

---

### 11. MISSING: Homepage FAQ

**Current**: No FAQ on the homepage. FAQ page exists at /faq.

**Recommendation**: Add 3-4 questions in an accordion:
- "What services does Zenith provide?" (links to /services)
- "Does Zenith bill Medicare or my patients?" (No. Your practice bills.)
- "How long does onboarding take?" (Typically 2-4 weeks.)
- "What EHR systems do you work with?" (We work inside most major EHRs.)

Add FAQPage JSON-LD schema for these questions.

Position: after resources preview, before final CTA.

**Priority**: P2

---

### 12. Final CTA Band

**Current**: "Ready to see the math for your practice?" with Book a call + Estimate your ROI buttons.

**Problem**: The heading is CCM-specific ("see the math"). Non-CCM visitors may not connect.

**Recommendation**: Change heading to: "Ready to talk about your practice?" or "Fifteen minutes to find out if we are a fit."

Keep both CTAs. Change "Estimate your ROI first" to "See how it works" linking to /services for non-CCM visitors, or keep the ROI link alongside.

**Priority**: P2

---

### 13. Footer

**Current**: Comprehensive 6-column layout with service directory, contact info, legal links, disclaimer.

**Problem**: No issues. Well-structured.

**Recommendation**: Keep as-is.

**Priority**: None

---

## D. Proposed Homepage Structure (Section Order)

| Order | Section | Rationale |
|-------|---------|-----------|
| 1 | **Nav / Header** | Fixed. Sticky with mega-menu. |
| 2 | **Hero** | Primary conversion hook. H1 + subtext + CTA + ledger card. |
| 3 | **Trust Strip** | Immediate credibility after the hero claim. |
| 4 | **Service Lines** | "What we do." Three cards. |
| 5 | **Who We Serve** (NEW) | "Who we do it for." Routes visitors to specialty pages. |
| 6 | **How It Works** (REWRITTEN) | Service-agnostic 3-step process. |
| 7 | **Revenue Math** | Quantitative proof for CCM (the anchor service). |
| 8 | **Why Zenith** (NEW) | Differentiators and positioning. |
| 9 | **Founder Strip** | Personal credibility and clinical background. |
| 10 | **Resources Preview** (NEW) | Blog / educational content. |
| 11 | **FAQ Accordion** (NEW) | Common questions + FAQ schema. |
| 12 | **Final CTA** | Closing conversion prompt. |
| 13 | **Footer** | Full directory + legal. |

---

## E. Proposed Content

### Hero Headline Options (choose one, requires business confirmation)

**Option A (outcome-focused)**:
> "Care management, billing, and staffing for your practice, without adding headcount."

**Option B (audience-focused)**:
> "The remote team your practice needs but cannot hire."

**Option C (value-focused)**:
> "Remote staff who run the care coordination, billing, and admin your team does not have time for."

### Hero Subtext (for Option A):
> "Zenith provides trained clinical and administrative staff who work inside your EHR, under one BAA. Your practice stays the billing provider. You keep the revenue."

### Primary CTA: "Book a 15-minute call" (keep)
### Secondary CTA: "See our services" (changed from "Estimate your ROI")

### Service Line Card Blurbs:
- **Care Management**: "Monthly patient coordination that generates recurring Medicare revenue for your practice. CCM, PCM, RPM, RTM, TCM."
- **Revenue Cycle**: "Billing, coding, credentialing, and AR follow-up that gets more of what you earn collected."
- **Virtual Staffing**: "Remote scribes, schedulers, receptionists, and coordinators who absorb the admin slowing your team."

### How It Works (rewritten):
1. **Discovery** - "Fifteen minutes. We learn what your practice needs, confirm scope, and walk through the numbers."
2. **Onboarding** - "We set up inside your EHR under a signed BAA. Two to four weeks, depending on scope."
3. **Ongoing delivery** - "Our team does the daily work. You get monthly reports and a predictable invoice."

### Why Zenith Section:
- **Staff, not software** - "We provide trained clinical and administrative professionals, not a platform. No new system to learn."
- **Inside your EHR** - "All documentation lives in your system. No PHI exported, no data migration."
- **You bill, we invoice** - "Your practice bills Medicare and payers. Zenith invoices you monthly for the labor."
- **Built by a pharmacist** - "Our founder brings a clinical oncology background to every workflow we deliver." [REQUIRES CONFIRMATION]

### Final CTA (rewritten):
Heading: "Ready to find out if we are a fit?"
Subtext: "Fifteen minutes. We confirm your eligible patient count or scope the role, walk through the numbers, and tell you honestly whether we can help."

---

## F. SEO Deliverables

### Title Tag
**Current**: "Remote Clinical Services | Zenith Care Solutions" (49 chars)
**Proposed**: "Healthcare Support Services for Medical Practices | ZCS" (55 chars)
**Alternative**: "Care Management, Billing & Virtual Staffing | ZCS" (50 chars)

### Meta Description
**Current**: "Care management, revenue cycle and virtual staffing for U.S. physician practices. HIPAA Business Associate, inside your EHR." (123 chars)
**Proposed**: "Remote care management, medical billing, and virtual staffing for U.S. physician practices. HIPAA Business Associate, inside your EHR, flat monthly rate." (152 chars)

### H1
**Current**: "Remote clinical support for the work your practice needs to deliver."
**Proposed**: See Hero Headline Options above.
**SEO workbook recommendation**: "Healthcare Support for the Work Your Practice Needs to Deliver"

### Proposed H2/H3 Structure
```
H1: [Hero headline]
  H2: Three service lines. One operational partner.
    H3: Care Management
    H3: Revenue Cycle Management
    H3: Virtual Staffing & Admin Support
  H2: Support for the practices we serve
    H3: Primary Care
    H3: Internal Medicine
    H3: Geriatrics
  H2: How it works
    H3: Discovery
    H3: Onboarding
    H3: Ongoing delivery
  H2: [Revenue math heading]
  H2: Why Zenith
    H3: Staff, not software
    H3: Inside your EHR
    H3: You bill, we invoice
    H3: Built by a pharmacist
  H2: [Founder heading]
  H2: From the blog
  H2: Frequently asked questions
  H2: [Final CTA heading]
```

### Keyword-to-Section Mapping
| Primary Keyword | Target Section |
|-----------------|---------------|
| healthcare support services for medical practices | H1 / Hero |
| care management services | Service Lines cards |
| chronic care management | Revenue Math + ledger card |
| medical billing services | Service Lines cards + RCM blurb |
| virtual medical staffing | Service Lines cards + Staffing blurb |
| remote care management | Hero subtext |
| HIPAA business associate | Trust strip |
| CCM ROI calculator | Revenue Math CTA |

### Internal Linking Recommendations
The homepage should link to:
- /services (from hero secondary CTA + service heading)
- /services/care-management (from Care Management card)
- /services/revenue-cycle-management (from RCM card)
- /services/virtual-staffing (from Staffing card)
- /who-we-serve/primary-care (from Who We Serve section)
- /who-we-serve/internal-medicine (from Who We Serve section)
- /who-we-serve/geriatrics (from Who We Serve section)
- /roi-calculator (from revenue math band)
- /contact (from hero CTA + final CTA)
- /about (from founder strip)
- /resources (from blog preview section)
- /faq (from FAQ section "See all FAQs" link)
- 2-3 individual blog posts (from resources preview cards)

Currently missing: Who We Serve links, blog post links, individual service deep links from the homepage.

### Structured Data Recommendations
**Currently implemented**: Organization JSON-LD, Service JSON-LD
**Add**:
1. **FAQPage** schema for the homepage FAQ accordion (3-4 questions)
2. **BreadcrumbList** (Home only, single item, for completeness)
3. **WebSite** with `potentialAction: SearchAction` pointing to /resources or the site search if one exists

### AI Visibility Recommendations
1. **Entity consistency**: Use "Zenith Care Solutions" (full name) in the first paragraph of the hero, not just "Zenith." AI systems need the full entity name early.
2. **Service taxonomy**: List all three service categories explicitly in the hero or service section. AI systems extract these as the company's offerings.
3. **Direct answers**: The FAQ accordion should contain direct, factual answers that AI systems can extract. Avoid "contact us to learn more" as the answer.
4. **llms.txt**: Already exists at /llms.txt. Verify it is up to date with current service offerings.
5. **robots.txt**: Verify no AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are blocked unless intentionally.

---

## G. Motion Design Specification

### Current Animations

| Element | Type | Verdict |
|---------|------|---------|
| Hero entrance (CSS `reveal-up`) | Staggered fade+lift, 0.6s, CSS-only | **Keep** - LCP-safe, no JS gate |
| Aurora shapes (3 blobs) | Infinite CSS drift, 18-28s, transform-only | **Keep** - GPU-cheap, decorative |
| Dot-grid texture | Static CSS overlay | **Keep** |
| Below-fold `Reveal` (motion/react) | Fade+lift on scroll, once, 0.75s | **Keep** - Reduced-motion aware |
| Page transition (`page-enter`) | 0.4s translateY entrance | **Keep** |
| Card hover lift | translate-y + shadow on hover | **Keep** |
| Arrow icon hover shift | translateX 0.5px on group hover | **Keep** |

All animations are well-implemented: GPU-only transforms, reduced-motion support, mobile animation disabled for hero. No changes needed.

### Proposed New Animations

| Element | Effect | Trigger | Duration | Mobile | Reduced-motion |
|---------|--------|---------|----------|--------|----------------|
| Who We Serve cards | Staggered `Reveal` fade+lift | Scroll into view | 0.75s, 80ms stagger | No stagger | Plain div |
| Why Zenith grid items | `Reveal` fade+lift | Scroll into view | 0.75s, 80ms stagger | No stagger | Plain div |
| FAQ accordion | Native shadcn accordion animation | Click | 200ms ease-out | Same | Instant open |
| Blog preview cards | `Reveal` fade+lift | Scroll into view | 0.75s, 80ms stagger | No stagger | Plain div |

All new animations should use the existing `Reveal` component. No new animation library or system needed.

---

## H. Implementation Roadmap

### Phase 1: Content and Messaging (P1, 1-2 days)
**Files**: `app/page.tsx`, `components/home-hero.tsx`
- Rewrite hero H1, subtext, and secondary CTA
- Rewrite "How It Works" to be service-agnostic
- Update service card blurbs in `page.tsx` (or add `homeBlurb` to `categoryMeta` in `lib/services.ts`)
- Rewrite final CTA heading

**Acceptance**: Hero communicates all three service lines. "How It Works" applies to any service. No CCM-only framing outside the revenue math band.

### Phase 2: SEO and Technical (P1, 0.5 day)
**Files**: `app/page.tsx` (metadata), `lib/seo.tsx` (if schema changes needed)
- Update title tag and meta description
- Add FAQPage JSON-LD for homepage FAQ
- Verify llms.txt is current
- Verify robots.txt allows AI crawlers

**Acceptance**: Title under 60 chars with primary keyword. FAQ schema validates in Google Rich Results Test.

### Phase 3: New Sections (P1-P2, 2-3 days)
**Files**: `app/page.tsx`, possibly new components
- Add "Who We Serve" section (3 cards linking to specialty pages)
- Add "Why Zenith" differentiator section (4-item grid)
- Add resources/blog preview section (reuse `getAllPosts()`)
- Add FAQ accordion (3-4 questions, shadcn Accordion)

**Dependencies**: Blog posts must exist (they do). "Why Zenith" copy requires business confirmation on founder credentials and pricing model ("flat monthly rate", "no long-term contracts").

**Acceptance**: Homepage answers all 7 prospect questions from the brief. All new sections use existing design tokens and the `Reveal` component.

### Phase 4: Visual and Motion (P3, 1 day)
**Files**: `components/home-hero.tsx`, `app/globals.css`
- Consider making ledger card multi-service (tab between CCM/RCM/Staffing value frames)
- Refine trust strip fourth item to be service-agnostic
- Apply `Reveal` to all new sections

**Acceptance**: Animations are GPU-only, reduced-motion safe, disabled on mobile below fold.

### Phase 5: AI Search and Structured Data (P2, 0.5 day)
**Files**: `app/page.tsx`, `lib/seo.tsx`, `app/llms.txt/route.ts`
- Add BreadcrumbList schema
- Add WebSite schema
- Update llms.txt with current service taxonomy
- Verify full entity name "Zenith Care Solutions" appears in the first 200 words

**Acceptance**: All schemas validate. llms.txt matches current offerings.

### Phase 6: QA and Performance (P2, 0.5 day)
- Run Lighthouse on the updated homepage (target: Performance 90+, Accessibility 100, SEO 100)
- Verify Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Test mobile layout (375px, 768px, 1024px, 1440px)
- Test dark mode
- Test reduced-motion
- Run `npx tsc --noEmit`
- Run Google Rich Results Test on all new schema

**Acceptance**: All Lighthouse scores green. No TypeScript errors. All schemas valid.

---

## I. Success Measurement

### Baseline to Establish (before implementation)
- Google Search Console: impressions, clicks, CTR, average position for homepage
- Google Search Console: indexing status, crawl errors
- Bing Webmaster Tools: same metrics
- Vercel Analytics or Plausible: homepage bounce rate, time on page, CTR to /contact and /roi-calculator
- Core Web Vitals (field data from CrUX if available, lab data from Lighthouse)
- Number of qualified inquiries per month via contact form / Calendly

### Post-Implementation Metrics (measure at 30, 60, 90 days)
| Metric | Source | Expected Direction |
|--------|--------|--------------------|
| Homepage impressions | GSC | Increase (broader keyword targeting) |
| Homepage CTR | GSC | Increase (better title + description) |
| Click-through to /contact | Analytics | Increase (more CTAs, clearer messaging) |
| Click-through to /services | Analytics | Increase (new "Who We Serve" routing) |
| Bounce rate | Analytics | Decrease (more relevant content) |
| Time on page | Analytics | Increase (more sections, FAQ) |
| FAQ rich result impressions | GSC | New (currently zero) |
| LCP | CrUX / Lighthouse | Maintain < 2.5s |
| AI search citations | Manual check in ChatGPT, Perplexity | Observable mentions |

### What Cannot Be Guaranteed
- Specific ranking positions
- Specific traffic numbers
- AI citation frequency
- Conversion rate improvements (these depend on market, competition, and business factors beyond the homepage)

---

## Appendix: Competitor Observations

### Passionate Care Management (passionatecaremanagement.com)
- CCM-focused competitor. Clean, light design. Hero uses a patient photo. Service pages are detailed with eligibility tables. Takeaway: patient imagery and clinical photography build trust for healthcare audiences.

### PRGMD (prgmd.com)
- Revenue-focused headline: "Your Practice May Be Earning More Revenue Than It's Collecting." Strong outcome framing. Orange + blue palette. Inline form in the hero. Takeaway: outcome-focused headlines convert better than service descriptions.

### OnEdge (onedge.co)
- Remote medical staffing. Bold purple, clean hero with role-specific CTA ("Book a Demo"). Individual role pages. Takeaway: role-specific landing pages (scribe, scheduler) with clear pricing work well for staffing.

### Codroon (codroon.com)
- Tech agency, not healthcare. Dark hero with product cards, editorial layout, strong scroll behavior. Takeaway: editorial section transitions and product-card typography can be adapted for service sections. The "Ship in weeks, not months" framing translates to "Start in weeks, not months" for Zenith's onboarding promise.

---

*This plan is analysis only. No source code was modified. All proposed copy requires business review and confirmation before implementation.*
