import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";
import { Button } from "@/components/ui/button";
import { mailtoHref, site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Zenith Care Solutions",
  description:
    "Reach us by WhatsApp, email, our contact form, or book a 15-minute call. Do not submit patient information through this site.",
  path: "/contact",
});

export default function ContactPage() {
  // Only render channels that have a real endpoint configured.
  // Prevents dead "#" links or 404s on the production domain before
  // the WhatsApp number / Calendly event are set up.
  const hasWhatsApp = Boolean(site.whatsappNumber);
  const hasCalendly = Boolean(site.calendlyUrl);

  return (
    <PageStub eyebrow="Contact" title="Three ways to reach us">
      <p>
        Pick whichever is easiest. Please do not include patient-identifying
        information in any of these channels.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {hasWhatsApp ? (
          <Button asChild size="lg">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>
          </Button>
        ) : null}
        <Button asChild size="lg" variant={hasWhatsApp ? "outline" : "default"}>
          <a href={mailtoHref()}>Email {site.email}</a>
        </Button>
        {hasCalendly ? (
          <Button asChild size="lg" variant="outline">
            <a
              href={site.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 15-min call
            </a>
          </Button>
        ) : null}
      </div>
      <p className="pt-6 text-sm text-muted-foreground">
        Fallback contact form + inline Calendly embed land in Phase 2.
      </p>
    </PageStub>
  );
}
