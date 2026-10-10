# Launch Checklist

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

Tick top-to-bottom before flipping DNS. Nothing on this list is optional.

---

## T–14 days — accounts & assets

- [ ] Domain `zenithcaresolutions.com` registered and nameservers under your control
- [ ] Google Workspace (or Zoho) email set up for `ali@zenithcaresolutions.com`
- [ ] Role-based email aliases forwarding to Ali: `privacy@`, `legal@`, `compliance@`, `accessibility@`, `security@`
- [ ] Calendly account created, "15-min CCM discovery" event type live
- [ ] WhatsApp Business number ready; prefilled `wa.me/` link tested
- [ ] Formspree account created, form endpoint ID in Vercel env vars
- [ ] Plausible / Umami account created, domain registered
- [ ] GitHub repo private, main branches protected (see `11-git-workflow.md`)
- [ ] Vercel project linked to GitHub repo
- [ ] LinkedIn Company Page published with logo, cover image, description
- [ ] Hero photo of Ali ready (or decision to launch with placeholder)
- [ ] Logo wordmark exported at 1x and 2x PNG + SVG

## T–7 days — content & legal

- [ ] All four legal pages reviewed by a U.S. healthcare attorney and placeholders filled
- [ ] 3 seed blog posts written, edited, and in `content/posts/`
- [ ] 15 FAQ entries written in `content/faq.json`
- [ ] All page copy proofread (American English, no typos, no unqualified revenue claims)
- [ ] Every revenue example qualified with "typical", "representative", or "actual results vary"
- [ ] "Not medical advice" disclaimer visible in footer on every page
- [ ] "Do not submit patient information" disclaimer visible on every form

## T–3 days — technical smoke tests

- [ ] Lighthouse ≥ 95 (Performance, Accessibility, Best Practices, SEO) on Home, Services, About, Contact, Blog post
- [ ] Core Web Vitals all "Good" on mobile and desktop in PageSpeed Insights
- [ ] axe DevTools: zero criticals, zero serious on every page
- [ ] Keyboard-only navigation works on every page (tab order sane, focus visible)
- [ ] Screen reader (NVDA or VoiceOver) smoke test on Home + Contact
- [ ] All forms submit end-to-end — Formspree receives payload, Ali receives email
- [ ] Calendly booking end-to-end — booking appears in Calendly dashboard + email
- [ ] WhatsApp link opens WhatsApp with prefilled message on mobile Safari + Android Chrome
- [ ] All internal links return 200 (`npx linkinator https://preview.vercel.app --recurse`)
- [ ] 404 page renders and returns status 404
- [ ] Images optimized (WebP/AVIF via `next/image`), no image > 300 KB
- [ ] No console errors on any page in Chrome DevTools
- [ ] CSP header passes without inline-script violations

## T–1 day — SEO plumbing

- [ ] `sitemap.xml` lists every public URL and loads at `/sitemap.xml`
- [ ] `robots.txt` loads at `/robots.txt` and allows all crawlers (including `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`)
- [ ] `llms.txt` loads at root and lists core pages + articles
- [ ] JSON-LD passes Google's Rich Results Test for Home, Services, About, Blog post, FAQ
- [ ] Open Graph image renders correctly in LinkedIn Post Inspector + Twitter Card Validator
- [ ] Meta description present and unique on every page (140–160 chars)
- [ ] Title tag present and unique on every page (≤ 60 chars)
- [ ] One `<h1>` per page, matching primary keyword naturally
- [ ] Canonical URL set on every page
- [ ] `/.well-known/security.txt` published with contact email

## Launch day

- [ ] Final merge to `release/v1.0.0` and promote to Vercel production
- [ ] Point `zenithcaresolutions.com` apex + `www` CNAME at Vercel
- [ ] Verify HTTPS cert issued (Let's Encrypt via Vercel)
- [ ] Verify `www` → apex 301 redirect works
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Submit `sitemap.xml` to Bing Webmaster Tools
- [ ] Verify ownership of `zenithcaresolutions.com` in both consoles
- [ ] Verify Plausible / Umami is receiving pageviews
- [ ] Verify Vercel Analytics is receiving Web Vitals
- [ ] Smoke-test one more time from a fresh browser (not your dev machine)
- [ ] Smoke-test from a mobile device on cellular (not office Wi-Fi)
- [ ] Share LinkedIn Company Page launch post
- [ ] Update LinkedIn Company Page "Website" field
- [ ] Update LinkedIn personal profile "Current position" with the site URL

## Day +1 to +7

- [ ] Daily: check Formspree + Calendly + Google Workspace inbox
- [ ] Day +1: install uptime check (UptimeRobot free tier, 5-min interval, email alerts)
- [ ] Day +2: ask 3 friendly healthcare contacts to review the site and send unfiltered feedback
- [ ] Day +3: write first post-launch blog article; begin weekly cadence
- [ ] Day +7: Search Console — fix any coverage warnings; confirm pages indexed

## Day +30 review

- [ ] Review Plausible: top entry pages, bounce rate, referrer mix
- [ ] Review Search Console: impressions, clicks, average position, queries
- [ ] Review Formspree + Calendly: inbound volume vs. target
- [ ] Review axe + Lighthouse again (any regressions from new content?)
- [ ] Update `/faq` with any new questions real inbound inquiries surfaced
- [ ] Decide on month-2 content priorities based on Search Console queries

---

## Rollback plan

If a launch-day defect requires rollback:

1. In Vercel, "Promote to Production" the previous successful deployment
2. Verify site serves old content
3. Open a `defect/launch-rollback-<short-desc>` branch from `develop`
4. Fix, PR, review, merge to `develop`
5. Cut a new `release/v1.0.1` branch and redeploy

(Full branching rules in [11-git-workflow.md](11-git-workflow.md).)
