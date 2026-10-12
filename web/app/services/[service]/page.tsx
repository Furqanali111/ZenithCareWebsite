import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { FeatureGrid } from "@/components/feature-grid";
import { HowItWorks } from "@/components/how-it-works";
import { FaqSection } from "@/components/faq-section";
import {
  getService,
  getServiceSlugs,
  categoryMeta,
  type Service,
} from "@/lib/services";

type Params = { service: string };

// Fully static, SEO-prerendered page: the whole page depends on `params`, so
// there is no partial shell to stream. Under cacheComponents this declares the
// route blocking instead of requiring a Suspense boundary around the page.
export const instant = false;

export function generateStaticParams(): Params[] {
  return getServiceSlugs().map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service } = await params;
  const s = getService(service);
  if (!s) return pageMetadata({ title: "Not found", description: "", noindex: true });
  return pageMetadata({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service } = await params;
  const s = getService(service);
  if (!s) notFound();

  const cat = categoryMeta[s.category];
  const path = `/services/${s.slug}`;

  return (
    <>
      <JsonLd
        data={[
          serviceLd({
            name: s.name,
            description: s.metaDescription,
            path,
            serviceType: s.serviceType,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.name, path },
          ]),
        ]}
      />

      <PageHero
        eyebrow={cat.label}
        title={s.title}
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "All services", href: "/services" }}
      >
        {s.lead}
      </PageHero>

      <TrustStrip tone="surface" />

      {/* ─── Capability cards ────────────────────────────────────────── */}
      <section className="section-rhythm">
        <FeatureGrid
          heading={s.capabilitiesHeading}
          subtitle={s.capabilitiesSubtitle}
          items={s.capabilities}
        />
      </section>

      {/* ─── How it works (3-step flow) ──────────────────────────────── */}
      <section className="section-rhythm border-t border-border/60">
        <HowItWorks steps={s.howItWorks} />
      </section>

      {/* ─── Who qualifies + billing (care-management programs only) ──── */}
      {s.qualifies || s.billing ? (
        <section className="border-t border-border/60 bg-surface-tint">
          <div className="section-rhythm">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:gap-14">
              {s.qualifies ? (
                <Reveal>
                  <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                    Who qualifies
                  </h2>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
                  />
                  <ul className="mt-6 space-y-3 text-base leading-relaxed text-body-ink">
                    {s.qualifies.map((q) => (
                      <BulletedListItem key={q}>{q}</BulletedListItem>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {s.billing ? (
                <Reveal delay={0.1}>
                  <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                    What&rsquo;s billed
                  </h2>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
                  />
                  <BillingTable service={s} />
                  {s.billingNote ? (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {s.billingNote}
                    </p>
                  ) : null}
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Revenue band (care-management programs only) ─────────────── */}
      {s.revenue ? (
        <section className="section-rhythm">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-brand-900)] px-8 py-14 text-[color:var(--color-surface-0)] md:px-14 md:py-16">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-teal-500)]/18 blur-3xl"
                />
                <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-accent-600)]">
                      Representative revenue
                    </span>
                    <p className="mt-5 font-serif text-5xl font-semibold leading-none tracking-tight md:text-6xl">
                      {s.revenue.value}
                    </p>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--color-surface-0)]/75">
                      {s.revenue.note}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 md:items-end">
                    <p className="max-w-sm text-sm leading-relaxed text-[color:var(--color-surface-0)]/70 md:text-right">
                      Plug in your real numbers to see the figure for your panel —
                      the calculator runs entirely in your browser.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="h-11 px-6 text-sm">
                      <Link href="/roi-calculator">
                        Estimate your panel
                        <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ─── FAQ (emits FAQPage JSON-LD) ─────────────────────────────── */}
      <FaqSection
        heading={`${s.name}: common questions`}
        idPrefix={`${s.slug}-faq`}
        items={s.faqs}
      />

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-background">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Fifteen minutes to see if it fits.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              We&rsquo;ll walk through how {s.name} works for your practice,
              confirm the fit, and tell you honestly whether Zenith is the
              right partner.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-sm">
                <Link href="/services">Explore all services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function BillingTable({ service }: { service: Service }) {
  if (!service.billing) return null;
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          CPT codes and representative 2026 Medicare rates for {service.name}.
        </caption>
        <thead className="bg-card text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              CPT
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              What it covers
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              ~Rate
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70 bg-card text-ink-strong">
          {service.billing.map((b) => (
            <tr key={b.code}>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-medium text-brand-accent">
                {b.code}
              </td>
              <td className="px-4 py-3 leading-snug">{b.covers}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm">
                {b.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
