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

## SEO dashboard

Password protected. Set `SEO_DASHBOARD_PASSWORD` in Vercel (Production and Preview) and share it with the team. The browser asks for a user name (anything) and the password. While the variable is unset, the page returns 404 in production. Local dev is open. The gate is `web/proxy.ts`.

`/seo-dashboard` lists every post and every page in the page SEO files, worst score first.

- Columns: score, focus keyword, SEO title length, meta description status (Missing, Too short, Good, Too long), indexing status.
- Open a row for the Google desktop and mobile preview, the SEO checklist, the readability checklist, link suggestions (posts), a quick edit form, and a link to the full editor.
- The page is rendered when opened. Post text comes from the content files. The text of pages written in code (home, services, about) is read from the live site and refreshes every few minutes. Metadata edits show on the dashboard after the next deploy.
- The page is noindex and not in the sitemap.

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

## Not built, and why

Share this list with the SEO team.

1. **Live preview and live score while typing in the editor.** Keystatic cannot show one field's value next to another, so a preview or score inside the post form needs a custom editor field and a change to how title and description are stored. The dashboard row shows the same preview and score, and quick edit has live character counters. A custom editor field is a separate piece of work.
2. **Product schema.** Not needed, the site has no products. Any other type, Product included, can be pasted as custom structured data.
3. **Passive voice and transition word checks.** Not built. Synonyms are matched by the list the editor adds plus simple endings, not by meaning, so irregular forms (child and children) need to be added as synonyms.
4. **Instant publishing.** Edits, including quick edits, go to a branch and open a pull request. They go live after review, merge and deploy. This is by design.
5. **Hiding focus keywords from the public GitHub repo.** The dashboard is password protected, but the keywords are saved in the content files and the repository is public. To hide them the repository would have to be made private (Keystatic, Vercel and the workflow all work with a private repo). Until then treat focus keywords as public. They are mostly visible in titles and headings anyway.
6. **Quick edit of every field.** Only SEO title, meta description, focus keyword and noindex. The rest is in the full editor.
7. **Quick edit without a GitHub login.** Saving needs the same GitHub sign-in as the editor, so access stays with GitHub and every change is reviewed.
