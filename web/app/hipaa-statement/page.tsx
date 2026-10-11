import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/hipaa-statement";
const LAST_UPDATED = "2026-10-11";
// shortcut: contact routes to the primary inbox until role aliases are set
// up (privacy@, compliance@, legal@) per WebSiteDoc/14-go-live-accounts.md §2.4.
const COMPLIANCE_EMAIL = site.email;

export const metadata: Metadata = pageMetadata({
  title: "HIPAA Statement",
  description:
    "Zenith Care Solutions' formal HIPAA Business Associate posture — BAAs, safeguards, Minimum Necessary, breach notification.",
  path: PATH,
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

      <article className="mx-auto max-w-prose px-6 pt-24 pb-20 md:pt-32 md:pb-24">
        <header>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Legal
          </span>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-5xl">
            HIPAA Statement
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="prose prose-neutral mt-10 max-w-none text-base leading-relaxed text-[color:var(--color-ink-600)] [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[color:var(--color-brand-900)] [&_h2]:tracking-tight [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2 [&_strong]:font-medium [&_strong]:text-[color:var(--color-ink-900)]">
          <h2>Our role under HIPAA</h2>
          <p>
            Zenith Care Solutions LLC provides Chronic Care Management
            (&ldquo;CCM&rdquo;) and related clinical support services to
            U.S. healthcare providers under contract. When we handle
            protected health information (PHI) on behalf of a client
            practice, we operate as a <strong>Business Associate</strong>{" "}
            under the Health Insurance Portability and Accountability Act
            (HIPAA), as amended by the HITECH Act, and the regulations
            issued thereunder (collectively, &ldquo;HIPAA&rdquo;).
          </p>

          <h2>This website collects no PHI</h2>
          <p>
            This website ({site.url}) is a marketing and informational
            resource for prospective client practices. <strong>It does not
            collect, store, process, or transmit protected health
            information.</strong> Our contact forms and chatbot are limited
            to business-contact information from providers and
            administrators. We ask every visitor <strong>not</strong> to
            submit any patient-identifying information through this site or
            by unencrypted email.
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
            <strong>Technical</strong>: encrypted transmission of all PHI;
            access via client-controlled EHR/CCM platforms rather than
            exported data; multi-factor authentication; audit logging;
            secure password management; encrypted email tooling (HIPAA-
            eligible Google Workspace or Microsoft 365, each with a signed
            BAA from the respective vendor).
          </p>

          <h2>Minimum Necessary</h2>
          <p>
            Zenith accesses, uses, and discloses only the Minimum Necessary
            PHI to perform the services required under each client contract.
          </p>

          <h2>Breach notification</h2>
          <p>
            In the event of a breach of unsecured PHI, Zenith will notify
            the affected client practice without unreasonable delay and in
            no case later than the timeframe required by HIPAA and the
            governing BAA. The client practice remains responsible for
            notifying affected individuals and HHS as required by law.
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
              className="text-[color:var(--color-brand-700)] underline underline-offset-2 hover:text-[color:var(--color-brand-900)]"
            >
              {COMPLIANCE_EMAIL}
            </Link>
            .
          </p>
          <p>Zenith Care Solutions LLC &middot; Wyoming, USA</p>
        </div>
      </article>
    </>
  );
}
