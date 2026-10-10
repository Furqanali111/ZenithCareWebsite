# Design Brief

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

---

## 1. Brand positioning

**Zenith is a clinically-led, compliance-first partner — not a call center.**

The visual language must say: *trustworthy, credentialed, calm, clinical, modern, American-business-ready.* It must NOT say: cheap offshore outsourcer, generic SaaS, startup-y, playful.

The founder's PharmD + oncology/BMT background is the single biggest trust asset — design must give it space to breathe (not bury it in a tiny "About" link).

## 2. Audience taste calibration

The buyer is a 45–65-year-old practice manager or physician who evaluates on a desktop monitor. They respond to:
- Clean whitespace, not dense marketing pages
- Serif or humanist-sans typography (feels medical/academic, not SaaS)
- Deep navy / forest green / warm neutrals — healthcare-adjacent but not clichéd medical blue
- Photos of real people (founder, clinical settings) — not stock illustrations of hands shaking
- Factual, specific numbers (CPT codes, dollar amounts, minutes) — not vague "transform your practice"

## 3. Color system

**Primary palette — "Clinical Trust"**

| Role | Token | Hex | Use |
|---|---|---|---|
| Primary (brand) | `--brand-900` | `#0B2545` | Deep navy, logo, headings |
| Primary accent | `--brand-700` | `#13315C` | Nav bar, dark sections |
| Secondary | `--accent-600` | `#8DA9C4` | Muted blue-grey, dividers, chart lines |
| Highlight | `--gold-500` | `#C9A227` | Single-use accent (CTA underline, award callouts) — restraint |
| Success | `--success-600` | `#2F855A` | Form success, check icons |
| Warning | `--warn-600` | `#B7791F` | Form warnings |
| Error | `--error-600` | `#C53030` | Form errors |
| Surface | `--surface-0` | `#FFFFFF` | Page bg |
| Surface alt | `--surface-50` | `#F7F8FA` | Section bg stripes |
| Text | `--ink-900` | `#111827` | Body text |
| Text muted | `--ink-600` | `#4B5563` | Secondary text |
| Border | `--border-200` | `#E5E7EB` | Dividers, card borders |

**Dark mode**: shipped in v1 via `next-themes` with `attribute="class"`, defaults to the viewer's OS preference, user-toggleable from the top nav. The `.dark` block in `app/globals.css` keeps brand accents (navy becomes surface, gold stays as the accent); surface + ink invert.

**Contrast rule**: body text on surface = AAA. All CTAs AA+.

## 4. Typography

- **Headings**: `Fraunces` (variable serif) — conveys clinical gravitas without being stuffy
- **Body**: `Inter` (variable sans) — proven legibility, free, loaded via `next/font`
- **Monospace** (CPT codes, metrics): `JetBrains Mono`

Scale (Tailwind):
- Hero: `text-5xl md:text-6xl font-semibold tracking-tight`
- Section heading (h2): `text-3xl md:text-4xl font-semibold`
- Subhead (h3): `text-xl font-medium`
- Body: `text-base leading-relaxed` (16px, 1.65 line-height)
- Small / caption: `text-sm text-muted`

Max line length: `max-w-prose` (~65ch) on all body copy.

## 5. Layout + spacing

- 12-column grid at desktop, single column mobile
- Container: `max-w-6xl mx-auto px-6`
- Vertical rhythm in multiples of 8px (Tailwind `py-8`, `py-12`, `py-20`, `py-24`)
- Hero sections `py-24 md:py-32`
- Section breaks `py-16 md:py-24`

## 6. Component inventory

All built from shadcn/ui primitives + Tailwind. No new design system.

