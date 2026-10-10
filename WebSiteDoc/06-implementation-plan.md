# Implementation Plan

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11
**Timeline**: 4 working weeks to v1 production launch

---

## 0. Pre-flight checklist (before writing code)

- [ ] Domain purchased: `zenithcaresolutions.com` (Namecheap)
- [ ] GitHub repo created (private) and pushed empty commit
- [ ] Vercel account linked to GitHub
- [ ] Google Workspace OR Zoho Mail set up for `ali@zenithcaresolutions.com`
- [ ] Calendly account created, "15-min CCM discovery" event type published
- [ ] WhatsApp Business number ready (format: country code + number, no `+`)
- [ ] Formspree account created, form endpoint ID copied
- [ ] Plausible or Umami account created, domain registered
- [ ] Hero photo of Ali in clinical attire taken (or decision to use placeholder for v1)
- [ ] LinkedIn Company Page for Zenith created (for `sameAs` schema link)

---

## Phase 1 — Scaffold (Week 1)

**Goal**: a bootable Next.js app with all routes stubbed and global layout working.

### Day 1 — bootstrap

- [ ] `pnpm create next-app` with TypeScript, Tailwind, App Router, ESLint, src dir = no
- [ ] Install deps: `@next/mdx`, `@mdx-js/react`, `gray-matter`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `@tailwindcss/typography`
- [ ] Install shadcn/ui: `pnpm dlx shadcn@latest init`; add `button`, `card`, `accordion`, `input`, `textarea`, `label`, `sheet`, `navigation-menu`, `alert`, `sonner`, `tabs`, `tooltip`
- [ ] Configure Tailwind with brand tokens from `04-design-brief.md`
- [ ] Add Google Fonts via `next/font`: Fraunces + Inter + JetBrains Mono
- [ ] Set up ESLint + Prettier + `.editorconfig`
- [ ] Push initial commit, deploy to Vercel preview

### Day 2 — layout + routing

- [ ] `app/layout.tsx` with global nav + footer
- [ ] `components/Nav.tsx` (desktop + mobile sheet)
- [ ] `components/Footer.tsx`
- [ ] Create empty page stubs for every route in `03-app-flow.md`
- [ ] `app/not-found.tsx`
- [ ] Metadata helpers in `lib/seo.ts` (base `generateMetadata`, Open Graph defaults)

### Day 3 — SEO plumbing

- [ ] `app/sitemap.ts` enumerating static routes + MDX slugs
- [ ] `app/robots.ts`
- [ ] `public/llms.txt` with site index
- [ ] JSON-LD helpers: `Organization`, `MedicalBusiness`, `Service`, `Article`, `FAQPage`, `Person`
- [ ] `app/opengraph-image.tsx` default OG image
- [ ] Vercel headers in `next.config.mjs`: HSTS, CSP (allowlisting Calendly, Formspree, WhatsApp, Plausible), X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### Day 4–5 — content infra

- [ ] MDX pipeline wired for `content/posts/*.mdx` with gray-matter frontmatter
- [ ] `content/faq.json` schema + loader
- [ ] `content/chatbot.json` schema + loader + `scripts/validate-chatbot.ts`
- [ ] Plausible/Umami script added via `app/layout.tsx`
- [ ] Env vars configured in Vercel

**Phase 1 exit criteria**: every route returns a stubbed page. Lighthouse ≥ 95 on an empty hero. Sitemap and robots are served. CSP passes without inline-script errors.

---

## Phase 2 — Core pages (Week 2)

Build in this order (highest conversion impact first):

- [ ] `/` Home — hero, 3-step how-it-works, revenue math block, founder strip, CTAs
- [ ] `/contact` — WhatsApp + email + Formspree form + Calendly embed
- [ ] `/services/chronic-care-management` — long-form service page with CPT table
- [ ] `/about` — founder bio, credentials, LinkedIn link (Person JSON-LD)
- [ ] `/hipaa-compliance` — compliance posture page
- [ ] `/roi-calculator` — client-side React calculator
- [ ] `/faq` — accordion rendering from `content/faq.json` + FAQPage JSON-LD

