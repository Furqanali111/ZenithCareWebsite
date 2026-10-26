import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/data-request";
const UPDATED = "2026-10-26";

export const metadata: Metadata = pageMetadata({
  title: "Data Access and Deletion Requests",
  description:
    "How to ask Zenith Care Solutions to access, correct or delete the personal information you gave us through this website.",
  path: PATH,
  rootOgImage: true,
});

const subject = encodeURIComponent("Privacy request: delete my data");
const body = encodeURIComponent(
  "I ask Zenith Care Solutions to delete the personal information it holds about me.\n\nName:\nEmail used on the site:\nPractice (optional):\n\nPlease do not include patient information.",
);

export default function DataRequestPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Data Requests", path: PATH },
        ])}
      />
      <LegalPage title="Data Access and Deletion Requests" effectiveDate={UPDATED} lastUpdated={UPDATED}>
        <p>
          You can ask us to show you, correct, or delete the personal
          information we hold about you from this website: contact form
          messages, emails and call-booking details. No account is needed.
        </p>

        <h2>How to ask</h2>
        <p>
          <Link href={`mailto:${site.email}?subject=${subject}&body=${body}`}>
            Email a deletion request
          </Link>{" "}
          (opens your email app with a ready message), or write to{" "}
          {site.email} or to {site.mailingAddress}. Tell us your name and the
          email address you used. Do not send patient information.
        </p>

        <h2>What happens next</h2>
        <ul>
          <li>We confirm we received your request within 10 business days.</li>
          <li>
            We may ask you to reply from the same email address so we can
            check it is you.
          </li>
          <li>
            We act within 45 days (the longest time most U.S. state privacy
            laws allow) and tell you what was deleted.
          </li>
          <li>
            We may keep limited records we are legally required to keep, such
            as signed contracts and invoices, and we tell you if so.
          </li>
          <li>
            Requests are free. We do not penalize you for making one.
          </li>
        </ul>

        <h2>Other providers</h2>
        <p>
          Form messages pass through Formspree, bookings through Calendly, and
          analytics through Google. When we delete your data we also remove it
          from the tools we control and ask these providers to do the same
          where they hold a copy. See the <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalPage>
    </>
  );
}