| Component | shadcn base | Where used |
|---|---|---|
| Button (primary / secondary / ghost) | `button` | Site-wide CTAs |
| Nav (desktop + mobile sheet) | `sheet`, `navigation-menu` | Global nav |
| Card | `card` | Service cards, testimonial cards, blog cards |
| Accordion | `accordion` | FAQ page (progressive disclosure) |
| Alert / Callout | `alert` | "Not medical advice" blocks, disclaimers |
| Form field | `input`, `textarea`, `label` | Contact form |
| Tabs | `tabs` | Who We Serve by specialty |
| Dialog | `dialog` | — only if needed for chatbot panel |
| Toast | `sonner` | Form success/error |
| Tooltip | `tooltip` | CPT code hovers |
| Chatbot (custom) | — | Floating widget, scripted tree |
| ROI Calculator (custom) | `input`, `slider` | /roi-calculator |
| Calendly embed (custom) | — | /contact, floating CTA |

## 7. Imagery

- **Hero photo**: real portrait of Ali in clinical attire (not stock). Shot on neutral background. Fallback: an abstract architectural photo (think hospital corridor, soft focus) tinted with brand navy at 60% opacity.
- **Section photography**: candid clinical settings — avoid "doctor smiling at camera" stock.
- **Illustrations**: use sparingly, only for the ROI calculator and chatbot icon. Line-art style, single brand color.
- **No**: emoji in body copy, no gradient blobs, no 3D renders, no AI-generated faces (trust problem).

## 8. Voice & tone

- Direct, specific, clinically literate
- Lead with the number. "At 200 patients, that's ~$13,200 / month in reimbursement your practice may not be billing today."
- Never: "transform", "unleash", "synergy", "best-in-class", "world-class"
- Use provider-side language: "your patients", "your panel", "your EHR" — never "doctors" or "clients" when "practice" is more precise
- When explaining CCM, assume literacy on reimbursement; don't define terms the audience uses daily

## 9. Motion

- Minimal. No parallax, no hero video, no scroll-jacking.
- Subtle fade-in on scroll for section headings (`prefers-reduced-motion` respected)
- Button hover: 150ms background transition, no scale
- Chatbot panel open/close: 200ms slide
- That's it.

## 10. Logo direction (if we need one placeholder-ready for the build)

Wordmark-first: "ZENITH CARE SOLUTIONS" in Fraunces semibold, tracked tight, navy on white. Optional abstract mark: a single rising line forming a stylized peak (nod to "zenith"). Avoid: caduceus, red cross, heart icons, stethoscope — all cliché.

## 11. Reference inspiration

Pull reference boards from these (not for copying, for taste calibration):
- **Oscar Health** — color, calm, trust
- **Vera Whole Health** — typography, clinical seriousness
- **ChartSpan** — direct competitor; study and differentiate (be more credentialed-feeling, less salesy)
- **Linear** docs site — clean technical layout
- **Stripe** docs site — content density that still breathes

## 12. Deliverables tracked separately

- Actual page copy → `06-implementation-plan.md` references, finalized during build
- Legal page copy → `08-legal-pages-draft.md`
- Logo artwork → outside this doc; placeholder wordmark acceptable at v1

## 13. Design-skills to use during BUILD

This brief is written strategy — I did NOT invoke `taste-skill` or `impeccable` while drafting it, because those skills are built for generating and critiquing visual artifacts, not for writing a design memo. During Phase 2 of the build (when real components, mock-ups and screenshots are produced), every session **must** use:

- **`taste-skill`** (specifically `taste-skill:taste-skill` for frontend taste; `taste-skill:soft-skill` for high-end visual judgment; `taste-skill:minimalist-skill` where the layout calls for restraint) — invoke BEFORE writing any component JSX or Tailwind layout. The skill establishes the taste bar for this site: clinical, trustworthy, restrained.
- **`impeccable:impeccable`** — invoke for any screen or component we're treating as a comp / showcase surface (hero, services page hero, ROI calculator UI). Use `impeccable-finish-reviewer` before merging the component.
- **`superpowers:brainstorming`** — only if a layout decision needs multiple options compared.

Pin: calling these skills is NOT optional at build time. The planning doc enforces it (see `12-claude-requirements.md`).
