import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/security";
const UPDATED = "2026-10-23";

export const metadata: Metadata = pageMetadata({
  title: "Security and Data Protection",
  description:
    "How this website protects visitors, what data it collects (none that is PHI), and the regulatory status of Zenith Care Solutions.",
  path: PATH,
  rootOgImage: true,
});

export default function SecurityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Security", path: PATH },
        ])}
      />
      <LegalPage title="Security" lastUpdated={UPDATED}>
        <p>
          This page lists what we do to protect visitors to this website, and
          what we do not do. We only state things we can show.
        </p>

        <h2>Website protection</h2>
        <ul>
          <li>Every page is served over HTTPS, and browsers are told to use HTTPS only (HSTS).</li>
          <li>Standard browser protections are on: no framing of our pages, no content-type guessing, and a content security policy.</li>
          <li>The site is hosted on Vercel. It has no login area and no user accounts.</li>
        </ul>

        <h2>What this website collects</h2>
        <ul>
          <li>Business contact details you choose to send: name, practice, NPI, EHR, state, panel size, and your message.</li>
          <li>Basic visit statistics and contact-link clicks through Google Analytics. See the <Link href="/privacy">Privacy Policy</Link>.</li>
          <li><strong>No patient information.</strong> The contact form warns visitors and checks for patterns that look like patient identifiers before it sends.</li>
          <li><strong>No payment details.</strong> Nothing is paid on this website. Invoices are paid by bank transfer or a payment link sent by email, so card and bank numbers never pass through our pages.</li>
        </ul>

        <h2>Third-party services</h2>
        <p>
          The site uses Vercel (hosting), Formspree (contact form), Calendly
          (booking), WhatsApp (messaging link) and Google Analytics. Each has
          its own security and privacy terms.
        </p>

        <h2>Patient data and HIPAA</h2>
        <p>
          Patient data stays inside each client practice&rsquo;s own systems
          under a signed Business Associate Agreement. Read how we handle it on
          the <Link href="/hipaa-compliance">HIPAA compliance</Link> page and in
          the <Link href="/hipaa-statement">HIPAA Statement</Link>.
        </p>

        <h2>Regulatory status</h2>
        <ul>
          <li>{site.legalName} is a Wyoming limited liability company providing care management, revenue cycle and staffing services to U.S. physician practices.</li>
          <li>We are not a bank, payment processor, money transmitter or other financial institution. We do not hold client or patient funds.</li>
          <li>We do not bill Medicare. Our clients bill, and we are paid by invoice for our staff&rsquo;s work.</li>
          <li>We are not certified, licensed or accredited by any regulator or standards body, and we do not claim to be. We operate as a HIPAA Business Associate under signed agreements.</li>
        </ul>

        <h2>Report a security concern</h2>
        <p>
          If you think something on this site is unsafe, email{" "}
          <a href={`mailto:${site.email}?subject=Security%20concern`}>{site.email}</a>.
          We reply within one business day. Please do not include patient
          information.
        </p>
      </LegalPage>
    </>
  );
}
