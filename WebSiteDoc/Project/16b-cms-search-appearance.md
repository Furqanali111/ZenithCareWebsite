# Keystatic: search appearance controls

Extends [16-keystatic-cms.md](16-keystatic-cms.md). Everything is optional: blank means the current behaviour.

## Where to edit

| Control | Where in /keystatic | Effect |
|---|---|---|
| Share card headline and subtext | "Page titles and descriptions", "Service and specialty page titles" (per page), Blog posts (per post) | Text printed on the generated Open Graph image (`lib/og.tsx`). Posts default to the title and meta description. |
| Canonical URL | Blog posts | Replaces the page's own canonical link. Use only for syndicated articles. |
| Hide from Google (noindex) | Both page singletons | Adds `robots: noindex, nofollow` and removes the path from `app/sitemap.ts`. |
| Titles and descriptions for `/services/<slug>` and `/who-we-serve/<specialty>` | "Service and specialty page titles" (`content/page-seo-services.json`) | Wins over the text in `lib/services.ts` and the specialty page. Seeded with the current text. |
| About and Mentions | Blog posts | Added to the Article JSON-LD as `Thing` nodes (name plus optional `sameAs` URL). |

## How it is wired

- `lib/seo.tsx` merges `page-seo.json` and `page-seo-services.json` into one path map. `pageMetadata` reads title, description and noindex from it. `isNoindexed(path)` feeds the sitemap. `ogText(path, ...)` feeds `ogImage({ path })`.
- Each `opengraph-image.tsx` passes its `path` to `ogImage`. CPT and denial code cards are not editable here.
- Schemas for the new singleton and shared fields live in `web/keystatic/search-appearance.ts`.
- A new service or specialty page needs a new entry in `page-seo-services.json` only if its text should be editable.

## Search snippet preview

Keystatic 0.6.9 has no live counter or custom preview in the field API without a custom component. Instead each field states its limit and enforces it with validation (SEO title 36 plus site name, meta description 160), so an over-long value shows a red error and cannot be saved.
