import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/how-it-works";

export const metadata: Metadata = pageMetadata({
  title: "How It Works",
  description:
    "What Zenith Care Solutions sells, who it serves, how a practice orders, how the work is delivered and how payment works.",
  path: PATH,
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "How It Works", path: PATH },
        ])}
      />
      <LegalPage title="How It Works" eyebrow="Working with Zenith" lastUpdated="2026-10-23">
        <h2>What we do</h2>
        <p>
          {site.legalName} provides remote care management, revenue cycle
          management and virtual medical staffing to U.S. physician practices.
          We supply trained staff who work inside your systems. Your practice
          stays the billing provider and keeps clinical oversight. We do not
          bill Medicare and we do not see patients.
        </p>

        <h2>Who we serve</h2>
        <p>
          Primary care, internal medicine and geriatric practices in the United
          States, and the practice managers who run them. We work with U.S.
          practices only. Our team works remotely.
        </p>

        <h2>How to order</h2>
        <ul>
          <li><strong>1. Talk.</strong> <Link href="/contact">Book a 15-minute call</Link> or email us.</li>
          <li><strong>2. Proposal.</strong> We send a written proposal with scope and price in USD (see <Link href="/pricing">Pricing</Link>).</li>
          <li><strong>3. Agreement.</strong> You sign a service agreement and, where patient data is involved, a Business Associate Agreement.</li>
          <li><strong>4. Invoice.</strong> We send an invoice. You pay by ACH, wire or payment link.</li>
          <li><strong>5. Start.</strong> We confirm your start date and onboard the team.</li>
        </ul>

        <h2>How the service is delivered</h2>
        <p>
          Work is done remotely, inside your EHR or practice systems, during
          the hours set in your agreement. You get regular reports on what was
          done. Details are in the <Link href="/service-delivery">Service Delivery policy</Link>.
        </p>

        <h2>What we need from you</h2>
        <ul>
          <li>A signed service agreement (and BAA when needed)</li>
          <li>Practice name, NPI, EHR and a main contact</li>
          <li>Access to your systems under your own security rules</li>
        </ul>
        <p>
          Please do not send patient information through this website, email
          or chat. See <Link href="/hipaa-compliance">HIPAA compliance</Link>.
        </p>
      </LegalPage>
    </>
  );
}
