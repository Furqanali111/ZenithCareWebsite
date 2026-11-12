# Content reports and FAQ schema switch

## Content report

```bash
cd web && pnpm content:report        # posts not updated in 180+ days
pnpm content:report 365              # change the age limit
```

Lists posts to refresh (oldest first), then problems: SEO title over 60 characters, description over 160, duplicate SEO titles. It also counts posts whose cover alt text falls back to the title. Read-only. Orphan posts (no inbound links) are in `pnpm links:report`. After refreshing a post, change its "Last updated" date in the editor.

## FAQPage schema switch

"Structured data" in the editor can turn the FAQPage schema off per page. It now works on every page that shows a FAQ: home, /faq, blog posts, service pages, service category pages, specialty pages, CPT pages and denial pages. The FAQ stays visible; only the markup is removed. Use the page's URL path, for example `/services/chronic-care-management`.

## Not built, and why

- **404 report.** Vercel shows 404s under the project's Logs and Observability tabs (filter by status 404). Review it monthly, then add redirects in the Redirects editor. Reading Vercel logs from code needs an API token, so it was left out.
- **Internal link suggestions inside the editor.** Heavy custom field. `pnpm links:report` covers the need.
- **Share-card preview in the editor.** Needs a custom Keystatic field. Check the card by opening `/<page>/opengraph-image` instead.
- **Google Business Profile / local SEO.** Depends on whether the company has a US business address; ask before building.
