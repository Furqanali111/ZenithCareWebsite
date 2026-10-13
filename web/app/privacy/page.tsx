import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

const PATH = "/privacy";
const EFFECTIVE_DATE = "2026-10-11";
const LAST_UPDATED = "2026-10-11";
// shortcut: contact routes to the primary inbox until role aliases are set
// up (privacy@) per WebSiteDoc/14-go-live-accounts.md §2.4.
const PRIVACY_EMAIL = site.email;

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Zenith Care Solutions handles information collected through this website, what we collect, what we don't, and your rights.",
  path: PATH,
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: PATH },
        ])}
      />

      <LegalPage
        title="Privacy Policy"
        effectiveDate={EFFECTIVE_DATE}
        lastUpdated={LAST_UPDATED}
      >
          <h2>Who we are</h2>
          <p>
            Zenith Care Solutions LLC (&ldquo;<strong>Zenith</strong>
            &rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;
            <strong>us</strong>&rdquo;, or &ldquo;<strong>our</strong>
            &rdquo;) is a Wyoming limited liability company providing
            Chronic Care Management and related clinical support services
            to U.S. healthcare providers. This Privacy Policy explains how
            we handle information collected through our website at{" "}
            <strong>{site.url}</strong> (the &ldquo;<strong>Site</strong>
            &rdquo;).
          </p>
          <p>
            This policy covers only the Site. It does <strong>not</strong>{" "}
            cover the protected health information (PHI) we handle under
            separate Business Associate Agreements with client practices , 
            that information is governed by HIPAA, HITECH, our BAA with
            each client, and our internal privacy and security safeguards.{" "}
            <strong>No PHI is collected or stored through this Site.</strong>
          </p>

          <h2>Information we collect</h2>
          <p>
            We collect only the information you voluntarily provide, plus a
            minimal set of technical information collected automatically.
          </p>
          <p>
            <strong>Information you provide</strong>:
          </p>
          <ul>
            <li>
              Contact form submissions: your name, business email, practice
              name, U.S. state, role, and the message you send.
            </li>
            <li>
              Chatbot interactions (future): your clicks on scripted
              options. The chatbot does not accept free-text input and does
              not transmit anything beyond the scripted navigation state.
            </li>
            <li>
              Communications you initiate directly with us by email,
              WhatsApp, or phone.
            </li>
          </ul>
          <p>
            <strong>Information collected automatically</strong>:
          </p>
          <ul>
            <li>
              Pageview analytics (pages visited, referrer, country, device
              type) via a privacy-friendly, cookieless analytics tool
              (Plausible).
            </li>
            <li>
              Server-side request logs retained by our hosting provider
              (Vercel) for a limited period for security and operational
              purposes.
            </li>
          </ul>
          <p>
            <strong>We do not use cookies for tracking.</strong> We do not
            operate ad networks, retargeting pixels, or third-party
            trackers on the Site.
          </p>

          <h2>How we use information</h2>
          <p>We use the information you provide to:</p>
          <ul>
            <li>Respond to your inquiry and schedule a discussion</li>
            <li>Prepare a service proposal and contract if you request one</li>
            <li>Maintain records of our business communications</li>
          </ul>
          <p>We use automatic information to:</p>
          <ul>
            <li>Measure aggregate Site traffic and performance</li>
            <li>Diagnose errors and improve the Site</li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or trade your
            information to third parties for marketing purposes.
          </p>

          <h2>Service providers we rely on</h2>
          <p>
            We use the following third-party services to operate the Site.
            Each is bound by its own privacy policy, and we only share with
            them the information required for their function.
          </p>
          <ul>
            <li>
              <strong>Vercel, Inc.</strong>, website hosting. Standard web
              request logs.
            </li>
            <li>
              <strong>Formspree, Inc.</strong>, contact form processing.
              Form submission contents.
            </li>
            <li>
              <strong>Calendly LLC</strong>, discovery call scheduling.
              Booking details you enter in Calendly.
            </li>
            <li>
              <strong>Plausible</strong>, website analytics. Aggregate
              pageview data; no personal identifiers.
            </li>
            <li>
              <strong>Google Workspace</strong>, email we send and
              receive.
            </li>
          </ul>
          <p>
            If a contact form submission or email contains health
            information you provided (which we ask you not to send), that
            information is handled under the service provider&rsquo;s own
            terms.{" "}
            <strong>
              Please do not send patient-identifying information through
              the Site or by email.
            </strong>{" "}
            Use the secure channels we provide once a BAA is in place.
          </p>

          <h2>How long we keep information</h2>
          <ul>
            <li>
              Contact form submissions and email correspondence: retained
              for the duration of the business relationship and for up to
              3 years thereafter for recordkeeping.
            </li>
            <li>
              Analytics data: aggregate only; retained indefinitely for
              trend analysis. No personal identifiers are stored.
            </li>
          </ul>

          <h2>Security</h2>
          <p>
            We maintain reasonable administrative, technical, and physical
            safeguards to protect the information we collect. The Site is
            served over HTTPS. We restrict access to submitted information
            to personnel with a business need.{" "}
            <strong>
              No method of internet transmission or electronic storage is
              100% secure.
            </strong>{" "}
            You use the Site at your own risk and should not transmit
            sensitive information through it.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to request
            access to the personal information we hold about you, request
            correction or deletion, opt out of certain uses, or lodge a
            complaint with a data protection authority.
          </p>
          <ul>
            <li>
              <strong>California residents (CCPA/CPRA)</strong>, right to
              know, delete, correct, and opt out of the sale or sharing of
              personal information. We do not sell or share personal
              information as those terms are defined by the CCPA.
            </li>
            <li>
              <strong>Virginia residents (VCDPA)</strong>, right to
              access, correct, delete, and port your personal information,
              and to opt out of targeted advertising, sale, or certain
              profiling.
            </li>
            <li>
              <strong>Colorado residents (CPA)</strong>, similar rights
              to the VCDPA.
            </li>
            <li>
              <strong>Other U.S. states</strong>, residents of states
              with comprehensive consumer privacy laws (including CT, UT,
              TX, MT, IA, OR, DE, NJ, and others) may have similar rights
              under their jurisdiction&rsquo;s law; contact us using the
              email below to exercise them.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <Link
              href={`mailto:${PRIVACY_EMAIL}`}
              className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
            >
              {PRIVACY_EMAIL}
            </Link>
            . We will respond within the timeframes required by applicable
            law.
          </p>

          <h2>Children</h2>
          <p>
            The Site is not directed to children under 13, and we do not
            knowingly collect personal information from children.
          </p>

          <h2>International users</h2>
          <p>
            Zenith serves U.S. healthcare providers. The Site is hosted in
            the United States. If you access the Site from outside the
            U.S., you understand that your information will be transferred
            to and processed in the U.S.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be indicated by updating the &ldquo;Last
            updated&rdquo; date and, where appropriate, posting a notice
            on the Site.
          </p>

          <h2>Contact</h2>
          <p>
            Zenith Care Solutions LLC &middot; Wyoming, USA
            <br />
            Email:{" "}
            <Link
              href={`mailto:${PRIVACY_EMAIL}`}
              className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
            >
              {PRIVACY_EMAIL}
            </Link>
          </p>
      </LegalPage>
    </>
  );
}
