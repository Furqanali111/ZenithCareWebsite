# SEO fields, global settings and the SEO dashboard

For the SEO team. Everything here is edited at `/keystatic` and checked again when the site builds.

## New fields (posts and "Page titles and descriptions")

| Field | What it does |
|---|---|
| Focus keyword | The phrase the page should rank for. Feeds the dashboard score. Never printed on the page. |
| Keyword synonyms and variations | Other ways to say the keyword. Any of them satisfies the keyword checks. Plurals and endings (bill, billing, billed) already match. |
| Do not follow links (nofollow) | Adds `follow: false` to the robots tag. Noindex already implies nofollow. |
| Social title, social description | Replace the SEO title and meta description in LinkedIn, Facebook and X link cards. Blank reuses the SEO ones. |
| Social sharing image | Replaces the generated share card on that page. Upload a 1200 x 630 px .jpg or .webp. |
| Canonical URL (pages) | Pages could not set one before. Blank keeps the page's own address. Posts already had it. |
| Page type (schema), pages | Automatic keeps what the page's code uses. Or pick WebPage, AboutPage, ContactPage, CollectionPage, ItemPage, ProfilePage or FAQPage. FAQPage needs a visible FAQ on the page. |
| Schema type, posts | Article (default), BlogPosting, TechArticle or NewsArticle. |
| Custom structured data (advanced), pages and posts | Paste JSON-LD for any other schema.org type: Event, HowTo, VideoObject, anything. One object or a list. `@context` is added for you. It is checked at build, and invalid JSON or a missing `@type` fails the build with the page named. |

## Global SEO settings (new singleton)

- **Page title template.** Default `%title% | %site%`. Applies to every page title that goes through `pageMetadata`. Keep the whole title under 60 characters.
- **Default meta description.** Only used when a page has none.
- **Default social sharing image.** Used on pages that have no share card of their own (the ones that pass `rootOgImage`). Pages with their own generated card keep it.
- **Website logo.** Used in the Organization schema. Empty keeps `/logo.png`.
- Organization details (email, address, social links) already live in "Site settings". Phone and extra profile links live in "Structured data".

## Robots.txt (edit the whole file)

"Robots.txt" in the editor is the full text of `/robots.txt` (`app/robots.txt/route.ts`). The editor form and the build both refuse:

- `Disallow: /` on its own, which blocks the whole site
- a Disallow for an AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot and similar), because the site must stay open to them
- removing `Disallow: /keystatic` or `Disallow: /api/keystatic`
- any line other than User-agent, Allow, Disallow, Sitemap, Crawl-delay and # comments

A Sitemap line is added when missing. A bad text fails the build, so it never goes live.

## Live Google preview in the editor

Blog posts and every entry in "Page titles and descriptions" show a **Google preview (live)** block right under the meta description. It updates as you type:

- the search result as Google shows it on desktop and on mobile, with the site name added by the page title template
- the title and description checks: title length, description length, and the focus keyword in the title, the description and the address

It stores nothing in the content files. The checks that need the page text (keyword use, links, readability) stay on the SEO dashboard.

How it works and its limit: Keystatic gives a field only its own value, so the preview reads the title, description, address and focus keyword fields from the page by their labels (`keystatic/snippet-preview.tsx`). If one of those labels is renamed in the schema, the preview says it cannot find the fields. The cut-off in the preview is by characters (about 60 for the title), while Google cuts by pixel width, so it is close but not exact.

## SEO dashboard

Two ways in (`web/proxy.ts`):

1. **GitHub sign-in.** Sign in at `/keystatic` once with a GitHub account that can write to the repo, then open `/seo-dashboard`. Access follows GitHub: remove someone from the repo and they lose the dashboard within about five minutes. The header shows who is signed in.
2. **Shared password**, for team members with no GitHub access. Set `SEO_DASHBOARD_PASSWORD` in Vercel (Production and Preview) and share it. The browser asks for a user name (anything) and the password.

While the password is unset, anyone who is not a signed-in repo writer gets 404 in production. Local dev is open.

`/seo-dashboard` lists every post and every page in the page SEO files, worst score first.

- Columns: score, focus keyword, SEO title length, meta description status (Missing, Too short, Good, Too long), indexing status.
- Open a row for the Google desktop and mobile preview, the SEO checklist, the readability checklist, link suggestions (posts), a quick edit form, and a link to the full editor.
- The page is rendered when opened. Post text comes from the content files. The text of pages written in code (home, services, about) is read from the live site and refreshes every few minutes. Metadata edits show on the dashboard after the next deploy.
- The page is noindex and not in the sitemap.

