# Schema.org / JSON-LD audit: thezcs.com

Audited 2026-10-30. Method: live HTML fetched with curl for 12 representative URLs (home, services, category, CPT code, FAQ, about, contact, pricing, resources + article, who-we-serve, hipaa-compliance, roi-calculator), plus the generators in `web/lib/seo.tsx`. `logo.png`, `sitemap.xml`, `robots.txt` all return 200.

## 1. What exists today

| Page | Emitted types |
|---|---|
| every page (layout) | Organization (`#organization`), WebSite (`#website`) |
| `/` | Service, FAQPage |
| `/services`, `/pricing`, `/contact`, `/resources`, `/hipaa-compliance`, legal pages | BreadcrumbList only |
| `/services/<category>`, `/who-we-serve/*` | Service, BreadcrumbList, FAQPage |
| `/services/care-management/cpt-codes/<code>` | BreadcrumbList, FAQPage |
| `/services/revenue-cycle-management/denial-codes/*` | BreadcrumbList only |
| `/about` | 2x Person, BreadcrumbList |
| `/resources/<slug>` | Article, BreadcrumbList |
| `/roi-calculator` | Service, BreadcrumbList |

The base is clean and valid: no syntax errors, absolute URLs, no fake ratings, no SearchAction. The problems are about **connectedness and depth**, not validity.

## 2. Issues, ranked by SEO / machine-understanding impact

### P0: graph is disconnected (no WebPage layer, no `@id` on 5 of 7 node types)
Service, Person, Article, FAQPage and BreadcrumbList have no `@id`, and no `WebPage` node ties them together. Each page ships 4 to 5 loose objects. A parser cannot say "this FAQ and this breadcrumb belong to *this* page, which is about *this* service, offered by *this* organization". Entity linking (Knowledge Graph, Perplexity, ChatGPT search) leans on `@id` references, so every unreferenced node is treated as an anonymous fragment. `Person` nodes cannot be named as `founder` or `reviewedBy` for the same reason.

### P0: Article credits the Organization and hides the PharmD reviewer
Content is medical-billing guidance (YMYL-adjacent). `author` is an Organization and the Person who reviews it is not expressed anywhere on the article. E-E-A-T signal is lost. Also missing: `inLanguage`, `articleSection`, `isPartOf`, `wordCount`, image `ImageObject` with dimensions. Dates are midnight UTC placeholders.

### P1: Organization is thin
Missing `foundingDate` (site.ts has the Wyoming formation date), `founder` (Person refs), top-level `email`, `logo` as `ImageObject` (a bare URL is valid but Google prefers ImageObject with width/height), `areaServed`, `hasOfferCatalog` (links the three service categories as entities), `identifier` (Wyoming filing ID), `slogan`. `sameAs` has only LinkedIn. `address` is deliberately omitted (virtual mailbox, see `site.ts`); keep that decision.

### P1: Service is one generic template reused everywhere
No `@id`, no `hasOfferCatalog`/`offers`, no `serviceOutput`, no `isPartOf` link to its page. The home page claims one Service for the whole business. The three category pages and `/pricing` do not describe their sub-services or plans as `Offer`s, so pricing is invisible to machines.

### P1: programmatic pages carry no entity data
~100s of CPT and denial-code pages emit only Breadcrumb/FAQ. A CPT page is literally about a medical code: `MedicalCode` (codeValue, codingSystem) is the exact type. Denial codes (CARC/RARC) fit `DefinedTerm` inside a `DefinedTermSet`. This is the largest long-tail surface on the site and the least annotated.

### P2: wrong or missing page-type specificity
- `/roi-calculator` is typed `Service`. It is a free interactive tool: `WebApplication` (+ `Offer` price 0).
- `/about` has no `AboutPage`; `/contact` no `ContactPage`; `/resources` no `Blog`/`CollectionPage`; `/pricing` no `OfferCatalog`; `/hipaa-compliance`, `/security`, legal pages no typed `WebPage`.
- `/faq` emits one big FAQPage (fine). Note: since Aug 2023 Google shows FAQ rich results only for government/health authority sites, so expect **no SERP rich result**. Keep it for AI engines and entity understanding; do not spend effort expanding it for SERP gain.

