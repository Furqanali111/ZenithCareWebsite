# Zenith Care Solutions — Marketing Website

Next.js 14 static-first marketing site. Static-generated, deployed to Vercel.

**Planning docs**: [`../WebSiteDoc/`](../WebSiteDoc/).
**Design brief**: [`../WebSiteDoc/Requirements/04-design-brief.md`](../WebSiteDoc/Requirements/04-design-brief.md).
**Technical requirements**: [`../WebSiteDoc/Requirements/02-technical-requirements.md`](../WebSiteDoc/Requirements/02-technical-requirements.md).

---

## One-time bootstrap

**You do not run this twice.** This folder is scaffolded (empty dirs); the Next.js project itself is bootstrapped on first setup.

From the repo root:

```bash
cd web

# Bootstrap Next.js into this folder (interactive — accept defaults listed below)
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --eslint

# Install additional project deps
pnpm add @next/mdx @mdx-js/react @mdx-js/loader gray-matter \
         lucide-react clsx tailwind-merge class-variance-authority \
         @tailwindcss/typography

# Install shadcn/ui and the components we use
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card accordion input textarea label \
         sheet navigation-menu alert sonner tabs tooltip tabs
```

Accept these during `create-next-app`:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Turbopack: **Yes** (default)
- Import alias: **`@/*`**

After bootstrap, the folder structure below is what should exist.

---

## Folder structure (target)

```
web/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                              # /
│   │   ├── services/chronic-care-management/page.tsx
│   │   ├── who-we-serve/[specialty]/page.tsx
│   │   ├── roi-calculator/page.tsx
│   │   ├── hipaa-compliance/page.tsx
│   │   ├── about/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── resources/[slug]/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── (legal)/
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── hipaa-statement/page.tsx
│   │   └── accessibility/page.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx
├── components/
│   ├── ui/                                       # shadcn primitives
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── CalendlyEmbed.tsx
│   ├── ContactForm.tsx
│   ├── WhatsAppButton.tsx
│   ├── RoiCalculator.tsx
│   └── Chatbot.tsx                               # v1.1 — placeholder in v1
├── content/
│   ├── posts/                                    # MDX blog posts
│   └── faq.json                                  # FAQ entries
├── lib/
│   ├── seo.ts                                    # metadata + JSON-LD helpers
│   └── validate.ts                               # client-side PHI pattern filter
├── public/
│   ├── llms.txt
│   ├── .well-known/security.txt
│   └── images/
├── scripts/
│   └── validate-chatbot.ts                       # build-time chatbot graph check (v1.1)
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

The empty `.gitkeep` files currently in these folders are placeholders — they get replaced during bootstrap.

---

## Local development

```bash
cd web
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve production build locally
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in. All are public (prefix `NEXT_PUBLIC_`) — the site has no server-side secrets.

```
NEXT_PUBLIC_FORMSPREE_ID=xxxxxxxx
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/zenith-care/15min
NEXT_PUBLIC_WHATSAPP_NUMBER=15555555555
NEXT_PUBLIC_CONTACT_EMAIL=ali@zenithcaresolutions.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=zenithcaresolutions.com
```

---

## Deployment

- Pushes to `release/*` branches auto-deploy to the production Vercel environment.
- Every PR gets a preview URL from Vercel's GitHub integration.
- See [`../WebSiteDoc/10-launch-checklist.md`](../WebSiteDoc/10-launch-checklist.md) for launch-day steps.
