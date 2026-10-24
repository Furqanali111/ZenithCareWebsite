# Go-Live Accounts & Vercel Setup

**Project**: Zenith Care Solutions — marketing website
**Last updated**: 2026-10-11

Everything you (not Claude) need to do between "the code is ready" and "the site is live on `zenithcaresolutions.com`". Each service has its own runbook: what it is, why we need it, how to get the credential, which env var it maps to, where to paste it in Vercel.

Companion docs:
- [`13-deferred-items.md`](13-deferred-items.md) — the running catalog of placeholders waiting for these values.
- [`10-launch-checklist.md`](10-launch-checklist.md) — the full launch-day sequence (DNS cutover, Search Console submission, LinkedIn announcement).

---

## 1. Order of operations

Do these in this order. Each step unblocks the next.

1. **Buy the domain** (`zenithcaresolutions.com`) — 10 min, one-time.
2. **Create the GitHub repo** (already done) + apply branch-protection rules.
3. **Create the Vercel account** and link it to the GitHub repo.
4. **Set up email** (Google Workspace or Zoho) on the domain.
5. **Create accounts for each integration** (Formspree, Calendly, WhatsApp Business, Google Analytics) and copy their credentials into Vercel env vars (production scope).
6. **Point DNS at Vercel** (apex + `www`), verify HTTPS.
7. **Verify ownership** with Google Search Console + Bing Webmaster Tools, submit sitemap.
8. **Publish LinkedIn Company Page**, update profile links.
9. Run the launch-day smoke tests in [`10-launch-checklist.md`](10-launch-checklist.md).

Nothing above costs more than ~$50 upfront except Google Workspace ($6/user/mo). Everything else has a free tier that carries the site through launch.

---

## 2. Service runbooks

Each entry has the same shape: **what / why / how / env var / where in Vercel**.

### 2.1 Domain — Namecheap (or any registrar)

- **What**: `zenithcaresolutions.com`.
- **Why**: canonical home for the site and all email addresses.
- **How**:
  1. Namecheap → search `zenithcaresolutions.com` → add to cart → register (~$12/yr).
  2. Enable WhoisGuard (free with Namecheap) so your Pakistan address isn't in public WHOIS.
  3. **Do not touch DNS yet** — we'll point nameservers at Vercel in step 7 of §1.
- **Env var**: none directly. The code already reads this value through `NEXT_PUBLIC_SITE_URL` (default `https://zenithcaresolutions.com`).
- **Where in Vercel**: Project → Settings → Domains (added in step 7 below).

### 2.2 GitHub — repo & branch protection

- **What**: the repo already exists at `github.com/Furqanali111/ZenithCareWebsite`.
- **Why**: PR-review enforcement and squash-only history per [`11-git-workflow.md`](11-git-workflow.md).
- **How**: GitHub → repo → Settings → **Branches** → Add rule for `develop`:
  - Require pull request before merging
  - Require 1 approving review
  - Require status checks to pass (will auto-populate once Vercel is linked)
  - Require linear history (squash merges only)
  - Disallow force push + deletion
  - Repeat for `release/*` (branch pattern).
- **Env var**: none.
- **Where in Vercel**: n/a.

### 2.3 Vercel — hosting

