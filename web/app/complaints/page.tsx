import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/complaints";
const UPDATED = "2026-10-23";

export const metadata: Metadata = pageMetadata({
  title: "Complaints and Disputes",
  description:
    "How to report a problem with Zenith Care Solutions, who reviews it, and how we resolve complaints and billing disputes.",
  path: PATH,
});

export default function ComplaintsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Complaints and Disputes", path: PATH },
        ])}
      />
      <LegalPage title="Complaints and Disputes" effectiveDate={UPDATED} lastUpdated={UPDATED}>
        <p>
          If something went wrong, tell us. This page explains how to report a
          problem and what happens next.
        </p>

        <h2>How to complain</h2>
        <ul>
          <li>Email <a href={`mailto:${site.email}?subject=Complaint`}>{site.email}</a> with the subject &ldquo;Complaint&rdquo;.</li>
          <li>Include your practice name, what happened, and any invoice reference.</li>
          <li>Please do not include patient information.</li>
        </ul>

        <h2>What happens next</h2>
        <ul>
          <li><strong>Within 2 business days:</strong> we confirm we received it and name who is handling it.</li>
          <li><strong>Within 10 business days:</strong> we send a written answer and any fix or refund offered.</li>
          <li><strong>Not satisfied?</strong> Ask for escalation. A founder reviews the case and replies within 5 business days.</li>
        </ul>

        <h2>Billing disputes</h2>
        <p>
          Tell us before the invoice due date if you dispute an amount. We pause
          follow-up on the disputed part while we review it. Refund rules are in
          the <Link href="/refund-policy">Refund and Cancellation policy</Link>.
        </p>

        <h2>Governing law</h2>
        <p>
          Unresolved disputes are handled under the governing law and venue set
          out in our <Link href="/terms">Terms of Service</Link> and your
          service agreement.
        </p>
      </LegalPage>
    </>
  );
}
