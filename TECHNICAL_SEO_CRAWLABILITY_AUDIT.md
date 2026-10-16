# Technical SEO Crawlability Audit

**Site:** https://thezcs.com/
**Date:** 2026-10-16
**Branch:** deployment-branch (audit), fixes on working tree

---

## A. Crawlability Overview

| Metric | Value |
|---|---|
| Total discovered URLs | 37 (35 indexable pages + sitemap.xml + llms.txt) |
| Valid public pages | 35 |
| Indexable pages | 35 |
| Pages with crawlability issues | 0 |
| Orphan pages | 0 |
| Max click depth from homepage | 2 clicks |
| Broken internal links | 0 |
| Redirecting internal links | 0 |
| Sitemap inconsistencies | 0 |
| Canonical/robots issues | 0 |

### HTTP Response Summary

All 35 pages return **200 OK**. Both `www.thezcs.com` and `http://thezcs.com` return **308 Permanent Redirect** to `https://thezcs.com`. Trailing-slash variants (e.g., `/services/`) also 308 redirect to the canonical no-trailing-slash URL.

---

## B. URL Inventory

### Static Pages (15)

| URL | Type | Status | In Sitemap | Click Depth | Nav | Footer |
|---|---|---|---|---|---|---|
| / | Homepage | 200 | Yes | 0 | Logo | Logo |
| /services | Services hub | 200 | Yes | 1 | Yes | Yes |
| /services/care-management | Category hub | 200 | Yes | 1 | Mega menu | N/A |
| /services/revenue-cycle-management | Category hub | 200 | Yes | 1 | Mega menu | N/A |
| /services/virtual-staffing | Category hub | 200 | Yes | 1 | Mega menu | N/A |
| /about | About | 200 | Yes | 1 | Yes | Yes |
| /contact | Contact | 200 | Yes | 1 | Yes (CTA) | Yes |
| /faq | FAQ | 200 | Yes | 1 | Yes | Yes |
| /resources | Blog index | 200 | Yes | 1 | Yes | Yes |
| /roi-calculator | ROI tool | 200 | Yes | 1 | Footer, CTAs | Yes |
| /hipaa-compliance | HIPAA | 200 | Yes | 1 | N/A | Yes |
| /hipaa-statement | Legal | 200 | Yes | 1 | N/A | Yes |
| /privacy | Legal | 200 | Yes | 1 | N/A | Yes |
| /terms | Legal | 200 | Yes | 1 | N/A | Yes |
| /accessibility | Legal | 200 | Yes | 1 | N/A | Yes |

### Individual Service Pages (14)

| URL | Status | In Sitemap | Click Depth | Nav | Footer |
|---|---|---|---|---|---|
| /services/chronic-care-management | 200 | Yes | 1 | Mega menu | Yes |
| /services/principal-care-management | 200 | Yes | 1 | Mega menu | Yes |
| /services/remote-patient-monitoring | 200 | Yes | 1 | Mega menu | Yes |
| /services/remote-therapeutic-monitoring | 200 | Yes | 1 | Mega menu | Yes |
| /services/transitional-care-management | 200 | Yes | 1 | Mega menu | Yes |
| /services/medical-billing | 200 | Yes | 1 | Mega menu | Yes |
| /services/medical-coding | 200 | Yes | 1 | Mega menu | Yes |
| /services/provider-credentialing | 200 | Yes | 1 | Mega menu | Yes |
| /services/accounts-receivable | 200 | Yes | 1 | Mega menu | Yes |
| /services/medical-scribe | 200 | Yes | 1 | Mega menu | Yes |
| /services/medical-scheduler | 200 | Yes | 1 | Mega menu | Yes |
| /services/medical-receptionist | 200 | Yes | 1 | Mega menu | Yes |
| /services/patient-care-coordinator | 200 | Yes | 1 | Mega menu | Yes |
| /services/virtual-assistant | 200 | Yes | 1 | Mega menu | Yes |

### Who We Serve Pages (3)

| URL | Status | In Sitemap | Click Depth | Nav | Footer |
|---|---|---|---|---|---|
| /who-we-serve/primary-care | 200 | Yes | 1 | Dropdown | N/A |
| /who-we-serve/internal-medicine | 200 | Yes | 1 | Dropdown | N/A |
| /who-we-serve/geriatrics | 200 | Yes | 1 | Dropdown | N/A |

### Blog Posts (3)

