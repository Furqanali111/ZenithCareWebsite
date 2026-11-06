import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/hipaa-statement";
const LAST_UPDATED = "2026-10-11";
// shortcut: contact routes to the primary inbox until role aliases are set
// up (privacy@, compliance@, legal@) per WebSiteDoc/Project/14-go-live-accounts.md §2.4.
const COMPLIANCE_EMAIL = site.email;

export const metadata: Metadata = pageMetadata({
  title: "HIPAA Statement",
  description:
    "Zenith Care Solutions' formal HIPAA Business Associate posture, BAAs, safeguards, Minimum Necessary, breach notification.",
  path: PATH,
  rootOgImage: true,
});

export default function HipaaStatementPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "HIPAA Statement", path: PATH },
        ])}
      />

      <LegalPage title="HIPAA Statement" lastUpdated={LAST_UPDATED}>
          <h2>Our role under HIPAA</h2>
          <p>
            Zenith Care Solutions LLC provides Chronic Care Management
            (&ldquo;CCM&rdquo;) and related clinical support to U.S.
            healthcare providers under contract. When we handle protected
            health information (PHI) for a client practice, we act as a{" "}
            <strong>Business Associate</strong>. This follows the Health
            Insurance Portability and Accountability Act, the HITECH Act
            and their rules (together, &ldquo;HIPAA&rdquo;).
          </p>

          <h2>This website collects no PHI</h2>
          <p>
            This website ({site.url}) is for practices that are thinking
            about working with us. <strong>It does not collect, store or
            send protected health information.</strong> Our forms and
            chatbot take business contact details only. Please
            do <strong>not</strong> send patient information through this
            site or by unencrypted email.
          </p>

          <h2>Our Business Associate Agreements</h2>
          <p>
            Before Zenith receives or handles any PHI on behalf of a client
            practice, we sign a <strong>Business Associate Agreement</strong>{" "}
            (BAA) with that practice. The BAA governs:
          </p>
          <ul>
            <li>Permitted uses and disclosures of PHI</li>
            <li>Safeguards we must maintain</li>
            <li>Breach notification obligations</li>
            <li>Return or destruction of PHI at the end of the engagement</li>
          </ul>
          <p>
            Our BAA is based on current HHS sample provisions and may be
            reviewed by prospective clients during the contracting process.
          </p>

          <h2>Safeguards we maintain</h2>
          <p>
            <strong>Administrative</strong>: workforce training on HIPAA and
            the Minimum Necessary rule; written policies and procedures;
            designated privacy and security contact; sanctions for workforce
            violations; access reviews.
          </p>
          <p>
            <strong>Physical</strong>: locked workspaces for personnel
            handling PHI; device inventory; secure disposal of hardware.
          </p>
          <p>
            <strong>Technical</strong>: all PHI is encrypted in transit. Staff
            work in the client&rsquo;s own EHR/CCM platform, not in exported
            data. We use multi-factor authentication, audit logs and a
            password manager. Email runs on HIPAA-eligible Google Workspace
            or Microsoft 365, each with a signed BAA from the vendor.
          </p>

          <h2>Minimum Necessary</h2>
          <p>
            Zenith accesses, uses, and discloses only the Minimum Necessary
            PHI to perform the services required under each client contract.
          </p>

          <h2>Breach notification</h2>
          <p>
            If unsecured PHI is breached, Zenith will tell the affected
            practice without unreasonable delay. This will be no later than
            HIPAA and the BAA require. The practice remains responsible for
            notifying affected individuals and HHS as the law requires.
          </p>

          <h2>What this statement is not</h2>
          <p>
            This statement describes Zenith&rsquo;s operational posture. It
            is <strong>not</strong> a Notice of Privacy Practices (which is
            a document covered entities provide to their patients), and it
            is <strong>not</strong> a substitute for a signed Business
            Associate Agreement. Prospective clients should request a BAA
            before any PHI is shared.
          </p>

          <h2>Contact</h2>
          <p>
            For HIPAA-related inquiries, please contact:{" "}
            <Link
              href={`mailto:${COMPLIANCE_EMAIL}`}
              className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
            >
              {COMPLIANCE_EMAIL}
            </Link>
            .
          </p>
          <p>
            {site.legalName} &middot; Wyoming, USA
            <br />
            Mailing address: {site.mailingAddress}
          </p>
      </LegalPage>
    </>
  );
}
