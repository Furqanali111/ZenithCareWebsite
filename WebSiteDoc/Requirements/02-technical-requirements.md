# Technical Requirements Document (TRD)

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

---

## 1. Architecture (one-liner)

A statically-generated Next.js site deployed on Vercel. No backend, no database, no server-side secrets. All interactive services (booking, chat with team, payment, contracts) are delegated to third-party tools reached via plain links.

```
[ Browser ] ── HTTPS ──> [ Vercel CDN ] ──> static HTML/CSS/JS
    │
    ├── wa.me/… (WhatsApp)
    ├── calendly.com/… (Calendly embed)
    ├── formspree.io/… (contact-form POST)
    └── plausible.io or umami (analytics beacon)
```

## 2. Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 14.x | SSG via `output: 'export'` or default static-first behavior |
| Language | TypeScript | 5.x | Strict mode on |
| Styling | Tailwind CSS | 3.x | Mobile-first |
| Components | shadcn/ui | latest | Copy-in, no runtime dep |
| Icons | lucide-react | latest | |
| Content | MDX | via `@next/mdx` | Blog + resources |
| Chatbot | custom React component | — | Reads `chatbot.json` |
| Forms | Formspree | free tier | No API route needed |
| Booking | Calendly embed | — | Via `<iframe>` or official React widget |
| Analytics | Plausible or Umami | — | Cookieless |
| Hosting | Vercel | Hobby tier | Free up to limits |
| Package manager | pnpm | 9.x | |
| Node | 20 LTS | — | |

## 3. Repository layout

The marketing site lives in **`web/`** at the repo root. This keeps room for a future `api/` sibling (client portal, etc.) without migrating anything.