| URL | Status | In Sitemap | Click Depth |
|---|---|---|---|
| /resources/cpt-99490-2026 | 200 | Yes | 2 |
| /resources/in-house-vs-outsourced-ccm | 200 | Yes | 2 |
| /resources/hipaa-checklist-outsourced-ccm | 200 | Yes | 2 |

---

## C. Click Depth Distribution

| Depth | Count | Pages |
|---|---|---|
| 0 | 1 | Homepage |
| 1 | 33 | All services, categories, who-we-serve, about, contact, FAQ, resources, ROI, legal pages |
| 2 | 3 | Blog posts (homepage > resources > post; also linked directly from homepage blog preview) |

**Assessment:** Click depth is excellent. Every important page is reachable in 1-2 clicks from the homepage. The mega-menu in the header provides direct 1-click access to all 14 individual service pages.

---

## D. Site Architecture

```
Homepage (/)
  ├── Services Hub (/services)
  │     ├── Care Management (/services/care-management)
  │     │     ├── CCM (/services/chronic-care-management) ── [NEW: related services cross-links]
  │     │     ├── PCM (/services/principal-care-management)
  │     │     ├── RPM (/services/remote-patient-monitoring)
  │     │     ├── RTM (/services/remote-therapeutic-monitoring)
  │     │     └── TCM (/services/transitional-care-management)
  │     ├── Revenue Cycle Mgmt (/services/revenue-cycle-management)
  │     │     ├── Medical Billing
  │     │     ├── Medical Coding
  │     │     ├── Provider Credentialing
  │     │     └── Accounts Receivable
  │     └── Virtual Staffing (/services/virtual-staffing)
  │           ├── Medical Scribe
  │           ├── Medical Scheduler
  │           ├── Medical Receptionist
  │           ├── Patient Care Coordinator
  │           └── Virtual Assistant
  ├── Who We Serve
  │     ├── Primary Care (/who-we-serve/primary-care)
  │     ├── Internal Medicine (/who-we-serve/internal-medicine)
  │     └── Geriatrics (/who-we-serve/geriatrics)
  ├── Resources (/resources)
  │     ├── CPT 99490 in 2026
  │     ├── In-House vs. Outsourced CCM
  │     └── HIPAA Checklist
  ├── About (/about)
  ├── FAQ (/faq)
  ├── Contact (/contact)
  ├── ROI Calculator (/roi-calculator)
  ├── HIPAA Compliance (/hipaa-compliance)
  └── Legal (privacy, terms, hipaa-statement, accessibility)
```

---

## E. Priority Issues Found

### P1: Visible Breadcrumbs Missing

**Problem:** BreadcrumbList JSON-LD structured data existed on service, category, who-we-serve, and blog pages, but no visible breadcrumb navigation was rendered. Google recommends visible breadcrumbs that match the structured data markup.

**Evidence:** JavaScript inspection of all checked pages showed zero `<nav aria-label="Breadcrumb">` elements. The blog post page had a simple back-link ("All articles") but not a proper breadcrumb trail.

**Fix implemented:** Created `components/breadcrumbs.tsx` and added visible breadcrumbs to:
- Service detail pages (`app/services/[service]/page.tsx`)
- Category landing pages (`components/category-landing.tsx`)
- Services overview (`app/services/page.tsx`)
- Who-we-serve pages (`app/who-we-serve/[specialty]/page.tsx`)
- Blog posts (`app/resources/[slug]/page.tsx`)

**Benefit:** Breadcrumbs improve internal linking (every page now links back to its parent hierarchy), help users navigate, and reinforce the page hierarchy for Google. The visible links match the existing BreadcrumbList JSON-LD.

### P1: No Related Services Cross-Links

**Problem:** Individual service pages (e.g., CCM) only linked to their category hub and the contact page. They did not link to sibling services (e.g., CCM did not link to PCM, RPM, TCM). This is a missed internal-linking opportunity.

**Evidence:** JavaScript extraction of `main a[href]` on `/services/chronic-care-management` showed only 8 internal links, none pointing to sibling services.

**Fix implemented:** Added a "Related services" section to the service detail page template, showing up to 4 sibling services from the same category with descriptive cards. Each card links directly to the related service.

**Benefit:** Each of the 14 service pages now links to 3-4 sibling services. This creates approximately 50+ new contextual internal links across the site.

### P2: Blog Posts Lack Direct Service Page Links