### P3: hygiene
- `@id` uses `https://thezcs.com#organization`; convention is `https://thezcs.com/#organization`. Pick one and keep it (changing is safe, nothing external references it yet).
- `JsonLd` uses raw `JSON.stringify`. Escape `<` as `<` so a future `</script>` in content cannot break out.
- `knowsAbout` is a string list; fine, but `Service`/`OfferCatalog` entries give stronger entity links.

### Deliberately NOT recommended
| Type | Why not |
|---|---|
| LocalBusiness / MedicalBusiness | No physical office, no clinic. The mailing address is virtual; `site.ts` already forbids PostalAddress. Claiming LocalBusiness invites a rich-result mismatch and a patient-facing misread. |
| Product | B2B subcontracted-labor service, not a SKU. `Service` + `Offer` is correct. |
| AggregateRating / Review | No genuine reviews exist. Fabricating them is a manual-action risk. Add only when real, verifiable reviews are on the page. |
| HowTo | Google dropped HowTo rich results (2023). `/how-it-works` is better as a typed `WebPage`. |
| SearchAction | No on-site search. |
| Organization `address`, `telephone` | None public yet. Add when real (see `13-deferred-items.md`). |

## 3. Implementation (the shortest working diff)

All changes live in `web/lib/seo.tsx`. Pages keep calling the same helpers; two new helpers and a few extra fields.

### 3.1 `@id` helpers and hardened renderer

```tsx
const id = (frag: string) => `${site.url}/#${frag}`;           // org, website
const pageId = (path: string) => `${abs(path)}#webpage`;

export function JsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

### 3.2 New `webPageLd` (the missing glue)

```tsx
type WebPageType =
  | "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage" | "ItemPage";

export function webPageLd({
  path, name, description, type = "WebPage", breadcrumb = true,
  about, reviewedBy, datePublished, dateModified,
}: {
  path: string; name: string; description: string; type?: WebPageType;
  breadcrumb?: boolean; about?: string;          // about = a @id, e.g. service id
  reviewedBy?: string; datePublished?: string; dateModified?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": pageId(path),
    url: abs(path),
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": id("website") },
    publisher: { "@id": id("organization") },
    ...(breadcrumb && { breadcrumb: { "@id": `${abs(path)}#breadcrumb` } }),
    ...(about && { about: { "@id": about } }),
    ...(reviewedBy && { reviewedBy: { "@id": reviewedBy } }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };
}
```

`breadcrumbLd` gets `"@id": \`${abs(last.path)}#breadcrumb\`` and `isPartOf`-free (the WebPage points at it). `faqPageLd` gets an optional `path` param and `"@id": \`${abs(path)}#faq\``, then the WebPage references it via `mainEntity: {"@id": ...}` on FAQ pages.

### 3.3 Upgrade existing helpers

- `serviceLd`: add `"@id": \`${abs(path)}#service\``, optional `offers`/`hasOfferCatalog`, `mainEntityOfPage: {"@id": pageId(path)}`.
- `personLd`: add `"@id": \`${abs(path)}#<slug>\`` (e.g. `/about#fa`, `/about#mu`, already the URL fragment for MU), `image`, `sameAs` when profiles exist.
- `articleLd`: author becomes the founder Person when present, add `reviewedBy`, `inLanguage`, `articleSection`, `isPartOf`, `@id`.
- `organizationLd`: add the fields in section 4.1.

### 3.4 Per-page wiring (each is a 1 to 3 line change)

| Page | Add |
|---|---|
| `/` | `webPageLd({type:"WebPage", breadcrumb:false, about: service id})` |
| `/about` | `webPageLd({type:"AboutPage"})` |
| `/contact` | `webPageLd({type:"ContactPage"})` |
| `/resources` | `Blog` node (4.8) |
| `/resources/[slug]` | `webPageLd({reviewedBy: MU id, ...})` + upgraded Article |
| `/pricing` | `OfferCatalog` (4.6) |
| CPT `[code]` | `MedicalCode` (4.9) |
| denial `[code]` | `DefinedTerm` (4.10) |
| `/roi-calculator` | swap Service for `WebApplication` (4.7) |
| all other pages | `webPageLd({})` next to the existing breadcrumb |

