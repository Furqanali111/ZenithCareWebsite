import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/accessibility";
const LAST_UPDATED = "2026-10-11";
// shortcut: contact routes to the primary inbox until role aliases are set
// up (accessibility@) per WebSiteDoc/Project/14-go-live-accounts.md §2.4.
const ACCESSIBILITY_EMAIL = site.email;

export const metadata: Metadata = pageMetadata({
  title: "Accessibility Statement",
  description:
    "Zenith Care Solutions' commitment to WCAG 2.1 AA accessibility, what we do, how to report an issue, and how we handle third-party embeds.",
  path: PATH,
});

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Accessibility Statement", path: PATH },
        ])}
      />

      <LegalPage
        title="Accessibility Statement"
        lastUpdated={LAST_UPDATED}
      >
          <h2>Our commitment</h2>
          <p>
            Zenith Care Solutions is committed to making its website
            accessible to the broadest possible audience, including
            people with disabilities. We work to meet the Web Content
            Accessibility Guidelines (<strong>WCAG 2.1</strong>) at
            Level AA.
          </p>

          <h2>What we do</h2>
          <ul>
            <li>Semantic HTML and clear document structure</li>
            <li>Keyboard navigation across all interactive controls</li>
            <li>Visible focus indicators</li>
            <li>Sufficient color contrast for text and interactive elements</li>
            <li>Descriptive alternative text for meaningful images</li>
            <li>Form fields with associated labels and error descriptions</li>
            <li>
              Light / dark theme support that respects your system
              preference and persists your explicit choice
            </li>
            <li>
              Respect for <code>prefers-reduced-motion</code> on any
              animation
            </li>
          </ul>

          <h2>Ongoing effort</h2>
          <p>
            Accessibility is a continuing process. We test with
            automated tools (Lighthouse, axe) and periodic manual review
            (keyboard-only navigation, screen-reader smoke tests). If
            you encounter a barrier, we want to know.
          </p>

          <h2>Report an issue</h2>
          <p>
            Please email{" "}
            <Link
              href={`mailto:${ACCESSIBILITY_EMAIL}`}
              className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
            >
              {ACCESSIBILITY_EMAIL}
            </Link>{" "}
            with:
          </p>
          <ul>
            <li>The page URL</li>
            <li>A description of the barrier you encountered</li>
            <li>
              The assistive technology, browser, and operating system you
              were using (if any)
            </li>
          </ul>
          <p>
            We aim to acknowledge accessibility reports within 2 business
            days and to address substantive issues within 15 business
            days when feasible.
          </p>

          <h2>Third-party content</h2>
          <p>
            Some of our pages embed third-party services (Calendly for
            scheduling, Formspree for form delivery). Those providers
            manage their own accessibility; we have selected tools that
            publish accessibility statements and conform to WCAG where
            possible, but we cannot guarantee the behavior of
            third-party interfaces.
          </p>

          <h2>Contact</h2>
          <p>
            {site.legalName} &middot; Wyoming, USA
            <br />
            Mailing address: {site.mailingAddress}
            <br />
            Email:{" "}
            <Link
              href={`mailto:${ACCESSIBILITY_EMAIL}`}
              className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
            >
              {ACCESSIBILITY_EMAIL}
            </Link>
          </p>
      </LegalPage>
    </>
  );
}
