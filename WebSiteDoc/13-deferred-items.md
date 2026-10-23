# Deferred Items

**Project**: Zenith Care Solutions — marketing website
**Updated**: 2026-10-11

A catalog of things the code already references but whose target doesn't exist yet. **Nothing on this list is a bug.** Each entry is a placeholder we deliberately kept so that filling it later is a one-step action — drop the file, add the content, set the env var — not a code change.

> **Rule for every session**: if a ponytail-review (or any skill) suggests *removing* a reference because the target is missing — e.g. "the Organization JSON-LD points at `/logo.png` which 404s, drop the `logo` field" — do **not** remove it. Add the target to the right section below instead. Removing the reference costs us the day the asset lands.
>
> This rule is also pinned in [`CLAUDE.md`](../CLAUDE.md) and [`12-claude-requirements.md`](12-claude-requirements.md) §3.

---

## 1. Missing assets referenced in code

| Asset path | Referenced from | What it should be |
|---|---|---|
| `web/public/logo.png` | `organizationLd()` in `web/lib/seo.tsx` → every page's Organization JSON-LD | 512×512 PNG, square, brand navy background with wordmark or mark; also acceptable 1200×630 for best Google rich-card. |
| Founder portrait (e.g. `web/public/images/ali-hassan-kaleem.jpg`) | planned use on `/about` + `personLd()` + home hero | Portrait of Ali in clinical attire, neutral background, 1600+px wide. Not yet referenced in code; add path here once the photo exists so we remember to wire it. |
| OG image per high-value page | currently we only have the default `app/opengraph-image.tsx` | Add `app/services/chronic-care-management/opengraph-image.tsx` and similar for `/about`, `/roi-calculator` when their final hero copy exists. |
| Per-post hero images for blog articles | `web/public/images/posts/<slug>.webp` referenced by `articleLd({ image })` in `web/app/resources/[slug]/page.tsx` and (future) a hero `<Image>` in the article header | 1600×900 ideally; feeds the Google Article rich-card image slot. Omit until real art exists — a generic stock image across all posts is worse than no image for rich-result eligibility. |
| Favicon set | not yet shipped | Replace the stock `web/app/favicon.ico` from create-next-app with brand-navy "Z" at 32×32 + Apple touch icon at 180×180. |

## 2. User-authored content with a live code reference

Content you (not a PR) need to author. Only items whose placeholder is already loaded by code belong here — real page copy, service descriptions, blog posts, and legal copy are tracked as their own PRs in `PROGRESS.md` **Up next**, not here.

| Content | Where it's referenced | What's needed |
|---|---|---|
| Real USD prices | `web/lib/pricing.ts` (`amount: null` per plan) | Fill `amount` and `unit` per service. /pricing says "stated in your written proposal" until set. Also confirm the onboarding time (3 to 6 weeks) and refund terms (30 day notice, pro-rata) with an attorney. |
| _(none open)_ | | First 15 FAQ Q&As shipped in PR #12. Add more entries by appending to `content/faq.json` — the loader validates on build and the page re-renders automatically. |

## 3. Env vars that need production values

In `web/.env.local` (gitignored) for local work; set in Vercel project settings (scope "Production" only) for the live site.

| Var | Needed for | Current state |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | floating WhatsApp button + `/contact` WhatsApp CTA (both hide themselves when unset) | not set |
| `NEXT_PUBLIC_CALENDLY_URL` | `/contact` "Book a 15-min call" button (hidden when unset) | not set — depends on Calendly event being published |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics (script loads only on Production domain + env set) | not set — depends on Plausible site being created |
| `NEXT_PUBLIC_SITE_URL` | canonical URL for OG, sitemap, JSON-LD | default is production domain; override only for staging |

Additionally, the About page hardcodes a placeholder LinkedIn URL at `web/app/about/page.tsx` → `FOUNDER_LINKEDIN`. Replace with Ali&rsquo;s actual personal LinkedIn URL once confirmed; it feeds the Person JSON-LD `sameAs` and the "Ali on LinkedIn" CTA.
| `NEXT_PUBLIC_FORMSPREE_ID` | fallback contact form (not yet built — lands in `feature/contact-page`) | not set |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_INTERNAL_TO` | reserved for future transactional email; v1 has no backend | documented in `.env.example`, commented out |

## 4. External accounts / setup to-do

Non-code work the user owns. **Full step-by-step runbook** (sign-up URLs, which env var each service maps to, where to paste in Vercel): [`14-go-live-accounts.md`](14-go-live-accounts.md).

- [ ] GitHub branch-protection rules on `develop` and `release/*` per [`11-git-workflow.md`](11-git-workflow.md) §4
- [ ] Vercel project linked to the GitHub repo for automatic preview deploys
- [ ] Attorney retained for legal page review (needed before Phase 4 launch)
- [ ] Calendly account with "15-min CCM discovery" event type published
- [ ] WhatsApp Business number provisioned
- [ ] Plausible site added for `zenithcaresolutions.com`
- [ ] Formspree form created, endpoint ID copied
- [ ] Google Workspace or Zoho Mail set up for `ali@zenithcaresolutions.com` + role aliases (`privacy@`, `legal@`, `compliance@`, `accessibility@`, `security@`)
- [ ] LinkedIn Company Page published with logo and cover image
- [ ] Google Search Console + Bing Webmaster Tools ownership verified

## 5. Time-based reminders

- [ ] **Rotate `web/public/.well-known/security.txt` `Expires:` field before 2027-10-11** — RFC 9116 compliance.
- [ ] **Bump hardcoded footer year each January** — Next 16 Cache Components refuses `new Date()` during prerender; see `shortcut:` comment in `web/components/footer.tsx`.
- [ ] **Submit domain to HSTS preload list** at <https://hstspreload.org/> only after 30 days of clean HTTPS operation on the production domain. Preloading before that locks the choice in and is painful to undo.

## 6. Known traps to avoid (deferred to specific future PRs)

- **CSP tightening**: current CSP uses `'unsafe-inline'` for scripts and styles. Tighten with nonce-based CSP + `strict-dynamic` in a dedicated security-hardening PR once Calendly, Formspree, and Plausible are wired and all third-party hosts can be allowlisted in one pass.

---

## How to add to this doc

Add a one-line entry here **only when both are true**:

1. Code already references the thing (an asset path, an env var, a content key, a content file).
2. The thing needs to be filled in by the user (an image to source, a value to paste, content to author, an account to create) — not by a planned future PR.

If the work is "build the X page" or "write the X PR", that belongs in `PROGRESS.md` **Up next**, not here.

When you fill one in, delete the entry. If a section grows past ~15 entries, split it or question why we're carrying so much speculative work.