## 4. Production JSON-LD

Facts come from `web/lib/site.ts` and the live pages. Replace `[bracketed]` values with real page data. Nothing here invents ratings, prices, phone numbers or addresses.

### 4.1 Organization + WebSite (layout, every page)

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://thezcs.com/#organization",
    "name": "Zenith Care Solutions",
    "legalName": "Zenith Care Solutions LLC",
    "url": "https://thezcs.com/",
    "logo": {
      "@type": "ImageObject",
      "@id": "https://thezcs.com/#logo",
      "url": "https://thezcs.com/logo.png",
      "contentUrl": "https://thezcs.com/logo.png",
      "caption": "Zenith Care Solutions"
    },
    "image": { "@id": "https://thezcs.com/#logo" },
    "description": "Remote care management, revenue cycle management, and virtual medical staffing for U.S. physician practices. HIPAA Business Associate, inside your EHR.",
    "email": "contact@thezcs.com",
    "foundingDate": "2026-10-22",
    "foundingLocation": { "@type": "AdministrativeArea", "name": "Wyoming, United States" },
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "Wyoming Secretary of State Filing ID",
      "value": "2026-002113280"
    },
    "founder": [
      { "@id": "https://thezcs.com/about#fa" },
      { "@id": "https://thezcs.com/about#mu" }
    ],
    "areaServed": { "@type": "Country", "name": "United States" },
    "sameAs": ["https://www.linkedin.com/company/zenith-care-solutions"],
    "knowsAbout": [
      "Chronic Care Management", "Principal Care Management", "Remote Patient Monitoring",
      "Transitional Care Management", "Medical Billing", "Medical Coding",
      "Provider Credentialing", "Accounts Receivable Management",
      "Virtual Medical Staffing", "HIPAA Business Associate services"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Zenith Care Solutions services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@id": "https://thezcs.com/services/care-management#service" } },
        { "@type": "Offer", "itemOffered": { "@id": "https://thezcs.com/services/revenue-cycle-management#service" } },
        { "@type": "Offer", "itemOffered": { "@id": "https://thezcs.com/services/virtual-staffing#service" } }
      ]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@thezcs.com",
      "contactType": "sales",
      "areaServed": "US",
      "availableLanguage": ["en"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://thezcs.com/#website",
    "url": "https://thezcs.com/",
    "name": "Zenith Care Solutions",
    "description": "Remote care management, revenue cycle management, and virtual medical staffing for U.S. physician practices.",
    "inLanguage": "en-US",
    "publisher": { "@id": "https://thezcs.com/#organization" }
  }
]
```

Note: hours are Eastern time; the `hoursAvailable` spec has no timezone field. Drop that block if you prefer, rather than imply UTC.

### 4.2 Home `/`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thezcs.com/#webpage",
    "url": "https://thezcs.com/",
    "name": "Zenith Care Solutions, Care Management, RCM & Virtual Staffing for U.S. Practices",
    "inLanguage": "en-US",
    "isPartOf": { "@id": "https://thezcs.com/#website" },
    "about": { "@id": "https://thezcs.com/#organization" },
    "publisher": { "@id": "https://thezcs.com/#organization" },
    "mainEntity": { "@id": "https://thezcs.com/#faq" }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://thezcs.com/#faq",
    "isPartOf": { "@id": "https://thezcs.com/#webpage" },
    "mainEntity": [
      {
        "@type": "Question",
        "name": "[question from HOME_FAQ]",
        "acceptedAnswer": { "@type": "Answer", "text": "[answer, plain text]" }
      }
    ]
  }
]
```

Drop the home-level generic `Service`; the Organization's `hasOfferCatalog` now covers it and avoids a duplicate, vaguer entity.