- **What**: hosts the Next.js build and serves it over HTTPS.
- **Why**: the whole site runs here. Free tier covers Zenith's traffic for the foreseeable future.
- **How**:
  1. Create a free Vercel account at [vercel.com](https://vercel.com) using your `ali@zenithcaresolutions.com` once email is set up (step 2.4). If email isn't ready yet, use a personal address and change later.
  2. **Add New Project** → **Import** → pick `Furqanali111/ZenithCareWebsite`.
  3. During import:
     - **Root Directory**: set to `web`. Vercel will auto-detect Next.js.
     - **Build Command**: leave default (`pnpm build`).
     - **Install Command**: leave default (`pnpm install`).
     - **Output Directory**: leave blank (Vercel infers).
     - **Environment variables**: skip for now; we add them in §3.
  4. Click **Deploy**. First deploy will succeed with placeholders (WhatsApp button, Formspree form, Calendly embed all hide themselves when their env is blank).
  5. The GitHub integration is now live: every PR gets a preview URL, every merge to `develop` deploys to the preview environment, every push to a `release/*` branch deploys to production.
- **Env var**: n/a (Vercel is the host).
- **Where in Vercel**: everywhere else below.

### 2.4 Email — Google Workspace OR Zoho Mail

- **What**: `ali@zenithcaresolutions.com` + role aliases (`privacy@`, `legal@`, `compliance@`, `accessibility@`, `security@`).
- **Why**: `mailto:` CTAs on the site, Formspree notifications, business communication.
- **How** (Google Workspace recommended, Zoho Mail free tier is the budget option):
  1. [workspace.google.com](https://workspace.google.com) → Start → pick Business Starter ($6/user/mo).
  2. During signup, add `zenithcaresolutions.com` as your domain.
  3. Google gives you a TXT record to prove ownership — add it in Namecheap's DNS panel.
  4. After verification, Google provides MX records — add those in Namecheap.
  5. Create the primary mailbox `ali@zenithcaresolutions.com`. Add aliases for the five role addresses (free; they all forward to Ali's inbox).
- **Env var**: `NEXT_PUBLIC_CONTACT_EMAIL` (defaults to `ali@zenithcaresolutions.com`).
- **Where in Vercel**: Settings → Environment Variables → add `NEXT_PUBLIC_CONTACT_EMAIL` scoped to **Production, Preview, Development** (safe to expose on previews).

### 2.5 Formspree — contact form

- **What**: receives contact-form submissions and emails them to Ali.
- **Why**: the fallback form on `/contact` posts here. Free tier = 50 submissions/mo.
- **How**:
  1. [formspree.io](https://formspree.io) → Sign up (use Ali's email).
  2. **New Form** → name it "Zenith website" → set the notification email to `ali@zenithcaresolutions.com`.
  3. Copy the **form ID** from the dashboard. It looks like `mabcdxyz` (8 characters). The full endpoint is `https://formspree.io/f/mabcdxyz` — the ID is just the last part.
  4. Enable **reCAPTCHA** on the form (Formspree settings) for spam defence. No code change on our end — Formspree injects it.
- **Env var**: `NEXT_PUBLIC_FORMSPREE_ID=mabcdxyz`.
- **Where in Vercel**: Settings → Environment Variables → add `NEXT_PUBLIC_FORMSPREE_ID` scoped to **Production** only (keep preview deploys out of the real Formspree inbox).

### 2.6 Calendly — 15-min discovery booking

- **What**: visitors book a 15-min call via the inline embed on `/contact` and the "Book a 15-min call" CTAs across the site.
- **Why**: primary conversion endpoint. Free tier covers one event type, which is all we need for v1.
- **How**:
  1. [calendly.com](https://calendly.com) → Sign up.
  2. **New Event Type** → **One-on-One** → name it "CCM Discovery — 15 min".
  3. Duration: 15 minutes. Buffer: 5 min before/after. Date range: 30 days rolling.
  4. Set your availability (your time zone — Pakistan).
  5. Under **Confirmation Page**, enable the Calendly confirmation (default).
  6. Copy the **public URL** — click **Share** on the event. The URL looks like `https://calendly.com/zenith-care-solutions/ccm-discovery` or similar. **No API key needed** — the inline widget just needs this public URL.
- **Env var**: `NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/<handle>/<event-slug>`.
- **Where in Vercel**: Settings → Environment Variables → add `NEXT_PUBLIC_CALENDLY_URL` scoped to **Production** only.

### 2.7 WhatsApp Business — the floating WhatsApp button

- **What**: the floating WhatsApp button in the lower-right corner and the WhatsApp CTA on `/contact`.
- **Why**: fastest-closing channel for Pakistan-based founder serving U.S. buyers — WhatsApp is the universal messaging default outside the U.S. and widely accepted inside it.
- **How**:
  1. Download the **WhatsApp Business** app (free). Register your Pakistan mobile number (or a WhatsApp-dedicated line).
  2. Set up the business profile: name "Zenith Care Solutions", description, business hours, away message ("Thanks — we reply within 1 business day").
  3. Note the full phone number in international format, digits only, no `+`. Example: a US number `+1 (555) 555-1234` becomes `15555551234`. A Pakistan number `+92 300 123 4567` becomes `923001234567`.
- **Env var**: `NEXT_PUBLIC_WHATSAPP_NUMBER=15555551234` (digits only, no `+`).
- **Where in Vercel**: Settings → Environment Variables → add `NEXT_PUBLIC_WHATSAPP_NUMBER` scoped to **Production** only.

### 2.8 Google Analytics 4: analytics

- **What**: Google Analytics 4 pageview and event analytics, loaded site-wide in production only (lazy-loaded after the page is interactive).
- **Why**: measure traffic, referrers and conversions. It sets cookies, so the Privacy Policy names it (see `/privacy`); whether a cookie banner is needed is an open question for the attorney.
- **Status**: already set up. The measurement ID is in Vercel Production as `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Four key events exist in GA4: `whatsapp_click`, `email_click`, `calendly_booking`, `contact_form_success` (sent by `web/components/conversion-tracking.tsx`).
- **Still to do in GA4**: define internal traffic (Admin, Data streams, Configure tag settings, Define internal traffic) so your own visits are excluded.
- **Env var**: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`. The code only loads it when `VERCEL_ENV === "production"` and the variable is set, so preview deploys never pollute the data.

### 2.9 Google Search Console + Bing Webmaster Tools

- **What**: tells Google and Bing the site exists and submits our sitemap.
- **Why**: without these, indexing takes weeks instead of days. Both are free.
- **How** — Google Search Console:
  1. [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → **Domain** → enter `zenithcaresolutions.com`.
  2. Google gives a TXT verification record — add it in Namecheap DNS.
  3. Once verified, **Sitemaps** → submit `https://zenithcaresolutions.com/sitemap.xml`.
- **How** — Bing Webmaster:
  1. [bing.com/webmasters](https://www.bing.com/webmasters) → sign in with the same Google account → **Import from Google Search Console** (fastest; auto-copies the verification). Otherwise add + verify like Google.
  2. Submit the same sitemap URL.
- **Env var**: none.
- **Where in Vercel**: n/a.

### 2.9.1 IndexNow

- **What**: ping Bing, Yandex, Seznam, Naver, and Yep when sitemap URLs change. Google does not use IndexNow; keep Search Console + sitemap as they are.
- **Why**: faster recrawl of new or updated pages on engines that support the protocol. Ownership is proven by a public key file at `https://thezcs.com/{key}.txt`.
- **How**:
  1. Ship `web/public/cdd29e58c720c0425061517e14e13024.txt` so it is live at `https://thezcs.com/cdd29e58c720c0425061517e14e13024.txt` (body must equal the filename, no wrapping quotes).
  2. Confirm Bing Webmaster Tools is verified (section 2.9). Receipts show up there.
  3. After the production deploy finishes: `cd web && pnpm indexnow`. Use `pnpm indexnow -- --dry-run` to list URLs without submitting.
  4. Rerun `pnpm indexnow` after a content-significant production deploy (new service page, blog post, or copy change you want recrawled). Do not hook this into `pnpm build`; the key file is not live until Vercel finishes.
- **Env var**: none. The key is public by protocol and is committed as the `.txt` file.
- **Where in Vercel**: n/a. No API route. Submission is a local/CI Node script against `https://api.indexnow.org/indexnow`.

### 2.10 LinkedIn Company Page

- **What**: company presence on LinkedIn + the `sameAs` link in our `Organization` JSON-LD.
- **Why**: trust signal for provider research + the first touchpoint for a lot of U.S. B2B healthcare outreach.
- **How**:
  1. From Ali's personal LinkedIn → **Work** menu → **Create a Company Page** → fill in name, logo (same file we'll ship as `web/public/logo.png`), tagline from `CLAUDE.md`.
  2. Set the Company Page URL to `linkedin.com/company/zenith-care-solutions` (or whatever Ali likes). This URL is already baked into `web/lib/site.ts` — if the final URL differs, we'll update one line.
  3. Add the website URL back: `https://zenithcaresolutions.com`.
- **Env var**: none (the LinkedIn URL is a code constant in `web/lib/site.ts`, not an env).
- **Where in Vercel**: n/a.

### 2.11 UptimeRobot: uptime monitoring

- **What**: a free service that checks the site every 5 minutes and emails you if it goes down.
- **Why**: Phase 4 launch item. A broken deploy or expired domain should not be found by a customer first.
- **How** (needs your account, so this part is yours):
  1. [uptimerobot.com](https://uptimerobot.com) → register (free plan: 50 monitors, 5 minute checks).
  2. **Add monitor** → type **HTTP(s)** → name `Zenith home` → URL `https://thezcs.com/` → interval 5 minutes.
  3. **Add monitor** → type **Keyword** → URL `https://thezcs.com/contact` → keyword `Zenith Care Solutions`, alert when the keyword is **missing**. This catches a blank or error page that still returns 200.
  4. **Add monitor** → HTTP(s) → `https://thezcs.com/sitemap.xml`, so a broken sitemap is noticed before Google does.
  5. Alert contact: your email (and optionally WhatsApp via their integrations). Confirm the verification email.
  6. Optional: create a public status page. Not needed at this size.
- **Env var**: none.
- **Check it works**: pause a monitor and confirm you get the "paused" email, then resume.

---

## 3. Vercel — environment variables cheat-sheet

All env vars Zenith uses, and where to scope each one.

| Variable | Value | Scopes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://zenithcaresolutions.com` | Production (optional — code defaults to this value) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `ali@zenithcaresolutions.com` | Production, Preview, Development |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | digits-only, country code first, no `+` | Production only |
| `NEXT_PUBLIC_CALENDLY_URL` | the public event URL from Calendly | Production only |
| `NEXT_PUBLIC_FORMSPREE_ID` | 8-character form ID | Production only |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` from GA4 Admin, Data streams | Production only |

**How to add each one**:

1. Vercel → Project → **Settings** → **Environment Variables**.
2. Click **Add New**.
3. Paste the **Name** (left) and **Value** (right).
4. Under **Environment**, tick only the scope(s) listed in the table.
5. Save. Vercel re-deploys automatically; the next successful deploy picks up the new value.

**Why "Production only" for most of them**: our code already gates the Google Analytics script on `VERCEL_ENV === "production"`, and the WhatsApp / Calendly components hide themselves when their env is blank. Scoping to Production doubles the defence — a preview deploy literally can't accidentally send events to Google Analytics or render a WhatsApp link that routes to Ali's real number.

**Never commit any of these to the repo.** `web/.env.local` is gitignored and holds your local test values; everything that matters in prod lives in Vercel's settings panel.

---

## 4. Vercel — custom domain & HTTPS

Once env vars are in and a build has succeeded on `release/v1.0.0`:

1. Vercel → Project → **Settings** → **Domains** → **Add** → enter `zenithcaresolutions.com`.
2. Vercel shows DNS records to add — typically:
   - **Apex** (`@`): `A` record pointing at `76.76.21.21`
   - **`www`**: `CNAME` pointing at `cname.vercel-dns.com`
3. In Namecheap DNS panel, remove any default `A` / `CNAME` for `@` and `www`, add the two Vercel records.
4. Add `www.zenithcaresolutions.com` as a second domain in Vercel and set it to **Redirect to `zenithcaresolutions.com`** (apex).
5. Wait up to an hour for DNS propagation (usually under 10 minutes).
6. Vercel issues a Let's Encrypt certificate automatically. The domain status flips to **Valid** when done. HTTPS is live.
7. Confirm by visiting both `http://zenithcaresolutions.com` (should 301 to HTTPS) and `https://www.zenithcaresolutions.com` (should 301 to apex).

If you want to use a different DNS provider later (Cloudflare, etc.), the same records work — only the host changes.

---

## 5. Launch-day smoke tests

Full checklist in [`10-launch-checklist.md`](10-launch-checklist.md). Quick version:

- [ ] `https://zenithcaresolutions.com` loads over HTTPS, no console errors
- [ ] WhatsApp button opens WhatsApp with a prefilled message on mobile Safari + Android Chrome
- [ ] `mailto:` link opens the user's mail client with the right subject
- [ ] Calendly embed renders on `/contact`, you can book a slot end-to-end
- [ ] Contact form submits — check Formspree inbox + your Google Workspace inbox
- [ ] GA4 Realtime shows the pageview from the smoke test
- [ ] Search Console: sitemap submitted, 0 coverage errors
- [ ] SSL Labs scan on the domain grades A or higher ([ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/))
- [ ] Lighthouse ≥ 95 on Home / Services / Contact (mobile + desktop)

---

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| WhatsApp button missing in prod | `NEXT_PUBLIC_WHATSAPP_NUMBER` not set, has `+`, or has spaces | Re-add, digits only, country code first, no `+`. Trigger a redeploy. |
| Calendly embed shows "Event not found" | The URL env is set but the event isn't published yet | Open the Calendly event, click **Share**, confirm the URL is live. |
| Contact form shows "Submission failed (422)" | A required field is empty on the server side (Formspree is stricter than browser validation can be) | We dropped `noValidate` in PR #8 so the browser catches most of these. If one still slips through, check Formspree's form settings for required-field rules we didn't declare. |
| Browser console shows a CSP violation when loading Calendly | Calendly started serving from a subdomain we didn't allowlist | Open browser DevTools → Console, note the blocked URL, add that host to the relevant CSP directive in `web/next.config.ts`, ship as `hotfix/csp-<domain>`. |
| GA4 Realtime stays empty | Env var not set, or scope includes Preview/Development (both of which code also gates against) | Confirm env var is set to Production only. Check `window.gtag` exists in a prod browser session. |
| `https://zenithcaresolutions.com` doesn't resolve 10 min after DNS change | DNS cache | Try an incognito window. If still broken 1 hour later, re-check the records in Namecheap and Vercel match exactly. |

---

## 7. Monthly / yearly maintenance

- **Monthly**: check GA4 reports, Formspree inbox, Calendly bookings. Review Search Console for new coverage errors.
- **January every year**:
  - Bump the hardcoded footer year in `web/components/footer.tsx`
  - Update `CPT_RATES` in `web/lib/roi.ts` when CMS publishes the new Physician Fee Schedule (the self-check throws if the anchor drifts without updating the sentinel)
- **Before 2027-10-11**: rotate the `Expires:` date in `web/public/.well-known/security.txt`.
- **After 30 days of clean production HTTPS**: submit `zenithcaresolutions.com` to the [HSTS preload list](https://hstspreload.org/).
