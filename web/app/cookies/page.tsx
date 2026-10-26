import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { site } from "@/lib/site";

const PATH = "/cookies";
const UPDATED = "2026-10-26";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "Which cookies Zenith Care Solutions uses on this website, why, and how to accept, reject or change your choice.",
  path: PATH,
  rootOgImage: true,
});

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Cookie Policy", path: PATH },
        ])}
      />
      <LegalPage title="Cookie Policy" effectiveDate={UPDATED} lastUpdated={UPDATED}>
        <p>
          This policy explains how {site.legalName} uses cookies and similar
          storage on {site.url}. See our <Link href="/privacy">Privacy Policy</Link>{" "}
          for how we handle personal information more broadly.
        </p>

        <h2>Your choice</h2>
        <p>
          On your first visit we ask whether to allow optional cookies.
          Rejecting is as easy as accepting, and the site works the same
          either way. Nothing optional loads until you accept. You can change
          your mind at any time:{" "}
          <CookieSettingsButton className="text-brand-accent underline underline-offset-2 hover:text-brand-ink" />.
        </p>

        <h2>What we use</h2>
        <ul>
          <li>
            <strong>Essential (always on):</strong> your cookie choice and
            your light or dark theme setting, stored in your browser&rsquo;s
            local storage. They never leave your device and are not used for
            tracking.
          </li>
          <li>
            <strong>Analytics (only if you accept):</strong> Google Analytics 4
            sets first-party cookies such as <code>_ga</code> and{" "}
            <code>_ga_*</code> (up to 2 years) to count visits and see which
            pages and contact options are used. We turn on IP anonymization.
            We do not use advertising or retargeting cookies.
          </li>
          <li>
            <strong>Booking calendar (only if you accept):</strong> Calendly
            may set its own cookies when its scheduling widget loads. If you
            reject, you can still open the calendar on calendly.com in a new
            tab, where Calendly&rsquo;s own policy applies.
          </li>
        </ul>

        <h2>Other ways to control cookies</h2>
        <p>
          You can also block or delete cookies in your browser settings, or
          install Google&rsquo;s Analytics opt-out browser add-on. Blocking
          essential storage may reset your theme setting.
        </p>

        <h2>Contact</h2>
        <p>
          Questions: <Link href={`mailto:${site.email}`}>{site.email}</Link>.
        </p>
      </LegalPage>
    </>
  );
}