**Problem:** Blog posts about specific services (e.g., the CPT 99490 article about CCM) link to HIPAA compliance and ROI calculator but not to `/services/chronic-care-management`.

**Recommendation (not implemented):** Add contextual in-content links from blog posts to their primary service page. This requires editing MDX content files and should be done by the content author to ensure natural placement.

### P2: Who-We-Serve Pages Not in Footer

**Problem:** The three who-we-serve specialty pages are in the header dropdown but not in the footer. The footer has service columns but no specialty column.

**Recommendation (not implemented):** Adding a "Who We Serve" column to the footer would provide additional sitewide internal links to these pages. Low priority since they're already well-linked from the nav and homepage content.

### P3: ROI Calculator and HIPAA Compliance Not in Top Nav

**Problem:** `/roi-calculator` and `/hipaa-compliance` are high-value pages but only linked from the footer and inline CTAs. They are not in the primary navigation.

**Assessment:** This is acceptable. Both pages are linked from the homepage content area and from multiple service page CTAs. Adding them to the top nav would clutter it. Footer + contextual links provide adequate discoverability.

---

## F. What Was Already Correct (No Action Needed)

| Area | Status |
|---|---|
| robots.txt | Clean, allows all crawlers, correct sitemap URL |
| sitemap.xml | Complete (35 URLs), valid XML, correct domain, stable lastmod dates |
| Canonical tags | Correct on all checked pages, using non-www https |
| HTTP redirects | www and http both 308 to canonical, trailing slashes 308 |
| JSON-LD structured data | Organization, WebSite, Service, BreadcrumbList, FAQPage, Article |
| Meta robots | No accidental noindex on public pages |
| Navigation rendering | All mega-menu links render as `<a>` elements in HTML (SSG) |
| Mobile navigation | Sheet-based mobile nav includes all service links |
| Footer linking | Comprehensive: all 14 services, quick links, resources, legal, contact |
| Homepage internal links | 76 internal links covering all major pages |
| JavaScript rendering | Next.js SSG, all content in initial HTML, no JS-only content |
| Trailing slash consistency | All internal `<Link>` use no-trailing-slash, redirects catch variants |
| Domain consistency | All canonicals use `https://thezcs.com` (non-www) |
| llms.txt | Present and accessible at /llms.txt |

---

## G. Implemented Fixes

| # | File | Change |
|---|---|---|
| 1 | `web/components/breadcrumbs.tsx` | New component: visible breadcrumb navigation |
| 2 | `web/app/services/[service]/page.tsx` | Added Breadcrumbs + RelatedServices section |
| 3 | `web/app/services/page.tsx` | Added Breadcrumbs |
| 4 | `web/components/category-landing.tsx` | Added Breadcrumbs |
| 5 | `web/app/who-we-serve/[specialty]/page.tsx` | Added Breadcrumbs |
| 6 | `web/app/resources/[slug]/page.tsx` | Replaced back-link with Breadcrumbs |

**Build verification:** `next build` passes with zero errors after all changes.

---

## H. Remaining Items (Require Manual Action or External Access)

### Google Search Console Checks

1. Review "Pages" > "Not indexed" report for any pages Google has discovered but chosen not to index
2. Check "Page indexing" > "Crawled, currently not indexed" for thin-content signals
3. Run URL Inspection on each service page to confirm Google sees the new breadcrumbs and related-services links after next deploy
4. Check "Sitemaps" to confirm sitemap is processed without errors
5. Submit the sitemap again after deploying the breadcrumb and related-services changes
6. Review "Links" report (internal links) to verify the new cross-links appear after recrawl

### Content Actions

7. Add contextual links from blog posts to their primary service pages (edit MDX files)
8. Consider adding a "Who We Serve" column to the footer for additional specialty page links
9. Consider adding breadcrumbs to the About, FAQ, Contact, and ROI Calculator pages (lower priority since they're top-level)

---

## I. Summary

The site's technical SEO foundation is solid. All pages are accessible, properly canonicalized, included in the sitemap, and linked from the navigation. The two highest-impact fixes implemented are:

1. **Visible breadcrumbs** on all service, category, specialty, and blog pages, matching the existing BreadcrumbList JSON-LD
2. **Related services cross-links** on every individual service page, adding approximately 50+ new contextual internal links

No critical (P0) issues were found. The site architecture is flat and well-linked, with a maximum click depth of 2 from the homepage.