### Filter, sort, search, export

Above the list: search by name, address, title or keyword, filter by type, and a Show menu (score under 80, no focus keyword, description problem, hidden from Google, duplicates, link/sitemap/canonical problems, edit waiting in a pull request, and when Search Console is connected, seen often but rarely clicked). Sort by score, name, title length, clicks or impressions. **Download CSV** saves exactly what is on screen, with the problems listed per row.

### Edit in a table

Tick **Edit in a table** to edit SEO title, meta description, focus keyword and noindex for many rows at once. Changed rows are highlighted and checked with the same rules as the editor. **Save** sends up to 50 changed rows per click as ONE commit in your own pull request (a fixed few GitHub calls, however many rows). Once that pull request is merged or closed, the next save deletes the old `feature/seo-edits-<name>` branch and cuts a fresh one from develop, so squash-merged history never comes back. A branch with commits but no pull request yet is kept.

People who sign in only with the shared password see the dashboard read only. Rows for CPT and denial code pages are read only too (edit them in their own collections); their keyword is the code itself. Scoring: a page with no focus keyword fails the keyword checks. Click rate is judged against the page position. Page text is cached per page for the life of a deployment. Rows with an open dashboard pull request show an **Edit in a pull request** link, found from the commit titles of open `feature/seo-edits-*` pull requests.

### Site-wide checks

The per-page score cannot see problems that need other pages. These show under "Across the site" on each row and in the top tiles:

- duplicate SEO title, meta description or focus keyword between indexable pages (keyword duplicates compete for one search)
- an internal link to an address that is not in the live sitemap (possibly broken), or to an address that redirects (link straight to the new one)
- images with no alt text in the page text
- indexable page missing from the sitemap, or a hidden page listed in it
- a canonical that points to another page or another site

Limits: the link check uses the live sitemap as the list of valid addresses, it does not request each link. A real page that is hidden from the sitemap shows as possibly broken. Redirect chains (a to b to c) are flattened by the redirect workflow.

### Search Console numbers (optional)

With `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY` and `GSC_SITE_URL` set (steps in `web/.env.example`), each row shows clicks, impressions, average position and the top five searches over the last 28 days, and warns when the focus keyword is not among them. Read only, cached for an hour. Without them nothing breaks: the columns simply do not appear.

### Score history

**Record today's scores** adds the date, average score and counts to `content/seo-history.json` through a pull request, and the chart above the list draws the trend after it is merged and deployed. It is manual (weekly is enough) because the site has no database: a snapshot per deploy would need one.

### Quick edit

Each row has a form for SEO title, meta description, focus keyword and noindex, with character counters. Save does this:

- **On the live site:** commits the change to the editor's own branch (`feature/seo-edits-<github name>`) and opens one pull request against develop, or adds to the one already open. Nothing goes live until the PR is reviewed, merged and deployed. The editor must have signed in at `/keystatic` once (the same GitHub login), and GitHub decides who may write. If not signed in, the form says so.
- **In local dev:** writes the content file directly, like the editor does.

Only these four fields are quick-editable. Everything else (social card, schema, canonical) stays in the full editor. The save route is behind the same password as the dashboard and only accepts same-origin requests.

### Link suggestions

For each post, up to 5 pages it could link to but does not. A page ranks higher when its focus keyword appears in the post text, then by shared tags. Posts with no tags and pages with no focus keyword get none, so fill those in.

### Readability

Sentence length (25% or less over 20 words), paragraph length (none over 150 words), a subheading every 300 words, and Flesch reading ease (45 or more). Billing topics often score lower, so treat it as a guide. Passive voice and transition words are not checked.

### How the score works

Weighted checklist. Pass counts full, "Improve" counts half, "Fix" counts zero. Skipped checks are left out, not failed.

Readability checks count toward the same score. Focus keyword set, SEO title 30 to 60 characters, meta description 140 to 160, keyword in title, in description, in URL, in first paragraph, in a heading, usage 0.5% to 2.5%, 300+ words, 2+ internal links, 1+ external link, image alt text.

Pages written in code are analysed from their rendered text, so they get the same checks as posts. If a page cannot be read (for example a protected preview deployment), the dashboard says so and only its title, description and keyword are checked.

