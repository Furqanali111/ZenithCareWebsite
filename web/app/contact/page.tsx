import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { CalendlyEmbed } from "@/components/calendly-embed";
import { mailtoHref, site, whatsappHref } from "@/lib/site";

const PATH = "/contact";

export const metadata: Metadata = pageMetadata({
  title: "Book a Call or Contact Us",
  description:
    "Reach us by WhatsApp, email, our contact form, or book a 15-minute call. Do not submit patient information through this site.",
  path: PATH,
});

export default function ContactPage() {
  const hasWhatsApp = Boolean(site.whatsappNumber);
  const hasCalendly = Boolean(site.calendlyUrl);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: PATH },
        ])}
      />

      {/* ─── Hero + three-door CTAs ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-14 md:pt-32 md:pb-16">
        <div className="max-w-3xl">
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium tracking-[0.14em] text-brand-accent">
            Contact
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
            Book a call or contact us. Pick whichever is easiest.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-body-ink md:text-lg">
            WhatsApp, email, a fifteen-minute call on Calendly, or the form
            below, all land with Furqan directly. Please don&rsquo;t include
            patient-identifying information in any channel; patient data
            belongs in your EHR under a signed BAA.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Most discovery calls cover eligible panel size, EHR compatibility,
            and a ballpark timeline to first billing. No commitment, no pitch
            deck, just the numbers for your practice.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {hasWhatsApp ? (
              <Button asChild size="lg">
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
              </Button>
            ) : null}
            <Button
              asChild
              size="lg"
              variant={hasWhatsApp ? "outline" : "default"}
            >
              <a href={mailtoHref()}>Email {site.email}</a>
            </Button>
            {hasCalendly ? (
              <Button asChild size="lg" variant="outline">
                <a href="#calendly">Book a 15-min call</a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ─── Business details: what a customer or payment provider checks ── */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Business details
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-6 text-base text-body-ink sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-brand-ink">Company</dt>
              <dd>{site.legalName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-ink">Mailing address</dt>
              <dd>{site.mailingAddress}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-ink">Email</dt>
              <dd>
                <a className="text-brand-accent underline underline-offset-2" href={mailtoHref()}>
                  {site.email}
                </a>
              </dd>
            </div>
            {site.phone ? (
              <div>
                <dt className="font-semibold text-brand-ink">Phone</dt>
                <dd>
                  <a
                    className="text-brand-accent underline underline-offset-2"
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-semibold text-brand-ink">Support hours</dt>
              <dd>{site.hours}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-ink">Response time</dt>
              <dd>Within one business day</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ─── Form ────────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <header>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Or send us a note
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Tell us about your panel.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-ink">
              Six quick fields. We reply within one business day.
            </p>
          </header>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ─── Inline Calendly embed ───────────────────────────────────── */}
      {hasCalendly ? (
        <section id="calendly" className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <header className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Or book directly
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Fifteen minutes on the calendar.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-ink">
              Pick any slot that works. We confirm by email right after you
              book, no back-and-forth.
            </p>
          </header>
          <div className="mt-10">
            <CalendlyEmbed />
          </div>
        </section>
      ) : null}
    </>
  );
}