```
ZenithCareWebsite/              ← git repo root
├── CLAUDE.md
├── README.md
├── .gitignore, .editorconfig
├── Doc/                        ← business PDFs
├── WebSiteDoc/                 ← planning docs (specs live in Requirements/)
└── web/                        ← Next.js app
    ├── app/
    │   ├── (marketing)/        # /, services, who-we-serve, roi, about, hipaa, resources, faq, contact
    │   ├── (legal)/            # privacy, terms, hipaa-statement, accessibility
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   └── opengraph-image.tsx
    ├── components/
    │   ├── ui/                 # shadcn primitives
    │   ├── Nav.tsx, Footer.tsx
    │   ├── CalendlyEmbed.tsx, ContactForm.tsx, WhatsAppButton.tsx
    │   ├── RoiCalculator.tsx
    │   └── Chatbot.tsx         # v1.1 — placeholder in v1
    ├── content/
    │   ├── posts/*.mdx
    │   └── faq.json
    ├── lib/
    │   ├── seo.ts              # metadata + JSON-LD helpers
    │   └── validate.ts         # client-side PHI pattern filter
    ├── public/
    │   ├── llms.txt
    │   ├── .well-known/security.txt
    │   └── images/
    ├── scripts/
    │   └── validate-chatbot.ts # v1.1
    ├── .env.example
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

**Future layout** (when a backend is required — e.g. first client portal request):

```
├── api/                        ← backend service, added only when needed
├── packages/shared/            ← shared types, if ≥ 2 apps share them
└── pnpm-workspace.yaml         ← added at that point
```

Do not pre-create `api/` or `packages/`. Adding a pnpm workspace later is a 15-minute change; cleaning up a prematurely-scaffolded backend is a day.

## 4. Build + deploy

- `pnpm build` runs `next build`
- Vercel Git integration: push to `main` → preview on PR → promote to production on merge
- Preview URLs for every PR, auto-generated
- Custom domain `zenithcaresolutions.com` → CNAME to Vercel
- HTTPS auto via Vercel + Let's Encrypt

## 5. Performance budget

| Metric | Target |
|---|---|
| LCP | < 1.8 s |
| FID / INP | < 100 ms |
| CLS | < 0.1 |
| JS shipped per page | < 150 KB gzipped |
| Images | WebP/AVIF via `next/image`, max 2560px wide |
| Fonts | 1 variable font, subset via `next/font` |

## 6. SEO technical requirements

- `generateMetadata()` per page with unique title + description
- Open Graph + Twitter Card images via `opengraph-image.tsx`
- `app/sitemap.ts` auto-enumerates all static pages + MDX posts
- `app/robots.ts` allows all crawlers
- `public/llms.txt` for AI crawler guidance (markdown index)
- JSON-LD on every page via `lib/seo.ts` helpers — Organization, MedicalBusiness, Service, Article, FAQPage, Person
- Canonical URLs set via metadata
- `hreflang` not needed (English only)

## 7. Security requirements

### 7.1 HTTPS / TLS — mandatory, no exceptions

- **The site MUST be served exclusively over HTTPS.** HTTP must redirect to HTTPS with a `301` and HSTS enforced.
- **TLS certificate**: issued and auto-renewed by **Let's Encrypt**, provisioned automatically by Vercel for both the apex (`zenithcaresolutions.com`) and the `www` subdomain. **Zero manual purchase, zero manual renewal — handled by the platform.**
  - Minimum TLS version: **1.2** (Vercel default is 1.3).
  - No self-signed, no wildcard, no third-party-purchased certs needed — if someone proposes buying one, the answer is no unless Let's Encrypt is unavailable for a specific subdomain (not expected for v1).
- **HSTS header**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Submit domain to the [HSTS preload list](https://hstspreload.org/) **only after** 30 days of clean HTTPS operation (preloading before launch locks us in; mistake is costly to undo).
- **Mixed content**: zero. All images, scripts, fonts, iframes must load over HTTPS. CSP (below) will block anything that isn't.
- **Certificate monitoring**: Vercel surfaces renewal failures in dashboard; add an UptimeRobot free check that fails on cert expiry < 14 days as a backup (set it in Phase 4 of the implementation plan).

### 7.2 Other security requirements

- No server-side secrets stored in repo — nothing to leak
- All forms submit over HTTPS to Formspree
- **Content Security Policy** header (via `next.config.mjs`):
  - `default-src 'self'`
  - allowlist: Calendly, Formspree, WhatsApp (`wa.me`), Plausible/Umami
  - no `unsafe-eval`
- Other response headers set in `next.config.mjs`:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - `X-Frame-Options: DENY`
- `/.well-known/security.txt` with contact email + policy expiry date
- **Dependabot or Renovate** enabled on the GitHub repo for weekly dependency PRs
- Pre-launch security smoke test: SSL Labs scan on the domain must grade **A or higher** before DNS cutover

## 8. Accessibility requirements

- WCAG 2.1 AA baseline
- Semantic HTML, one `<h1>` per page
- All interactive elements keyboard-reachable
- Focus states visible (don't delete Tailwind defaults)
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- `alt` text on all meaningful images, empty `alt=""` on decorative
- Chatbot buttons are real `<button>` elements, not `<div>`s
- Form fields have `<label>`s and `aria-describedby` for errors
- `prefers-reduced-motion` respected for any animation

## 9. Browser support

- Last 2 major versions of Chrome, Edge, Safari, Firefox
- iOS Safari 15+
- No IE support

## 10. Observability

- Vercel Analytics (built-in) for Web Vitals
- Plausible/Umami for traffic
- Sentry free tier for client-side errors (optional for v1)
- Formspree dashboard for form submissions
- Calendly dashboard for bookings
- No custom logging — nothing to log

## 11. Dependencies — allowlist

Deliberately minimal. Anything beyond this needs a justification.

```
next, react, react-dom, typescript, tailwindcss, @tailwindcss/typography,
@next/mdx, @mdx-js/react, gray-matter, lucide-react, clsx,
tailwind-merge, class-variance-authority
```

Rejected without strong reason: any ORM, any state manager, any CSS-in-JS runtime, any animation library beyond Tailwind + CSS, any form library (native `<form>` + Formspree is enough).
