# 02. Technical SEO and on-page audit

## Technical SEO (verified unless marked)

| Check | Result | Evidence |
|---|---|---|
| robots.txt | Pass. `User-agent: *`, `Allow: /`, sitemap declared, no `Host` directive | live fetch, `app/robots.ts` |
| XML sitemap | Pass on coverage (52 URLs, unique, all 200). Weak on `lastmod` (see below) | live fetch |
| Canonical | Pass. Self-referencing on all 52. Home canonical is `https://thezcs.com` (no slash), equivalent to `/` | crawl |
| Robots meta / X-Robots-Tag | None present. Nothing is accidentally noindex | crawl headers and `<meta>` |
| Protocol and host | `http` and `www` each 308 to `https://thezcs.com/` in one hop; `/services/` 308 to `/services`; `/Services` is 404 | curl |
| Soft 404 | Pass. `/nonexistent-xyz` returns a true 404 | curl |
| Redirect chains and loops | None found | curl |
| Broken internal links | 0 of 53 unique hrefs | status sweep |
| Orphans | None. Every URL is in the sitemap and reached from nav/footer or content | link graph |
| Click depth | Max 2 from home (all pages linked from global nav or footer) | link graph |
| Server rendering | Pass. Titles, H1, canonical, JSON-LD and body text are in initial HTML for all pages (crawl used non-JS fetch) | crawl |
| Security / transport headers | HSTS (2y), CSP, X-Frame-Options, nosniff, Referrer-Policy, brotli. CSP uses `unsafe-inline` (security note, not SEO) | headers |
| Pagination | N/A (no paginated archives) | code |
| hreflang | N/A (single en-US site) | code |
| Fonts and JS | Two woff2 preloads via `Link` header; 12 script tags on home. Impact not measurable here | headers, HTML |
| Core Web Vitals (LCP, INP, CLS) | **Unavailable.** PSI API returned 429 on all 3 attempts. Local Lighthouse not run (needs an install, which was not approved). TTFB sampled via curl: 0.35 to 1.0 s, mostly CDN hits (single samples, indicative only) | curl timing |
| Mobile rendering | **Not measured.** Viewport meta present. Needs a device-emulated run | HTML |
| GA/GTM | GTM script referenced in HTML; Vercel analytics script not. Consent/cookie notice not audited | HTML |

### Sitemap notes (F-10)
`app/sitemap.ts` stamps 38 URLs with the same hard-coded `SITE_LAST_UPDATED` (2026-10-18), while the 14 articles use their own `updatedAt`. Google uses `lastmod` only when it is consistently accurate; a single shared date neither helps nor harms much. `priority` and `changeFrequency` are ignored by Google. No change needed for correctness; low-value cleanup is to derive `lastmod` from real content changes.

## On-page audit: summary of 52 pages

| Element | Result |
|---|---|
| Titles | 52/52 unique. 1 over 60 chars (home, 63). Range 31 to 63 |
| Descriptions | 52/52 unique, 90 to 154 chars. 7 are under 110 (see F-12) |
| H1 | Exactly 1 per page |
| H2 | Present on all content pages; home has 8 |
| Images | Only logo and OG on most pages; 0 images missing alt. Articles carry 3 `img` tags each (alt present). No hero or diagram imagery on service pages |
| Word count (rendered, includes nav/footer) | Services 650 to 990; specialties 820 to 850; articles 1,200 to 1,990; legal 450 to 1,140 |
| Open Graph / Twitter | Present, dynamic OG image 1200x630 with alt |

### Page-by-page (key pages; all 52 raw rows are in `data/live-crawl-2026-10-24.json`)

| URL | Title (chars) | H1 | Assessment |
|---|---|---|---|
| `/` | "Care Management, Billing & Staffing" (63) | "Care management, billing, and staffing for your practice." | Brand-forward but no head term. Three service lines compete for one title. Suggest including "Chronic Care Management" or "CCM" |
| `/services` | "Our Services" (36) | Benefit-led H1 | Title is generic; hub for 14 services |
| `/services/care-management` | "Care Management Programs" (48) | Medicare care-management programs... | Duplicate Service schema (F-07) |
| `/services/chronic-care-management` | "Chronic Care Management (CCM)" (53) | CCM that turns chronic patients into revenue | Money page. Rates conflict with home (F-01). Good candidate for links from articles |
| `/services/remote-patient-monitoring` | "Remote Patient Monitoring (RPM)" (55) | Good | Overlaps `rpm-setup-guide` and `ccm-vs-rpm-vs-pcm` (F-05) |
| `/services/medical-billing` etc. | Good | Good | RCM pages are the thinnest of the money pages (730 to 770 words) |
| `/who-we-serve/*` | "Services for Primary Care" | Good | 108 to 114 char descriptions; fine but short |
| `/pricing` | "Pricing" (31) | "Pricing" | Generic title and H1; no prices by design (`amount: null`, see `13-deferred-items.md`) |
| `/how-it-works` | "How It Works" (36) | "How It Works" | Generic; no keyword context |
| `/faq` | "Frequently Asked Questions" (50) | same | Generic |
| `/contact` | "Contact" (31) | "Pick whichever is easiest." | Title weak; H1 non-descriptive |
| `/resources` | "Resources" (33) | "Articles for practices evaluating CCM." | Description 101 chars; H1 undersells RCM and staffing articles |
| `/roi-calculator` | "CCM ROI Calculator" (42) | Good | 455 words, a tool page; ensure result assumptions are visible text |
| Articles (14) | All keyword-bearing, 45 to 58 chars | Descriptive | Strongest content on site. Need links in and a credentialed reviewer |
| Legal (7) | Descriptive | Fine | Indexable; fine to keep |

## Findings in this file

- **F-06** Home title. **F-11** Generic title/H1 on `/pricing`, `/how-it-works`, `/faq`, `/contact`, `/services`. **F-12** Seven short descriptions (`/resources` 101, `/refund-policy` 90, `/complaints` 102, `/security` 109, RTM 99, AR 105, geriatrics 108). Short descriptions are not a ranking factor; fix opportunistically.

Direct vs indirect: titles and H1 relevance are direct relevance signals; meta descriptions only influence CTR (indirect); `lastmod` hygiene is a crawl signal (indirect).
