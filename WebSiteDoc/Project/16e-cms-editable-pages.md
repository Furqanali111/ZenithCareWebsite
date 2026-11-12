# Editable page copy in Keystatic (`/keystatic`)

Five more items under "Singletons" in the editor. Each edits one JSON file in `web/content/` that the page reads at build time. Schemas: `web/keystatic/editable-pages.ts`. Publishing flow is the same as the blog (see `16-keystatic-cms.md`): branch, save, PR, squash-merge.

| Editor item | File | Page |
|---|---|---|
| Service category pages | `content/categories.json` | `/services/care-management`, `/services/revenue-cycle-management`, `/services/virtual-staffing` (heading, intro, image rows, FAQs) |
| Who we serve pages | `content/specialties.json` | `/who-we-serve/{primary-care,internal-medicine,geriatrics}` (heading, intro, "why" section, conditions, FAQs) |
| Home page text | `content/home.json` | `/` (hero paragraph, section headings and paragraphs, steps, why Zenith, FAQs, closing call to action) |
| About page text | `content/about.json` | `/about` (all prose, pillars, steps, trust section) |
| Site settings | `content/site.json` | contact details, social links, footer text, founder intros (`lib/site.ts`, footer) |

## Rules

- The text was moved out of the code verbatim. The built HTML of every page is identical to before the change.
- The JSON is the source. The old text in code is gone, so edits take effect.
- Home and category FAQs also feed FAQPage schema. An empty question or answer is blocked in the editor.
- Google title and meta description of these pages are still edited in "Page titles and descriptions", not here.
- Quote marks around the About pull quote are added by the page. Type the quote without them.
- Do not rename the "Name" of a founder in Site settings: the intro is matched by name.

## Site settings precedence

For each value that also has an environment variable (`NEXT_PUBLIC_CONTACT_EMAIL`, `_CONTACT_PHONE`, `_WHATSAPP_NUMBER`, `_CALENDLY_URL`, `_BUSINESS_HOURS`, `_FACEBOOK_URL`, `_INSTAGRAM_URL`):

1. If the variable is set in Vercel (even to an empty string), it wins.
2. Otherwise the value in Site settings is used.

So existing deployments keep working untouched. To let the SEO manager control a value, remove that variable in Vercel. Reason for env-first: a stale CMS edit can never override a production value the developer pinned on purpose. No secrets live in this file; `NEXT_PUBLIC_*` values are public anyway. Not editable here: site name, legal name, site URL, EIN (identity and canonical URL).

## Not made editable (needs layout or carries numbers)

- Home hero H1 and the revenue band (computed from the ROI figures in `lib/roi.ts`).
- Specialty page example panel size, enrollment rate and the geriatrics revenue note (numbers and claims).
- About page hero H1 (contains a line break span), the "What we do" cards (come from the service registry) and the Company information list.
- Category and specialty meta titles and descriptions (already editable in "Page titles and descriptions"; the code text is only a fallback).
- Section headings of the footer, link lists, the "From the blog" heading and button labels.
