# App Flow

**Project**: Zenith Care Solutions — marketing website
**Version**: v1.0
**Last updated**: 2026-10-11

Describes every path a visitor can take through the site. No logged-in flows (the site has none).

---

## 1. Primary conversion flow — "Practice Manager, cold Google search"

```
Google search: "chronic care management outsourcing"
      │
      ▼
Lands on /services/chronic-care-management  (SEO entry page)
      │
      ├── Reads revenue math + CPT table
      ├── Clicks "Calculate for my practice" ──► /roi-calculator (client-side)
      │       └── Sees estimate ──► Clicks "Book a 15-min call"
      │                                   │
      │                                   ▼
      │                            /contact (Calendly embed)
      │                                   │
      │                                   ▼
      │                            Books slot on Calendly ✅ CONVERSION
      │
      ├── Clicks "About" ──► /about (founder credentials)
      ├── Clicks "HIPAA" ──► /hipaa-compliance (trust signal)
      │
      └── Clicks WhatsApp float ──► wa.me/<number> prefilled ✅ CONVERSION
```

## 2. Secondary flow — "Physician, read blog, convert later"

```
Google / LinkedIn ──► /resources/<slug>  (MDX blog post)
      │
      ├── Reads article; sees inline "Related service" CTA
      ├── Author bio at bottom links to /about
      └── Footer always-visible CTA ──► /contact
```

## 3. Scripted chatbot flow — "Office manager, in-page question"

The chatbot is a floating button on every page. Clicking opens a panel. The user never types — they click one of 2–4 predefined options per node.

```
[Chatbot opens]
  "Hi! What can I help you with?"
    ├── (btn) What is CCM?
    ├── (btn) How much does it cost?
    ├── (btn) Is my practice eligible?
    ├── (btn) How do you work with our EHR?
    └── (btn) Talk to a human
            │
            ▼
    "Great — pick how you want to connect:"
    ├── (btn) WhatsApp ──► wa.me link (new tab)
    ├── (btn) Book a call ──► /contact (Calendly)
    └── (btn) Email ──► mailto:
```

Every branch terminates with a human-exit CTA. Full node content lives in `content/chatbot.json` and is documented in `05-data-schema.md`.

**Guarded behaviors**:
- Disclaimer banner "Do not share patient information" is always visible above the panel.
- No free-text input exists.
- Nothing is sent off-device — the whole tree runs client-side.
- "Back" and "Start over" controls always available.

## 4. Contact flow — "Doesn't want Calendly"

`/contact` offers three equal doors:

```
                       ┌── Big WhatsApp button ──► wa.me/<number>?text=…
Visitor on /contact ───┼── Big Email button ─────► mailto:ali@zenithcaresolutions.com?subject=…
                       ├── Formspree form (name, practice, state, msg) ──► POST ──► Formspree ──► email to Ali
                       └── Calendly embed (inline) ───────────────────► Calendly
```

Form submission flow:
```
User fills form
      │
      ▼
Client-side validation (required fields, PHI regex scan)
      │
      ├── Fails ──► inline error, nothing sent
      │
      └── Passes ──► POST to Formspree
                       │
                       ├── 200 ──► show success state ("We'll reply within 1 business day")
                       └── Error ──► show error + fallback "Email us at …"
```

## 5. ROI calculator flow — "Decision-maker, needs the number"

Pure client-side. No data leaves the browser.

```
/roi-calculator
      │
      ▼
Inputs:
  • Eligible Medicare patients (slider: 50–1000)
  • % enrolled you expect (slider: 20–80%)
  • Code mix (dropdown: Base only / Base + Complex)
      │
      ▼
Live outputs (update on input):
  • Monthly reimbursement range
  • Annual reimbursement range
  • Zenith's share (if a public rate is published) OR "contact for rate"
      │
      ▼
CTA: "Book a call to discuss your panel" ──► /contact
```

## 6. Legal / informational — "Enterprise procurement team"

Linear reads. No conversion. Site must render these without JS.

```
Footer ──► /privacy
       ──► /terms
       ──► /hipaa-statement
       ──► /accessibility
```

## 7. 404 flow

```
Unknown URL ──► app/not-found.tsx
                 ├── Friendly message
                 ├── Search bar? NO (not worth building)
                 └── 3 top links: Home, Services, Contact
```

## 8. Global persistent elements

Every page renders:
- **Top nav**: Services ▾, Who We Serve ▾, About, Resources, FAQ, [Book a Call] (right-side primary button)
- **Floating chatbot button** (bottom-right)
- **Footer**: logo, nav mirror, legal links, WhatsApp + email, disclaimers, copyright, "Not medical advice"

## 9. States that do NOT exist in v1

Deliberate omissions to call out so no one builds them by accident:
- No login / register / forgot-password
- No account / profile / settings
- No cart / checkout / order history
- No payment flow
- No file upload
- No comment system on blog
- No newsletter signup *(may add later — defer to v1.1)*
- No search *(small site; nav is enough)*
