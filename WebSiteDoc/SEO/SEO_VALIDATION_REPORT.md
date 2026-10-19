# SEO Validation Report

**Site:** https://www.thezcs.com/
**Date:** 2026-10-19
**Branch:** `feature/seo-keyword-clustering-service-pages`

## 1. Build and lint

| Check | Command | Result |
|---|---|---|
| ESLint | `npx eslint "app/services/[service]/page.tsx" lib/services.ts` | **Pass**, no errors or warnings |
| TypeScript | `npx tsc --noEmit` | **Pass**, no errors |
| Production build | `npx next build` | **Pass** — all 86 static/SSG paths generated, including all 14 `/services/[service]` pages, all 3 `/who-we-serve/[specialty]` pages, all 8 `/resources/[slug]` blog posts, all 3 category hubs |

## 2. Metadata verification

- Spot-checked the built HTML at `.next/server/app/services/remote-therapeutic-monitoring.html`: `<title>Remote Therapeutic Monitoring (RTM) Services | Zenith Care Solutions</title>` — confirms the changelog's title fix is live in the compiled output, not just the source.
- Confirmed (from the earlier audit pass) that all 14 service pages have a unique `metaTitle` and `metaDescription` in `web/lib/services.ts` — no duplicates found.
- **Known, pre-existing, unresolved finding (see audit doc):** several page titles exceed the project's 60-character budget once the " | Zenith Care Solutions" suffix (25 chars) is added. This is not new and not introduced by this change; flagged as a recommendation, not fixed, because shortening 14 established titles is a bigger editorial decision than this task's scope.

## 3. Canonical and indexability checks

- `pageMetadata()` (`web/lib/seo.tsx`) sets `alternates.canonical` from each page's own path for every page type, including all 14 service pages — unchanged by this PR, re-verified by reading the function.
- No `noindex` was added or removed anywhere in this change.
- Sitemap (`app/sitemap.ts`) and `llms.txt` (`app/llms.txt/route.ts`) both generate their blog-post entries dynamically from `getAllPosts()` and their service entries from the `services` registry — confirmed by reading both files. Neither required a manual update for this PR's changes, and neither will require one when new posts/services are added later.

## 4. Structured data (schema) validation

- Spot-checked the built HTML for `/services/chronic-care-management`: confirms a `Service` JSON-LD node with `@type`, `name`, `description`, `serviceType`, `url`, and a `provider` reference to the Organization node — correctly populated, matches visible page content, no fabricated fields.
- This pass added no new JSON-LD and changed no existing JSON-LD field. The `CrossLinkNote` additions are plain `<Link>` elements, not schema-bearing.
- **Not validated:** did not run Google's Rich Results Test (no network access to the live site from this environment, and the site is not yet deployed with these changes). Recommend running it against the 10 newly cross-linked pages after deploy, per `12-claude-requirements.md` §4's SEO-change checklist — though since no schema was touched, risk is low.

## 5. Internal links and crawlability

- Confirmed in the built HTML that the new cross-category links render correctly, e.g. `.next/server/app/services/medical-scheduler.html` contains an anchor to Transitional Care Management with the exact label specified in the changelog.
- All 10 new link targets (`/services/medical-billing`, `/services/patient-care-coordinator`, `/services/chronic-care-management`, `/services/medical-scheduler`, `/services/care-management`, `/services/revenue-cycle-management`) are themselves pages that built successfully in step 1 — no new broken links introduced.
- Did not re-run a full external link-crawl (e.g. a sitemap crawler) since the existing `15-technical-seo-audit.md` (2026-10-16) already did this for the whole site and this PR added zero new pages and zero new external links — only internal links between pages that were already confirmed healthy.

## 6. Existing routes

- All previously-existing routes still build (86 total paths, matching the architecture described in `15-technical-seo-audit.md`'s 35-page inventory plus the 8 blog posts and additional opengraph-image/robots/sitemap routes Next.js generates per page).
- No route was renamed, removed, or redirected.

## 7. Accessibility / readability of changed content

- The new `CrossLinkNote` additions reuse the exact existing component and class names (`border-t border-border/40`, `text-sm leading-relaxed text-muted-foreground`, `font-medium text-brand-accent hover:underline`) already used by the 4 pre-existing entries — no new styling, no new accessibility surface to test. These link blocks were already covered by the project's standing axe/WCAG checks on this template.

## 8. Checks that could not be completed (per task instructions, stated rather than guessed)

- **Google Search Console / Bing Webmaster Tools data** — no account access in this session. Cannot report real impressions, clicks, or indexing status. This was already the #1 flagged gap in `SEO_BASELINE_AND_KPI_TRACKER.md` and remains an account-access task for the site owner, unaffected by this PR.
- **Search volume / keyword difficulty** — no paid keyword-tool access. No numeric metrics were invented anywhere in this PR's documentation.
- **Live Rich Results Test / PageSpeed Insights against the deployed site** — this PR has not been merged or deployed; the site at the live URL does not yet reflect these changes. Recommend running both after merge.
- **Lighthouse ≥95 / Core Web Vitals** — not re-run. This PR's only runtime change is 10 short text links reusing an existing component; it adds no new JS, images, or layout shift risk, so no performance regression is expected, but the project's own hard rule (`12-claude-requirements.md` §3.5) calls for a Lighthouse check on affected pages before merge. Recommend running it on the 10 changed service pages as part of PR review.

## 9. Outstanding issues (carried into the audit doc's recommendations, not fixed here)

1. Service-page title length budget (systemic, pre-existing).
2. `/services/provider-credentialing` title doesn't contain its primary keyword.
3. 5 planned blog posts still unwritten (medical-billing-outsourcing guide, RPM setup guide, virtual-staffing-benefits, ChartSpan-alternatives, CCM-under-Medicare-Advantage).
4. GSC/Bing verification still not confirmed (account-access task, outside code).

## Verdict

Build, lint, and type-check all pass. The one metadata defect found is fixed and confirmed in the compiled output. The 10 new internal links render correctly and point only to pages that themselves build successfully. No schema, routing, or accessibility surface was touched beyond reusing an already-vetted component. Safe to open a PR; recommend a Lighthouse spot-check and the Rich Results Test after deploy per the outstanding items above.
