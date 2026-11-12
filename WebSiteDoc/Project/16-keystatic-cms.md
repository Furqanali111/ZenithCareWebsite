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

## Known quirks

- Saving rewrites some formatting: curly quotes instead of `&rsquo;`, `*` bullets instead of `-`, tables re-aligned, `~` escaped as `\~`. The rendered page is the same. Always read the PR diff.
- Keystatic's editor drops text that follows a line break inside **bold**, *italic* or link text. The existing posts were normalized to avoid this. In new posts keep a bold phrase on one line.
- A new post needs no code change: the post list is read from the folder.
- Rollback: revert the PR.
