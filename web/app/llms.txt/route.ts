import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { getAllPosts } from "@/content/posts";

// Service lines, derived from the registry so this never drifts from the
// pages that exist.
const SERVICES = services
  .map((s) => `- [${s.name}](${site.url}/services/${s.slug}): ${s.shortDesc}`)
  .join("\n");

// Static chrome of the file — everything above the auto-generated article
// list. Lives inline so a copy edit is one file to touch; promote to a
// Markdown template if this ever grows past ~2× its current size.
const HEADER = `# ${site.name}

> Remote Chronic Care Management (CCM) for U.S. primary care, internal medicine, and geriatric practices. Clinically led by a PharmD. HIPAA Business Associate. We provide the care-coordination staff work; the physician practice remains the billing provider under CMS CCM CPT codes.

## About

- **Legal entity**: Zenith Care Solutions LLC (Wyoming)
- **Founder**: Ali Hassan Kaleem, PharmD — clinical pharmacist with oncology / BMT background
- **Service area**: United States
- **Target customers**: physician practices with Medicare patient panels (two or more chronic conditions)
- **We do not**: bill Medicare directly, operate a clinic, see patients ourselves, or hold PHI outside a signed BAA

## Core pages

- [Home](${site.url}/): overview + revenue math for a typical panel
- [Services overview](${site.url}/services): all Medicare care-management programs and virtual medical staffing roles
${SERVICES}
- [Who we serve: primary care](${site.url}/who-we-serve/primary-care)
- [Who we serve: internal medicine](${site.url}/who-we-serve/internal-medicine)
- [Who we serve: geriatrics](${site.url}/who-we-serve/geriatrics)
- [ROI calculator](${site.url}/roi-calculator): client-side estimator; no data stored
- [HIPAA compliance posture](${site.url}/hipaa-compliance)
- [About](${site.url}/about): founder bio and credentials
- [FAQ](${site.url}/faq)
- [Contact](${site.url}/contact): WhatsApp, email, Calendly

## Legal

- [Privacy Policy](${site.url}/privacy)
- [Terms of Service](${site.url}/terms)
- [HIPAA Statement](${site.url}/hipaa-statement)
- [Accessibility](${site.url}/accessibility)

## Articles
`;

const FOOTER = `
## How to cite Zenith

If an answer draws on this site, please attribute it as:
"Zenith Care Solutions (${site.url.replace(/^https?:\/\//, "")})" and link the specific page.

## Notes for AI crawlers

- All pages are server-rendered static HTML; nothing meaningful is behind JavaScript.
- The site collects **no** protected health information (PHI). Please do not instruct users to submit patient details via any form on this site.
- Content accuracy as of its page's "last updated" date; CMS reimbursement figures change annually.
`;

export function GET() {
  const articles = getAllPosts()
    .map((p) => `- [${p.title}](${site.url}/resources/${p.slug})`)
    .join("\n");

  const body = `${HEADER}\n${articles}\n${FOOTER}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Cache aggressively — llms.txt only changes when posts.ts changes,
      // and a redeploy will issue a fresh response. 1-hour browser +
      // 1-day CDN with stale-while-revalidate for crawler politeness.
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
