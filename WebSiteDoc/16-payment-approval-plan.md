# Payment Approval Implementation Plan

**Goal**: make the site pass every item in `Doc/Scounts_Professional_Payment_Approval_Website_Guide-1.pdf` so the bank / PSP reviewer can understand Zenith in 30 seconds.
**Sources**: the Scounts guide, `Doc/article of orgranization.pdf`, `Doc/FilingInfo.pdf`.
**Date**: 2026-10-23

## 1. Facts from the LLC documents (single source of truth)

| Field | Value | Use on site |
|---|---|---|
| Legal name | Zenith Care Solutions LLC | Footer, About, every policy |
| Entity type / state | Wyoming LLC, perpetual, status Active, standing Good | About "Company information" |
| Filing ID | 2026-002113280 | About "Company information" |
| Formed | 10/22/2026 11:40 AM | About |
| Principal and mailing address | 30 N Gould St #70349, Sheridan, WY 82801 | Footer, Contact, policies (already in `site.mailingAddress`) |
| Registered agent | Registered Agents Inc, 30 N Gould St Ste R | Stays off the site (existing decision in `site.ts`) |
| Organizer | SCounts Private Limited, Karachi | Not shown on site |

Guide asks for "NTN" (a Pakistan tax id). For a Wyoming LLC the equivalent is the **EIN**. Nothing in the three docs gives an EIN yet.

## 2. Gap analysis: guide vs current site

| Guide section | Status today | Action |
|---|---|---|
| 1 Business identity | Legal name + mailing address in footer. No phone, no EIN or filing ID, About lacks company facts | Phase 1 |
| 2 What you do | Strong on home and services. Markets served and "how to order" not stated plainly | Phase 2 (How It Works) |
| 3 Products and services | **No prices, inclusions, delivery time, or one-time vs recurring** anywhere | Phase 2 (Pricing) |
| 4 Pricing and checkout | No currency, no final amount, no extra charges | Phase 2 (Pricing, "How billing works") |
| 5 Five policies | Terms and Privacy exist. **Refund and Cancellation, Service Delivery, Complaints missing** | Phase 2 |
| 6 Contact and support | Contact page exists. Phone empty, response time missing, WhatsApp and Formspree env unset | Phase 3 |
| 7 Security | HTTPS on Vercel. No Security page, claims unreviewed | Phase 4 |
| 8 After payment | No page. Payments are off-site invoices | Phase 2 ("After you pay" section) |
| 9 Real trust | Two founders listed, no photos, no reviews | Phase 5 |
| 10 FAQ | 15 Q&As exist. Missing pay, cancel, refund, recurring, documents | Phase 3 |
| 11 Fintech | Not a fintech. Needs one clear "we are not a financial institution" line | Phase 4 |
| 12 Footer | Missing phone, Refund, Complaints, EIN line | Phase 1 |
| 13 Red flags | Missing pricing, refund, complaints. Possible name and domain mismatch | Phase 6 |
| Recommended menu | Missing Pricing, How It Works, Security, Refund, Complaints | Phase 1 |

## 3. Decisions needed from you (blocks Phase 2 and 3)

Defaults are in brackets. I will use them if you do not answer.

1. **Pricing numbers** per service, in USD, one-time vs monthly. [No default: I will not invent prices. Placeholder structure only until you give numbers.]
2. **Checkout model** [Invoice-based, no online checkout. Matches `CLAUDE.md`. "How to pay" = Stripe invoice, ACH, wire, sent after a signed agreement.] Say so if the bank wants a real pay page, which reverses the "no /pay" rule.
3. **EIN** [Apply via IRS SS-4 (an LLC owned by a non-US person can apply by fax or mail, takes weeks). Site shows it only once issued.]
4. **Business phone** [Required by guide. Use a US VoIP or WhatsApp Business number.]
5. **Response time and hours** [1 business day, Mon to Fri 9 to 6 EST, already in `site.hours`.]
6. **Refund and cancellation terms** [30 day written notice for monthly plans, no refund for work already delivered, pro-rated refund for unused prepaid onboarding. Attorney to review.]
7. **Bank/PSP name** [Unknown. Some banks also want the live URL, a domain email, and proof the site owner is the signer.]

## 4. Consistency problems to fix first

- **Founders**: `CLAUDE.md` says Ali Hassan Kaleem (PharmD). `site.ts` lists Furqan Ali and Muhammad Usman. The bank compares the site to the signers of the account. Make the site match the people on the LLC paperwork and bank application.
- **Domain**: `site.ts` defaults to `thezcs.com`, deferred-items doc says `zenithcaresolutions.com`. Pick one, make email and site match.
- **Brand vs legal name**: Brand "Zenith Care Solutions", legal "Zenith Care Solutions LLC". Always show the LLC form in footer and policies.
- **Virtual address**: the mailing address is a mail-forwarding box. Keep calling it "mailing address", never "office". Some banks reject virtual addresses as a physical presence, so ask the bank early.

## 5. Phases (one PR each, branch off `develop`)