### 4.3 Service category pages (`/services/care-management`, `/revenue-cycle-management`, `/virtual-staffing`)

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thezcs.com/services/care-management#webpage",
    "url": "https://thezcs.com/services/care-management",
    "name": "[page title]",
    "description": "[meta description]",
    "inLanguage": "en-US",
    "isPartOf": { "@id": "https://thezcs.com/#website" },
    "breadcrumb": { "@id": "https://thezcs.com/services/care-management#breadcrumb" },
    "about": { "@id": "https://thezcs.com/services/care-management#service" },
    "mainEntity": { "@id": "https://thezcs.com/services/care-management#faq" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://thezcs.com/services/care-management#service",
    "name": "Care Management for U.S. Physician Practices",
    "serviceType": "Chronic Care Management",
    "description": "[category description from registry]",
    "url": "https://thezcs.com/services/care-management",
    "provider": { "@id": "https://thezcs.com/#organization" },
    "areaServed": { "@type": "Country", "name": "United States" },
    "audience": { "@type": "MedicalAudience", "audienceType": "Physician" },
    "mainEntityOfPage": { "@id": "https://thezcs.com/services/care-management#webpage" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Care management services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Chronic Care Management (CPT 99490, 99439)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Principal Care Management (CPT 99424-99427)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Remote Patient Monitoring" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transitional Care Management" } }
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://thezcs.com/services/care-management#breadcrumb",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://thezcs.com/" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://thezcs.com/services" },
      { "@type": "ListItem", "position": 3, "name": "Care Management", "item": "https://thezcs.com/services/care-management" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://thezcs.com/services/care-management#faq",
    "mainEntity": [
      { "@type": "Question", "name": "[q]", "acceptedAnswer": { "@type": "Answer", "text": "[a]" } }
    ]
  }
]
```

Repeat per category, swapping the slug, `serviceType` ("Revenue Cycle Management", "Virtual Medical Staffing") and the catalog items. Only list sub-services that actually have a section on the page.

### 4.4 Who-we-serve (`/who-we-serve/primary-care`, `internal-medicine`, `geriatrics`)

Same shape as 4.3, with the Service narrowed by audience:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://thezcs.com/who-we-serve/primary-care#service",
  "name": "Chronic Care Management for Primary Care Practices",
  "serviceType": "Chronic Care Management",
  "provider": { "@id": "https://thezcs.com/#organization" },
  "areaServed": { "@type": "Country", "name": "United States" },
  "audience": { "@type": "MedicalAudience", "audienceType": "Primary care physicians" },
  "isRelatedTo": { "@id": "https://thezcs.com/services/care-management#service" },
  "mainEntityOfPage": { "@id": "https://thezcs.com/who-we-serve/primary-care#webpage" }
}
```

### 4.5 About `/about`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://thezcs.com/about#webpage",
    "url": "https://thezcs.com/about",
    "name": "About Zenith Care Solutions",
    "isPartOf": { "@id": "https://thezcs.com/#website" },
    "about": { "@id": "https://thezcs.com/#organization" },
    "breadcrumb": { "@id": "https://thezcs.com/about#breadcrumb" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://thezcs.com/about#fa",
    "name": "Furqan Ali",
    "jobTitle": "Founder",
    "description": "Software engineer with five years of experience delivering projects to multiple customers. Founder of Zenith Care Solutions.",
    "url": "https://thezcs.com/about",
    "worksFor": { "@id": "https://thezcs.com/#organization" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://thezcs.com/about#mu",
    "name": "Muhammad Usman",
    "jobTitle": "Co-founder",
    "description": "Doctor of Pharmacy (PharmD) and entrepreneur. Reviews clinical and billing content published by Zenith Care Solutions.",
    "url": "https://thezcs.com/about#mu",
    "worksFor": { "@id": "https://thezcs.com/#organization" },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Doctor of Pharmacy (PharmD)",
        "credentialCategory": "degree"
      }
    ]
  }
]
```

Add `sameAs` (LinkedIn) and `image` for each founder once real URLs exist. Do not add them speculatively.

### 4.6 Pricing `/pricing`

Generate from the existing `PricingPlan` data so schema and visible prices cannot drift.

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thezcs.com/pricing#webpage",
    "url": "https://thezcs.com/pricing",
    "name": "Pricing | Zenith Care Solutions",
    "isPartOf": { "@id": "https://thezcs.com/#website" },
    "breadcrumb": { "@id": "https://thezcs.com/pricing#breadcrumb" },
    "mainEntity": { "@id": "https://thezcs.com/pricing#catalog" }
  },
  {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": "https://thezcs.com/pricing#catalog",
    "name": "Zenith Care Solutions pricing",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "[plan name]",
        "description": "[what is included]",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "[number as on page]",
          "priceCurrency": "USD",
          "unitText": "month"
        },
        "itemOffered": { "@id": "https://thezcs.com/services/care-management#service" },
        "seller": { "@id": "https://thezcs.com/#organization" }
      }
    ]
  }
]
```

