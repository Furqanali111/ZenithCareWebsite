import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/terms";
const EFFECTIVE_DATE = "2026-10-11";
const LAST_UPDATED = "2026-10-11";
// shortcut: contact routes to the primary inbox until role aliases are set
// up (legal@) per WebSiteDoc/14-go-live-accounts.md §2.4.
const LEGAL_EMAIL = site.email;

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms of use for the Zenith Care Solutions website: access, permitted use, intellectual property and liability.",
  path: PATH,
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: PATH },
        ])}
      />

      <LegalPage
        title="Terms of Service"
        effectiveDate={EFFECTIVE_DATE}
        lastUpdated={LAST_UPDATED}
      >
          <h2>Acceptance</h2>
          <p>
            By accessing or using the Zenith Care Solutions website at{" "}
            <strong>{site.url}</strong> (the &ldquo;<strong>Site</strong>
            &rdquo;), you agree to these Terms of Service. If you do not
            agree, do not use the Site.
          </p>
          <p>
            The Site is operated by{" "}
            <strong>Zenith Care Solutions LLC</strong> (&ldquo;Zenith&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;), a Wyoming limited
            liability company.
          </p>

          <h2>The Site is informational, not a service agreement</h2>
          <p>
            The Site provides information about Zenith&rsquo;s Chronic
            Care Management and related services. Nothing on the Site
            constitutes a service contract, an offer to enter into a
            contract, or professional advice. A binding engagement with
            Zenith requires a separately signed service agreement and,
            where applicable, a Business Associate Agreement.
          </p>

          <h2>Service engagements</h2>
          <p>
            Paid services are governed by the signed service agreement.
            Prices and billing are described on the{" "}
            <Link href="/pricing" className="text-brand-accent underline underline-offset-2 hover:text-brand-ink">Pricing</Link>{" "}
            page, cancellations and refunds in the{" "}
            <Link href="/refund-policy" className="text-brand-accent underline underline-offset-2 hover:text-brand-ink">Refund and Cancellation policy</Link>,
            delivery in the{" "}
            <Link href="/service-delivery" className="text-brand-accent underline underline-offset-2 hover:text-brand-ink">Service Delivery policy</Link>{" "}
            and problems in{" "}
            <Link href="/complaints" className="text-brand-accent underline underline-offset-2 hover:text-brand-ink">Complaints and Disputes</Link>.
          </p>

          <h2>No medical advice</h2>
          <p>
            Content on the Site is for informational purposes for U.S.
            healthcare providers and practice administrators. It is{" "}
            <strong>not medical advice</strong> and must not be used as a
            substitute for clinical judgment or professional licensure,
            billing, legal, or compliance advice. Zenith makes no
            warranty regarding the accuracy, completeness, or timeliness
            of any content.
          </p>
          <p>
            Users are responsible for independently verifying any CPT
            code reimbursement amounts, Medicare rules, or regulatory
            statements before acting on them. CMS rules change; always
            consult the current authority.
          </p>

          <h2>Permitted use</h2>
          <p>
            You may use the Site to learn about Zenith&rsquo;s services,
            read publicly available content, submit inquiries, and
            schedule discussions. You may not:
          </p>
          <ul>
            <li>Use the Site in any manner that violates applicable law or regulation</li>
            <li>Attempt to interfere with the Site&rsquo;s operation or security</li>
            <li>Scrape, data-mine, or reproduce content beyond standard fair use</li>
            <li>Submit false, defamatory, or infringing content</li>
            <li>Submit patient-identifying information or any protected health information</li>
          </ul>

          <h2>Intellectual property</h2>
          <p>
            The Site, its design, text, graphics, logos, and compiled
            content are the property of Zenith or its licensors and are
            protected by U.S. and international intellectual property
            laws. You may share links to our pages and quote brief
            excerpts with attribution. Any other reproduction requires
            written permission.
          </p>

          <h2>Third-party services</h2>
          <p>
            The Site integrates third-party services (Calendly,
            Formspree, WhatsApp, analytics). Your use of those services
            is subject to their own terms and privacy policies. Zenith is
            not responsible for third-party service availability or
            practices.
          </p>

          <h2>Disclaimers</h2>
          <p>
            <strong>
              THE SITE AND ITS CONTENT ARE PROVIDED &ldquo;AS IS&rdquo;
              AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY
              KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT.
            </strong>{" "}
            We do not warrant that the Site will be uninterrupted,
            error-free, or free of harmful components.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            <strong>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZENITH AND ITS
              AFFILIATES, OFFICERS, AND AGENTS SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
              ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE.
            </strong>{" "}
            Our aggregate liability for any claim arising from your use
            of the Site is limited to USD $100.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain
            warranties or the limitation of liability for certain
            damages; in those jurisdictions our liability is limited to
            the maximum extent permitted by law.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Zenith from any
            claim arising out of your breach of these Terms, your use of
            the Site, or your violation of any law or third-party right.
          </p>

          <h2>Governing law and venue</h2>
          <p>
            These Terms are governed by the laws of the State of{" "}
            <strong>Wyoming</strong>, without regard to conflict-of-law
            principles. Any dispute arising from these Terms or the Site
            shall be resolved exclusively in the state or federal courts
            located in Wyoming, and you consent to the personal
            jurisdiction of those courts.
          </p>

          <h2>Changes</h2>
          <p>
            We may modify these Terms at any time by posting a revised
            version on the Site. Your continued use after a change
            constitutes acceptance.
          </p>

          <h2>Contact</h2>
          <p>
            {site.legalName} &middot; Wyoming, USA
            <br />
            Mailing address: {site.mailingAddress}
            <br />
            Email:{" "}
            <Link
              href={`mailto:${LEGAL_EMAIL}`}
              className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
            >
              {LEGAL_EMAIL}
            </Link>
          </p>
      </LegalPage>
    </>
  );
}