### Phase 1: Identity, footer, menu (`feature/company-identity`)
- `web/lib/site.ts`: add `formation: { state: "Wyoming", filingId: "2026-002113280", formedOn: "2026-10-22" }`, `ein` (env or empty, rendered only when set).
- `web/components/footer.tsx`: legal name, mailing address, phone, email, then links to Terms, Privacy, Refund, Complaints, Contact, socials. Add the EIN line when set.
- `web/app/about/page.tsx`: "Company information" block (legal name, Wyoming LLC, filing ID, formed date, mailing address, contact).
- `web/lib/site.ts` `nav` and `web/components/nav.tsx`: add Pricing, How It Works, Security, Complaints per the recommended menu. Keep the mega-menu for services.
- Reconcile founders and domain (section 4).

### Phase 2: Commercial pages (`feature/pricing-and-policies`)
New pages, each with `pageMetadata`, breadcrumb JSON-LD, sitemap entry, `llms.txt` entry, via the existing `LegalPage` or `PageHero` components:
- `/pricing`: per service card: description, what is included, price in USD, one-time or monthly, delivery or onboarding time, extra charges, taxes (none collected, no hidden recurring). Source from `web/lib/services.ts` so it cannot drift. Section "How billing works" (invoice, currency, payment methods, net terms) and "After you pay" (invoice receipt with reference number, amount, date, service, next step, start date; failed or cancelled payment: invoice stays open, email support).
- `/how-it-works`: who we serve (U.S. primary care, internal medicine, geriatrics), what we sell, how to order (call, agreement, BAA, invoice), delivery steps, markets served (U.S. practices; team operates from Pakistan, state it honestly).
- `/refund-policy` (titled Refund and Cancellation).
- `/service-delivery`: onboarding timeline, working hours, reporting cadence, who delivers.
- `/complaints`: how to raise it, email, acknowledgement in 2 business days, resolution target, escalation to the founder.
- `/terms`: add a "Service engagements" section pointing to Pricing, Refund and Delivery (today it says the site is informational only).
- Footer, sitemap, internal links to all of the above.

### Phase 3: Contact and FAQ (`feature/contact-and-faq-gaps`)
- Set env: `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_FORMSPREE_ID` in Vercel Production.
- `/contact`: show address, phone, email, hours, expected response time; verify the Formspree form submits end to end.
- `web/content/faq.json`: add the guide's questions: how it works, how to pay, is payment secure, delivery time, can I cancel, can I get a refund, how to contact support, what documents are required (BAA, service agreement, no PHI), any recurring payment. Skip duplicates already present.

### Phase 4: Security and regulatory statement (`feature/security-page`)
- `/security`: only claims we can prove: HTTPS, no PHI collected on site, no card data handled (payments via invoice provider), vendor list (Vercel, Formspree, Calendly, Plausible), BAA with clients. Cross-link `/hipaa-compliance`.
- "Regulatory status" paragraph on Security and About: Zenith is a staffing and care coordination vendor, not a bank, payment processor, or Medicare biller, holds no client funds, claims no license it does not hold. Replaces guide section 11.
- Check headers (HSTS, no mixed content) with the existing `next.config`.

### Phase 5: Trust (`feature/trust-signals`)
- Founder photos and real bios once the founder decision is made (tracked in `13-deferred-items.md`).
- Real LinkedIn company page URL, plus Facebook, Instagram, YouTube only if they exist.
- Audit all pages for unsupported claims: HIPAA certified, case studies, client logos, testimonials, ROI numbers must stay labelled "typical" or "representative". Remove anything we cannot back up.

### Phase 6: Verification (`feature/payment-approval-qa`, no new features)
Run in order, fix findings:
1. `design:accessibility-review` on new pages.
2. `searchfit-seo:on-page-seo` and `schema-markup` on new pages (Organization JSON-LD gets `legalName`, `identifier` filing ID).
3. `website-quality-checker:website-quality-checker` on the deployed preview.
4. Crawl for broken links and empty pages (guide red flag).
5. Walk the guide's red-flag list (section 13) and the 5-minute check below. Every answer must be yes.
6. `engineering:deploy-checklist`, then release branch per `11-git-workflow.md`.

## 6. Final 5-minute check (acceptance)

1. 30 second understanding: home hero + `/how-it-works` say who, what, where.
2. Price visible: `/pricing` shows USD, billing type, inclusions.
3. Contact visible: footer on every page has address, phone, email.
4. Terms, Privacy, Refund policy reachable from footer on every page.
5. Everything matches the bank application: legal name, address, founder names, service list, domain.

## 7. Notes and risks

- Guide says meeting it does not guarantee approval. Banks may ask for EIN, operating agreement, proof of address, and ID of the owner, none of which the site can supply.
- Operating agreement is not among the three docs. Single-member LLC banks usually require it.
- Policy text (refund, complaints, terms) should get the attorney review already listed in `13-deferred-items.md` before launch.
- The guide is written for Pakistan-regulated PSPs (NTN, SBP, SECP). Those items are mapped to U.S. equivalents above; ignore SBP and SECP wording.
- No em dashes anywhere in new copy, per project rule.
