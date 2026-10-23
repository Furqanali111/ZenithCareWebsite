import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/service-delivery";
const UPDATED = "2026-10-23";

export const metadata: Metadata = pageMetadata({
  title: "Service Delivery Policy",
  description:
    "When and how Zenith Care Solutions starts and delivers its services: onboarding, working hours, reporting and support.",
  path: PATH,
});

export default function ServiceDeliveryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Service Delivery", path: PATH },
        ])}
      />
      <LegalPage title="Service Delivery Policy" effectiveDate={UPDATED} lastUpdated={UPDATED}>
        <p>
          This policy explains when and how {site.legalName} delivers services
          to a practice that has signed a service agreement.
        </p>

        <h2>What is delivered</h2>
        <p>
          Services are staff and work, not a physical product. Nothing is
          shipped. The scope of each engagement is listed in your written
          proposal and service agreement.
        </p>

        <h2>When it starts</h2>
        <p>
          Onboarding starts after the service agreement is signed and the first
          invoice is paid. It typically takes 3 to 6 weeks, depending on panel
          size and EHR complexity. We confirm the timeline for your practice
          in writing.
        </p>

        <h2>How it is delivered</h2>
        <ul>
          <li>Work is done remotely, inside your EHR or practice systems.</li>
          <li>Working hours and coverage are set in your agreement.</li>
          <li>Your practice keeps clinical oversight and its billing relationship.</li>
          <li>You get a named Zenith contact and regular activity reports.</li>
        </ul>

        <h2>Delays</h2>
        <p>
          If we cannot start or deliver on time, we tell you as soon as we
          know and agree a new date. Delays caused by system access not being
          ready on your side move the start date by the same amount.
        </p>

        <h2>Support</h2>
        <p>
          {site.hours}. We reply to messages within 1 business day. Reach us on
          the <Link href="/contact">Contact</Link> page. To report a problem,
          see <Link href="/complaints">Complaints and Disputes</Link>.
        </p>
      </LegalPage>
    </>
  );
}
