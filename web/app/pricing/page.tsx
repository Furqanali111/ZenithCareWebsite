import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { pricing, pricingLabel } from "@/lib/pricing";
import { categoryMeta } from "@/lib/services";

const PATH = "/pricing";
const UPDATED = "2026-10-23";

export const metadata: Metadata = pageMetadata({
  title: "Pricing and Billing Model",
  description:
    "How Zenith Care Solutions prices care management, revenue cycle management and virtual staffing, what is included, and how billing works.",
  path: PATH,
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: PATH },
        ])}
      />
      <LegalPage title="Pricing and billing model" eyebrow="Pricing" lastUpdated={UPDATED}>
        <p>
          All prices are in <strong>U.S. dollars (USD)</strong>. Every
          engagement is billed by invoice after you sign a written service
          agreement. There is no online checkout and no card is charged on this
          website.
        </p>

        {pricing.map((p) => (
          <section key={p.category}>
            <h2>
              <Link href={categoryMeta[p.category].href}>{pricingLabel(p)}</Link>
            </h2>
            <p>{p.summary}</p>
            <ul>
              <li>
                <strong>Price:</strong>{" "}
                {p.amount
                  ? `${p.amount} ${p.unit}`
                  : "Set per practice and stated in your written proposal before you sign"}
              </li>
              <li>
                <strong>Payment type:</strong>{" "}
                {p.billing === "monthly"
                  ? "Recurring monthly invoice, cancel any time under the Refund and Cancellation policy"
                  : "One-time invoice"}
              </li>
              <li>
                <strong>Start time:</strong> {p.startTime}
              </li>
              <li>
                <strong>Extra charges:</strong> {p.extras}
              </li>
            </ul>
            <p>
              <strong>Included:</strong>
            </p>
            <ul>
              {p.included.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>How billing works</h2>
        <ul>
          <li>You see the full amount in your written proposal before you sign.</li>
          <li>Invoices show the final amount in USD, the service, and the billing period. Any applicable taxes are listed on the invoice.</li>
          <li>You can pay by ACH, wire transfer, or a payment link on the invoice. Payment is never taken on this website.</li>
          <li>There are no hidden recurring charges. Monthly services renew only while your agreement is active.</li>
        </ul>

        <h2>After you pay</h2>
        <ul>
          <li>You receive a receipt by email with an invoice reference number, the amount, the payment date and the service paid for.</li>
          <li>We confirm your start date, normally within 1 business day, and the next step in onboarding.</li>
          <li>If a payment fails or is cancelled, the invoice stays open, nothing starts, and we email you so you can retry or ask for another method.</li>
        </ul>
        <p>
          Questions about a price or an invoice? See{" "}
          <Link href="/contact">Contact</Link>, or read the{" "}
          <Link href="/refund-policy">Refund and Cancellation policy</Link> and{" "}
          <Link href="/service-delivery">Service Delivery policy</Link>.
        </p>
      </LegalPage>
    </>
  );
}
