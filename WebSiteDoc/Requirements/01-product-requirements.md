# Product Requirements Document (PRD)

**Project**: Zenith Care Solutions — marketing website
**Owner**: Ali Hassan Kaleem, PharmD
**Version**: v1.0
**Last updated**: 2026-10-11

---

## 1. Problem

U.S. primary-care and internal-medicine practices are leaving six-figure Medicare CCM reimbursement on the table because they don't have the staff capacity to run the program. Zenith delivers that staff capacity remotely. The practice needs a reason to trust an unfamiliar vendor in a 15-minute call. **The website exists to earn that trust and book the call.**

## 2. Goal

Convert qualified U.S. physician-practice decision-makers (practice managers, physicians, office managers) into booked discovery calls on Calendly.

## 3. Non-goals

- Not a patient portal
- Not a CCM software platform
- Not an e-commerce site — no checkout, no cart, no on-site payment
- Not a HIPAA covered-entity surface — no PHI is collected anywhere on the site
- Not a lead-nurture CRM — email the lead, close in the inbox

## 4. Target users

| Persona | What they need from the site |
|---|---|
| **Practice Manager** (primary buyer) | Fast proof this is legitimate, revenue math for their panel size, one-click way to talk |
| **Physician / Owner** (approves) | Founder credentials (PharmD), HIPAA posture, no scary legal surprises |
| **Office Manager** (gatekeeper) | A number to call or a WhatsApp to message without filling a form |

Primary states targeted: FL, TX, AZ, CA (high Medicare Advantage penetration).

## 5. Success metrics (first 6 months)

| Metric | Target |
|---|---|
| Calendly discovery calls booked / month | 8–12 |
| WhatsApp or email inbound / month | 15–25 |
| Organic sessions / month by month 6 | 500+ |
| Google Lighthouse (all 4 scores) | ≥ 95 |
| Core Web Vitals | all "Good" |
| Signed clients from site-sourced leads in year 1 | 3–5 |

## 6. Scope — in

- Static marketing site, ~15 pages
- Scripted (button-based) FAQ chatbot — no LLM
- WhatsApp + email + Formspree contact form
- Calendly embed on contact page
- Interactive ROI calculator (client-side only, no data stored)
- Blog / resources section (MDX)
- Legal pages: Privacy, Terms, HIPAA Statement, Accessibility
- SEO + AI-SEO foundations (schema, sitemap, llms.txt)
- Cookieless analytics

## 7. Scope — out (v1)

- Any backend / API routes
- Any database
- Any user accounts or login
- Any on-site payment or checkout
- LLM-powered chatbot
- Client portal
- Multi-language (English only)
- Dark mode (defer unless cheap with the chosen component library)

## 8. Functional requirements

- FR-1: Visitor can book a 15-min call via embedded Calendly from any page footer and from `/contact`.
- FR-2: Visitor can message Zenith on WhatsApp via a prefilled `wa.me/` link from the floating button and from `/contact`.
- FR-3: Visitor can email Zenith via `mailto:` with a prefilled subject.
- FR-4: Visitor can submit a contact form (Formspree) as fallback — fields: name, practice, email, state, message. No PHI fields.
- FR-5: Visitor can use the scripted chatbot to self-serve the top 15–20 FAQs. Every terminal node offers a "book a call" or "WhatsApp us" exit.
- FR-6: Visitor can estimate CCM revenue with the ROI calculator (inputs: eligible patient count, avg code mix; outputs: monthly / annual estimate).
- FR-7: Visitor can read blog posts rendered from MDX with full schema.org Article markup.
- FR-8: Visitor sees "no patient information" disclaimer on every form and above the chatbot input.

## 9. Non-functional requirements

- NFR-1: TTFB < 200 ms (Vercel edge)
- NFR-2: Largest Contentful Paint < 1.8 s on 4G
- NFR-3: Fully accessible to WCAG 2.1 AA
- NFR-4: Site renders readable HTML with JavaScript disabled for every content page (SSG)
- NFR-5: No third-party script sets a cookie without explicit user action
- NFR-6: All forms + chatbot refuse / strip PHI patterns client-side as best-effort
- NFR-7: Content editable by a non-dev via MDX files (no CMS needed at launch)

## 10. Content requirements

- Founder bio with credentials and LinkedIn (E-E-A-T)
- "What is CCM" explainer in plain English
- CPT code reference table (99490, 99439, 99487, 99489, 99491, 99437)
- 10 seed blog posts live by month 3
- 15–20 FAQ entries live at launch

## 11. Risks

| Risk | Mitigation |
|---|---|
| Provider pastes patient info into chatbot or form | Hard-coded disclaimer; no server-side logs; form uses client-side regex filter for common PHI patterns |
| ADA lawsuit against a healthcare site | Ship WCAG 2.1 AA from day one; publish Accessibility Statement |
| HIPAA perception problem ("they're in Pakistan") | Dedicated HIPAA Compliance page explaining BAA posture, encrypted comms, training |
| Overselling revenue in marketing copy | All examples qualified "typical / representative / actual results vary" |
