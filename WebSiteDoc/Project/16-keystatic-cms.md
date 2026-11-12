# Keystatic blog editor (`/keystatic`)

A web editor for the blog. It edits the MDX files in `web/content/posts/` in the git repo. No database, no extra hosting cost. Config: `web/keystatic.config.ts`.

## Using it locally

```bash
cd web && pnpm dev
```

Open `http://localhost:3000/keystatic`. In dev it reads and writes the local files directly, with no login. Review the result with `git diff`, then commit on a feature branch as usual.

## Using it in production (one-time setup, not done yet)

In production the editor signs in with GitHub and saves to the repo. Until the secrets exist, `/keystatic` loads but the API answers 404, so nobody can edit and the build is not affected.

1. Create a GitHub App owned by the repo owner. Permissions: Contents (read and write) and Pull requests (read and write). Callback URL: `https://thezcs.com/api/keystatic/github/oauth/callback`. Install it on `Furqanali111/ZenithCareWebsite` only.
2. Set these in Vercel for **Production only**. Set all four together: the editor stays off until `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` and `KEYSTATIC_SECRET` all exist. Edit at `https://thezcs.com/keystatic`; the callback URL is fixed to that domain, so login cannot work on Vercel preview addresses (previews are only for viewing the site).
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET` (any random string of 32 or more characters)
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (the GitHub App's slug)
3. Only people with write access to the repo can save. Add the SEO manager as a collaborator.

Not yet verified against a real GitHub App: the login flow, saving to a branch, and whether the CSP in `next.config.ts` allows everything the editor needs (`api.github.com` and GitHub avatars are allowed).

## Publishing workflow

1. In the editor, create a new branch (branch picker, top left) before changing anything. Never save on `develop`; protect `develop` with branch protection so it cannot happen.
2. Edit and save. Click "Create pull request".
3. Check the Vercel preview on the PR, then squash-merge. Merging is the publish step.

The editor adds a small helper on top of Keystatic (`web/app/keystatic/branch-guard.tsx`, production only):
- On `develop`, `deployment-branch` or `main`, a Save click (or Ctrl/Cmd+S) is stopped and a popup says to create a branch first. This is a reminder only; the real block is GitHub branch protection on `develop`.
- On any other branch, a pill at the bottom right shows "Create pull request" (opens GitHub's compare page against `develop`). Once a PR is open it shows "PR #N is open" with a link. Every later Save adds a commit to that branch, which updates the PR; no new PR is needed.
- It cannot change Keystatic's own toolbar buttons. It was tested with a faked branch address in dev, not with a real GitHub login.

## Field rules

- The URL slug is the file name. Changing it changes the post's URL, so add a redirect in `web/next.config.ts` first.
- SEO title 60 characters or fewer, meta description 160 or fewer (the editor enforces both).
- "Draft" posts are saved but never listed, routed, or put in the sitemap.
- Cover image is uploaded in the editor. Keystatic saves it as `web/public/resources/<slug>/coverImage.<ext>` and stores `/resources/<slug>/coverImage.<ext>` in the post. Use a landscape `.webp` or `.jpg` about 1280 px wide and under 200 KB; the page crops it to a wide banner. The 18 existing covers were moved to this layout. Images dropped into the body upload to `public/resources/body/<slug>/`.
- After changing a slug, check the PR diff: the cover image folder `public/resources/<slug>/` should have moved with it. This has not been tested.
- No patient information in any post.

## FAQ and page titles

The editor sidebar also has two items under "Singletons" (single files, not lists):

- **FAQ** edits `web/content/faq.json` (24 questions). It feeds `/faq`, the chatbot and the FAQPage schema. Each question needs a unique ID (lowercase words joined by dashes). A duplicate ID or an empty question or answer fails the build, on purpose. Do not change an ID once published.
- **Page titles and descriptions** edits `web/content/page-seo.json`: the Google title and meta description of the 26 main pages (home, about, pricing, FAQ, contact, resources, the service category pages, the legal pages and so on), matched by URL path. Keep the title to 36 characters or fewer: the site name is added after it and the whole title should stay under 60. Description 160 or fewer. Do not change the "Page URL path" of an entry.
- These values win over the text written in the page's code. That code text is only a fallback, so editing it has no effect while an entry exists.
- These change the page's title tag, meta description and the social sharing text (og:title, og:description, twitter). They do not change the name inside the page's structured data, the social preview image, or the visible headings.
- Not covered: blog post titles (edit the post itself), the individual CPT code, denial code, service and specialty pages (their text comes from code), and the headings and paragraphs on the pages themselves. Those still need a developer.

## Post extras, redirects, CPT and denial code pages

- **Post fields**: "Cover image alt text" (blank reuses the title) and "Hide from Google (noindex)" (robots noindex plus left out of the sitemap, still reachable by URL). Each post and code page has a preview link to the live page (live only after the PR is merged; in dev it opens localhost).
- **Redirects** (singleton): edits `web/content/redirects.json`, read by `next.config.ts`. Use it when a post slug or page address changes. It has single-page rules and whole-section rules; details in `16d-cms-technical-seo.md`. A bad entry fails the build on purpose.
- More controls, each with its own doc: `16b-cms-search-appearance.md` (share cards, canonical, noindex, service titles, schema extras), `16c-cms-blog-content.md` (body blocks, related posts, series, scheduled publishing, sources, link report), `16d-cms-technical-seo.md` (redirects, sitemap, llms.txt, schema toggles, breadcrumbs), `16e-cms-editable-pages.md` (categories, specialties, home, about, site settings).
- **CPT code pages** and **Denial code pages** (collections): one JSON file per code in `web/content/cpt-codes/` and `web/content/denial-codes/`. The file name is the page URL, so never rename a code once published (add a redirect if you must). The build still fails on a thin entry: CPT needs 3+ requirements, 2+ pitfalls, 2+ FAQs; denial needs 3+ causes, 3+ fixes, 2+ prevention, 2+ FAQs; meta description 140 to 160 characters; full page title 60 or fewer; "often billed with" and "related" must point to codes that exist.
- In a CPT "Rate text", `{ccm:99490}` expands to the rate in `web/lib/roi.ts` so CCM figures cannot drift. Other rates are plain text.
- Claims hygiene still applies: paraphrase, never copy AMA or X12 text, and keep rates as "2026 Medicare national averages". Have the clinical reviewer read any change to a CPT or denial page.
- Not done: a per-post reviewer field (only one reviewer exists), reusable body blocks, image upload size checks.

## Known quirks

- Saving rewrites some formatting: curly quotes instead of `&rsquo;`, `*` bullets instead of `-`, tables re-aligned, `~` escaped as `\~`. The rendered page is the same. Always read the PR diff.
- Keystatic's editor drops text that follows a line break inside **bold**, *italic* or link text. The existing posts were normalized to avoid this. In new posts keep a bold phrase on one line.
- A new post needs no code change: the post list is read from the folder.
- Rollback: revert the PR.
