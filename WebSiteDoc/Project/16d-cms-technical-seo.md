# Keystatic: technical SEO controls

Five settings screens in /keystatic. Schemas live in `web/keystatic/technical-seo.ts`. Each saves a JSON file in `web/content/`. Defaults (empty lists) leave the site exactly as it was. A bad value fails `pnpm build` loudly instead of shipping.

| Screen | File | Read by | Build fails when |
|---|---|---|---|
| Redirects | `redirects.json` | `next.config.ts` (`editorRedirects`) | old path has `:`, `*`, `(`, `?`, is /keystatic, /api or /_next; the same old path appears twice; the redirect points back at itself; a section rule ends in `/` or is `/` |
| Sitemap controls | `sitemap-controls.json` | `app/sitemap.ts` | an excluded or tuned path is not a real sitemap page |
| llms.txt | `llms-txt.json` | `app/llms.txt/route.ts` | an extra link URL does not start with `/` or `https://` |
| Structured data | `structured-data.json` | `lib/seo.tsx`, `components/faq-section.tsx` | none (the editor validates phone and https URLs) |
| Breadcrumb labels | `breadcrumb-labels.json` | `components/breadcrumbs.tsx`, `breadcrumbLd` | none |

## Notes

- Redirects: "Single page" is an exact path. "Whole section" maps `/old-section/*` to `/new-section/*` (Next `:path*`), and also the section root. Permanent is on by default (308).
- Sitemap: exclusion hides a page from the sitemap only. Use the page's noindex setting to keep it out of Google. Priority and change frequency are written only for pages that have an entry.
- llms.txt: a blank summary keeps the built-in text. Extra links appear under "Additional pages".
- Structured data: the FAQ switch removes the FAQPage markup, not the visible FAQ. It works on pages that pass their path: home, /faq and blog posts. Service, specialty and CPT/denial pages do not pass a path yet; add `path="..."` to their `FaqSection` to enable it. Phone goes into the Organization contact point and extra profile URLs are appended to `sameAs`. Only real company data should be entered. Nothing is invented.
- Breadcrumbs: the label replaces the visible text and the BreadcrumbList name for that path.