## Automatic redirects when a post URL changes

`.github/workflows/slug-redirects.yml` runs on every pull request that touches `web/content/posts`. If a post file was renamed (its URL slug changed), it adds a 301 redirect from the old address to the new one in `content/redirects.json` and commits it to the same PR branch. It also:

- points older redirects straight at the newest address, so there are no chains
- removes a redirect that would hide a page that lives at that address again
- warns on a deleted post (no new address to send people to) so someone adds a redirect by hand

Run it by hand after committing: `cd web && node --experimental-strip-types --no-warnings scripts/slug-redirects.mjs origin/develop`.

Limits: rename detection needs the file to stay at least 50% similar. A slug change with a big rewrite in the same commit shows as delete plus add, so the deleted-post warning appears and the redirect is added by hand. Pull requests from forks are skipped.

## Added after the first review

- **Drafts and scheduled posts** are listed (status shown, filter "Drafts and scheduled posts") and scored before they go live. They are checked like hidden pages, so a link to one is flagged.
- **Orphan pages:** a live page that no other page links to. The menu and footer count as links (read from the full page). The check switches itself off when any page could not be read.
- **Structured data:** the schema.org types found on each page, and a filter for pages with none.
- **Google index status** (URL Inspection API, refreshed daily, needs the same Search Console setup): filter "Google has not indexed it".
- **Search Console depth:** the 28 days before are shown next to the current 28, ten searches per page, results paged past 5000 rows, and pages that share a search are flagged.
- **Core Web Vitals** from real visitors (CrUX API) for the whole site on phones. Needs `CRUX_API_KEY`. A small site may have no data yet.
- **Weekly snapshot:** `.github/workflows/seo-snapshot.yml` reads `/api/seo-snapshot` every Monday and opens a pull request that adds the scores, including every page's score, to `content/seo-history.json`. Row arrows show the change since the last snapshot. Needs the secret `SEO_DASHBOARD_PASSWORD`, the variable `SITE_URL`, and the repo setting "Allow GitHub Actions to create and approve pull requests". Merge the PR to add the point.
- **Preview button** in the editor opens the saved branch on its Vercel preview (`/preview`, set `PREVIEW_URL_TEMPLATE`). Without it, it opens the live page.
- **Last updated date** is set to today by `.github/workflows/post-dates.yml` when a pull request changes a post's text and the date was left alone. Reading time is worked out from the text. Tags must be lowercase with dashes. Category is a fixed list. The page path in the page SEO list is read only on existing entries.

Still not built: a searchable list for the page SEO entries (Keystatic arrays have none), Core Web Vitals per page, and checks that read the rich text live in the editor.

## Not built, and why

Share this list with the SEO team.

1. **Live score with the page text while typing in the editor.** The preview and the title and description checks are live in the editor. The checks that read the page body (keyword in the first paragraph, links, readability) are not, because the editor cannot hand the rich text to the preview. They are on the SEO dashboard.
2. **Product schema.** Not needed, the site has no products. Any other type, Product included, can be pasted as custom structured data.
3. **Passive voice and transition word checks.** Not built. Synonyms are matched by the list the editor adds plus simple endings, not by meaning, so irregular forms (child and children) need to be added as synonyms.
4. **Instant publishing.** Edits, including quick edits, go to a branch and open a pull request. They go live after review, merge and deploy. This is by design.
5. **Hiding focus keywords from the public GitHub repo.** The dashboard is password protected, but the keywords are saved in the content files and the repository is public. To hide them the repository would have to be made private (Keystatic, Vercel and the workflow all work with a private repo). Until then treat focus keywords as public. They are mostly visible in titles and headings anyway.
6. **Quick edit of every field.** Only SEO title, meta description, focus keyword and noindex. The rest is in the full editor.
7. **Quick edit without a GitHub login.** Saving needs the same GitHub sign-in as the editor, so access stays with GitHub and every change is reviewed.
8. **Automatic score history.** Only recorded when someone presses the button, one point per press. A point per deploy needs a database or a scheduled job.
9. **A live request for every link.** The broken link check compares against the sitemap, it does not fetch each address, so it can miss a page that errors and flag a real page hidden from the sitemap.
10. **Search Console without setup.** It needs a Google Cloud service account added as a user on the Search Console property. Until then the search columns stay hidden.