### 4.7 ROI calculator `/roi-calculator` (replace the Service)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://thezcs.com/roi-calculator#app",
  "name": "CCM Revenue Calculator",
  "url": "https://thezcs.com/roi-calculator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any (web browser)",
  "description": "Estimates representative Medicare CCM reimbursement for a practice panel. Actual results vary.",
  "browserRequirements": "Requires JavaScript",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "provider": { "@id": "https://thezcs.com/#organization" },
  "audience": { "@type": "MedicalAudience", "audienceType": "Physician" }
}
```

### 4.8 Contact `/contact` and Resources `/resources`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://thezcs.com/contact#webpage",
    "url": "https://thezcs.com/contact",
    "name": "Contact Zenith Care Solutions",
    "isPartOf": { "@id": "https://thezcs.com/#website" },
    "about": { "@id": "https://thezcs.com/#organization" },
    "breadcrumb": { "@id": "https://thezcs.com/contact#breadcrumb" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://thezcs.com/resources#blog",
    "url": "https://thezcs.com/resources",
    "name": "Zenith Care Solutions Resources",
    "inLanguage": "en-US",
    "publisher": { "@id": "https://thezcs.com/#organization" },
    "blogPost": [
      { "@id": "https://thezcs.com/resources/ccm-consent-requirements#article" },
      { "@id": "https://thezcs.com/resources/cpt-99439-vs-99490#article" }
    ]
  }
]
```

Generate the `blogPost` refs from the posts list.

### 4.9 Article `/resources/[slug]` (replace current Article)

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thezcs.com/resources/ccm-consent-requirements#webpage",
    "url": "https://thezcs.com/resources/ccm-consent-requirements",
    "name": "CCM Consent Requirements: What CMS Requires and How to Document It",
    "isPartOf": { "@id": "https://thezcs.com/resources#blog" },
    "breadcrumb": { "@id": "https://thezcs.com/resources/ccm-consent-requirements#breadcrumb" },
    "reviewedBy": { "@id": "https://thezcs.com/about#mu" },
    "primaryImageOfPage": { "@id": "https://thezcs.com/resources/ccm-consent-requirements#image" },
    "mainEntity": { "@id": "https://thezcs.com/resources/ccm-consent-requirements#article" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "https://thezcs.com/resources/ccm-consent-requirements#article",
    "headline": "CCM Consent Requirements: What CMS Requires and How to Document It",
    "description": "Practical guide to Medicare CCM consent requirements: what must be documented, common mistakes, and how an outsourced CCM partner handles it.",
    "inLanguage": "en-US",
    "articleSection": "Care Management",
    "datePublished": "2026-10-18T00:00:00Z",
    "dateModified": "2026-10-18T00:00:00Z",
    "mainEntityOfPage": { "@id": "https://thezcs.com/resources/ccm-consent-requirements#webpage" },
    "author": { "@id": "https://thezcs.com/#organization" },
    "reviewedBy": { "@id": "https://thezcs.com/about#mu" },
    "publisher": { "@id": "https://thezcs.com/#organization" },
    "image": { "@id": "https://thezcs.com/resources/ccm-consent-requirements#image" },
    "isPartOf": { "@id": "https://thezcs.com/resources#blog" }
  },
  {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": "https://thezcs.com/resources/ccm-consent-requirements#image",
    "url": "https://thezcs.com/resources/ccm-consent-requirements.webp",
    "contentUrl": "https://thezcs.com/resources/ccm-consent-requirements.webp"
  }
]
```

Author stays the Organization because the owner confirmed content is company-drafted and PharmD-reviewed (`reviewer` in `site.ts`). `Article` itself does not define `reviewedBy`; it is valid on the `WebPage` node, and also accepted by parsers on Article via the CreativeWork inheritance chain. Add `wordCount` and image `width`/`height` if the frontmatter exposes them. Replace the midnight-UTC dates with real publish times when known.

### 4.10 CPT code pages `/services/care-management/cpt-codes/[code]`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thezcs.com/services/care-management/cpt-codes/99490#webpage",
    "url": "https://thezcs.com/services/care-management/cpt-codes/99490",
    "name": "CPT 99490: Chronic Care Management",
    "isPartOf": { "@id": "https://thezcs.com/#website" },
    "breadcrumb": { "@id": "https://thezcs.com/services/care-management/cpt-codes/99490#breadcrumb" },
    "about": { "@id": "https://thezcs.com/services/care-management/cpt-codes/99490#code" },
    "mainEntity": { "@id": "https://thezcs.com/services/care-management/cpt-codes/99490#faq" },
    "reviewedBy": { "@id": "https://thezcs.com/about#mu" }
  },
  {
    "@context": "https://schema.org",
    "@type": "MedicalCode",
    "@id": "https://thezcs.com/services/care-management/cpt-codes/99490#code",
    "codeValue": "99490",
    "codingSystem": "CPT",
    "name": "[official short descriptor from the page]"
  }
]
```

