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

Not yet verified against a real GitHub App: the login flow, saving to a branch, the open and Publish flows (see Publishing workflow), and whether the CSP in `next.config.ts` allows everything the editor needs (`api.github.com` and GitHub avatars are allowed).

## Publishing workflow

For the SEO team. You never need to know about branches or pull requests.

1. Open `/keystatic` and sign in with GitHub. If the address shows `develop`, the editor moves you to your own private copy of the site by itself. The address then ends in `feature/content-<your github name>`. This is normal.
2. Edit and press **Save** as often as you like. Saving keeps your work private. Nothing is live.
3. Press **Publish** (bottom right) when you want your changes live. The site checks them, builds, and goes live a few minutes later. Allow about 15 minutes in all.

What the pill at the bottom right says:

| You see | It means |
|---|---|
| No changes to publish. | Nothing saved since the last publish. |
| Your changes are private until you publish. + **Publish** | You have saved changes. |
| Publishing. This takes a few minutes. | Checking and building. Save, Create and Delete are paused, a popup says so: "Publishing. You can save again in a few minutes." |
| Published. Live in a few minutes. + **Reload** | Done. The live site updates a few minutes after this. Press Reload to load the editor again. |
| the reason, then **Publish again** | Not published, and why (below). Fix it, save, press Publish again. |
| This is taking longer than usual. Ask Furqan to look. | Nothing happened for 15 minutes. |

What is refused, and how to fix it. The reason is shown in plain English, with the file name:

- Anything that is not text, data or an image in the content folders (code, settings, a folder starting with a dot). Only a developer can change those. Ask Furqan.
- Code inside an article: a line starting with the word import or export, a curly bracket `{`, or a `<` that starts anything other than a Callout, BookCall or Toc box. Remove it, or put a backslash before the bracket or the `<` to show it as text.
- A link or special file instead of a normal file, or an image that is not .webp, .jpg, .png or .avif. Add the file again as a normal file.
- An article whose top section (between the two `---` lines) is broken, or a content file that is not valid JSON. Fix the typing mistake.
- A build error, shown as "The site could not be built with this edit: ...". Usually a field that is empty or too long, or an ID used twice. Fix that field.
- "Someone else changed the same text. Ask Furqan to combine the two edits." Two people edited the same text.

After a refusal the private branch stays as it is. Fix the text, press Save, then press **Publish again**. A refused publish is not retried by itself.

If you are not signed in, or the sign-in expired, the pill says so: open `/keystatic`, sign in again, then try again. A person without write access gets "Your GitHub account cannot publish to this site. Ask Furqan for access."

Developers (not for the SEO team):

- `web/app/keystatic/branch-guard.tsx` (production only) does the open flow: on `/keystatic/branch/develop`, `deployment-branch` or `main` it calls `POST /api/publish {action:"open"}`, replaces the branch in the address with `feature/content-<login>` and sends a `popstate` so Keystatic's router loads it. If that fails, an amber warning stays and Save, Create and Delete are stopped with a popup.
- The pill polls `GET /api/publish` every 15 seconds (paused while the tab is hidden). The route (`web/app/api/publish/route.ts`) uses the person's own GitHub token from Keystatic's cookie, accepts same-origin JSON only, and needs push rights on the repo. The branch name is built on the server from the login, lower case.
- Publish opens a PR from `feature/content-<login>` into `develop`. `.github/workflows/publish-content.yml` then checks, builds, squash-merges and deploys it (see `17-auto-publish-design.md`). It force-updates the branch onto the new `develop` afterwards, so later saves are kept. Failures are a PR comment from `github-actions[bot]` starting `<!-- publish-failed:<sha> -->`; the PR is closed, and Publish again opens a new one.
- Re-running a finished run with "Re-run all jobs" ends quietly with no message. To retry, press Publish again (new PR) or reopen the PR.
- On any other branch (a developer's own) the pill is the old one: "Create pull request" or "PR #N is open". Keystatic's own branch menu stays visible and is not hidden.
- Real guard on `develop` is GitHub branch protection. The popup is only a reminder.
- Setup, tests and the off switch: `17c-auto-publish-handover.md`.

Not verified live: the open flow with a real GitHub sign-in (the address moves and Keystatic loads the branch), the Publish and failure flows against GitHub, and the labels of Keystatic's toolbar buttons in GitHub mode (checked only in local mode).

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
- **Page titles and descriptions** edits `web/content/page-seo.json`: the Google title and meta description of the 26 main pages (home, about, pricing, FAQ, contact, resources, the service category pages, the legal pages and so on), matched by URL path. The title can be up to 60 characters. The site name is added after it and Google may cut a long title, so the dashboard warns above about 36 and checks the whole title against 60. Description 160 or fewer. Do not change the "Page URL path" of an entry.
- These files (`web/content/page-seo.json` and `page-seo-services.json`) are the only place for a page's title and description. A page with neither fails the build. The text in the page's code is a fallback only for pages with no entry.
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

- Saving rewrites some formatting: curly quotes instead of `&rsquo;`, `*` bullets instead of `-`, tables re-aligned, `~` escaped as `\~`. The rendered page is the same. Developers working on a branch: read the diff. Edits published from the editor are not read by a person.
- Keystatic's editor drops text that follows a line break inside **bold**, *italic* or link text. The existing posts were normalized to avoid this. In new posts keep a bold phrase on one line.
- A new post needs no code change: the post list is read from the folder.
- Rollback: revert the squash commit (`fix(content): publish edits by <login>`) on `develop` with a PR.