**Phase 2 exit criteria**: a provider can land on Home, understand the offer, see Ali's credentials, calculate ROI, and reach a Calendly booking in ≤ 3 clicks.

---

## Phase 3 — Chatbot, content, who-we-serve (Week 3)

- [ ] `components/Chatbot.tsx` — floating button, panel, node renderer, "Do not share patient information" banner
- [ ] Content: write 15–20 FAQ entries in `content/faq.json`
- [ ] Content: author first 3 blog posts in `content/posts/*.mdx` (CPT 99490 explainer, CCM-vs-in-house comparison, HIPAA checklist)
- [ ] `/resources` list page + `/resources/[slug]` detail page
- [ ] `/who-we-serve/[specialty]` dynamic route — primary-care, internal-medicine, geriatrics
- [ ] Author bio component used in blog + about

**Phase 3 exit criteria**: chatbot can answer top 10 questions and offers handoff at every terminal; 3 blog posts live and indexed in sitemap.

---

## Phase 4 — Legal, accessibility, polish (Week 4)

- [ ] `/privacy` — draft (needs attorney review before launch)
- [ ] `/terms` — draft (needs attorney review)
- [ ] `/hipaa-statement` — draft (needs attorney review)
- [ ] `/accessibility` — statement + commitment to WCAG 2.1 AA
- [ ] "Not medical advice" + "Do not submit patient info" footer disclaimers
- [ ] `/.well-known/security.txt`
- [ ] Keyboard navigation audit (tab order, focus visible on every control)
- [ ] Screen-reader smoke test with NVDA or VoiceOver on Home, Services, Contact
- [ ] Lighthouse pass on every page (target ≥ 95 all four categories)
- [ ] axe DevTools pass with zero criticals
- [ ] Cross-browser smoke: Chrome, Safari (iOS), Firefox, Edge
- [ ] Replace placeholder hero photo with real one if available
- [ ] Final copy pass — remove any unqualified revenue claims

**Phase 4 exit criteria**: Lighthouse ≥ 95 everywhere, zero axe criticals, legal pages reviewed by attorney.

---

## Launch day

- [ ] Point `zenithcaresolutions.com` CNAME at Vercel
- [ ] Verify HTTPS cert issued
- [ ] Submit sitemap to Google Search Console + Bing Webmaster
- [ ] Verify Plausible/Umami receiving pageviews
- [ ] Smoke-test every form submission end-to-end (Formspree inbox check)
- [ ] Smoke-test Calendly booking end-to-end
- [ ] Smoke-test WhatsApp link opens with prefill
- [ ] Smoke-test chatbot on mobile Safari
- [ ] Share LinkedIn post from company page
- [ ] Update LinkedIn Company Page "Website" field

---

## Post-launch (first 30 days)

- [ ] Monitor Plausible daily for traffic + funnel
- [ ] Watch Formspree inbox + Calendly bookings
- [ ] Write 4 more blog posts to hit 7-post library by day 30
- [ ] Google Search Console: fix any coverage warnings
- [ ] Add any FAQ gaps surfaced by inbound questions
- [ ] Collect feedback from first 3 provider calls → update copy

---

## Explicitly deferred to v1.1+

Document these so no one builds them by accident in v1:

- Newsletter signup
- Site search
- Dark mode
- LLM-powered chatbot
- Client login portal
- `/pay` or any payment page
- Service pages for billing, credentialing, coding, AR (add when Zenith starts selling them)
- Multi-language

---

## Risks & dependencies

| Risk | Impact | Mitigation |
|---|---|---|
| Attorney review of legal pages takes longer than Phase 4 | Launch delay | Start attorney review in Week 2, not Week 4 |
| Hero photo not available | Weaker hero | Ship with placeholder; swap post-launch |
| Formspree 50/mo cap hit early | Lost leads | Upgrade Formspree tier or move to Resend + 1 API route |
| Calendly free tier limits (1 event type) | Fine for v1 | Upgrade only if we add service tiers |
| Content writing bandwidth (blog posts) | SEO ramp delayed | Write 3 posts before launch; batch-write 4 more in month 1 |
