import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/refund-policy";
const UPDATED = "2026-10-23";

export const metadata: Metadata = pageMetadata({
  title: "Refund and Cancellation Policy",
  description:
    "When a practice can cancel a Zenith Care Solutions service and when a refund is available.",
  path: PATH,
});

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Refund and Cancellation", path: PATH },
        ])}
      />
      <LegalPage title="Refund and Cancellation Policy" effectiveDate={UPDATED} lastUpdated={UPDATED}>
        <p>
          This policy applies to services bought from {site.legalName}. Your
          signed service agreement is the final word if it differs from this
          page.
        </p>

        <h2>Cancelling a monthly service</h2>
        <ul>
          <li>You can cancel at any time by written notice (email is fine) to {site.email}.</li>
          <li>Cancellation takes effect 30 days after we receive your notice. You pay for services up to that date.</li>
          <li>After cancellation no further invoices are sent.</li>
        </ul>

        <h2>Refunds</h2>
        <ul>
          <li>If you paid for a period we did not deliver, we refund the unused part, pro-rated by days.</li>
          <li>Work already delivered is not refundable.</li>
          <li>If we cannot start your service as agreed and you cancel before work begins, we refund what you paid.</li>
          <li>If we made an error in an invoice, we correct it and refund any overpayment.</li>
        </ul>

        <h2>How refunds are paid</h2>
        <p>
          Refunds go back to the original payment method where possible, in the
          same currency (USD), within 10 business days of approval.
        </p>

        <h2>How to ask</h2>
        <p>
          Email {site.email} with your invoice reference and what you are
          asking for. We reply within 1 business day. If you disagree with our
          answer, see <Link href="/complaints">Complaints and Disputes</Link>.
        </p>
      </LegalPage>
    </>
  );
}