### 4.11 Denial code pages `/services/revenue-cycle-management/denial-codes/[code]`

```json
[
  {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://thezcs.com/services/revenue-cycle-management/denial-codes#set",
    "name": "Claim denial codes",
    "url": "https://thezcs.com/services/revenue-cycle-management/denial-codes"
  },
  {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": "https://thezcs.com/services/revenue-cycle-management/denial-codes/[code]#term",
    "termCode": "[code, e.g. CO-45]",
    "name": "[code title from the page]",
    "description": "[plain-text meaning from the page]",
    "inDefinedTermSet": { "@id": "https://thezcs.com/services/revenue-cycle-management/denial-codes#set" },
    "url": "https://thezcs.com/services/revenue-cycle-management/denial-codes/[code]"
  }
]
```

The index page emits the `DefinedTermSet` once; each detail page emits only its `DefinedTerm` plus the WebPage and breadcrumb.

### 4.12 Breadcrumb (every inner page, shape for reference)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://thezcs.com/hipaa-compliance#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://thezcs.com/" },
    { "@type": "ListItem", "position": 2, "name": "HIPAA Compliance", "item": "https://thezcs.com/hipaa-compliance" }
  ]
}
```

Pair it with a generic `WebPage` node (`webPageLd`) on `/hipaa-compliance`, `/security`, `/how-it-works`, `/service-delivery`, `/privacy`, `/terms`, `/cookies`, `/refund-policy`, `/hipaa-statement`, `/accessibility`, `/complaints`, `/data-request`.

## 5. Rollout order (highest to lowest impact)

1. `webPageLd` + `@id` on Service/Person/Article/FAQ/Breadcrumb, `/#organization` ids (3.1 to 3.3). Unlocks everything else.
2. Article `reviewedBy` + `isPartOf` Blog (4.8, 4.9).
3. Organization enrichment (4.1).
4. Service catalog per category and Pricing OfferCatalog (4.3, 4.6).
5. CPT `MedicalCode` and denial `DefinedTerm` (4.10, 4.11): biggest page count.
6. ROI `WebApplication`, About/Contact types (4.5, 4.7, 4.8).
7. Typed WebPage on the remaining pages (4.12).

## 6. Validation

- Rich Results Test: https://search.google.com/test/rich-results (Breadcrumb, Article; FAQ will show "eligible" but not render in SERP).
- Schema Markup Validator: https://validator.schema.org (the only tool that checks `MedicalCode`, `DefinedTerm`, `WebApplication`).
- Add a build-time check in the existing dev self-check: every `@id` referenced is defined on the same page or is one of the site-level ids.
- After deploy, request indexing for `/`, one article, one CPT page in Search Console and watch the Enhancements report for 2 weeks.

## 7. Not verified

Live fetch covered 12 URLs, not all of the sitemap. Plan names and prices in 4.6 and category sub-services in 4.3 are placeholders to fill from the page source. Search Console data was not available, so impact ranking is based on page counts and schema theory, not measured impressions.
