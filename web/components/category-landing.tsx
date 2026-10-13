import Link from "next/link";
import { JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { FaqSection } from "@/components/faq-section";
import { ServiceGrid } from "@/components/service-grid";
import { servicesByCategory, categoryMeta, type ServiceCategory } from "@/lib/services";
import { categoryContent } from "@/lib/categories";

/**
 * Category landing page (hub) shared by /care-management,
 * /revenue-cycle-management, and /virtual-staffing. Lists the category's
 * services from the registry and links down to each /services/<slug> page.
 */
export function CategoryLanding({ category }: { category: ServiceCategory }) {
  const c = categoryContent[category];
  const services = servicesByCategory(category);
  const label = categoryMeta[category].label;

  return (
    <>
      <JsonLd
        data={[
          serviceLd({
            name: label,
            description: c.metaDescription,
            path: c.path,
            serviceType: c.serviceType,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: label, path: c.path },
          ]),
        ]}
      />

      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "All services", href: "/services" }}
      >
        {c.lead}
      </PageHero>

      <TrustStrip tone="surface" />

      {/* ─── What it is ──────────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-body-ink">
              {c.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Services in this category ───────────────────────────────── */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              {label} services
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-ink">
              Explore each program. Every service page details what Zenith
              handles, how it works, who it is for, and who can be billed.
            </p>
          </Reveal>
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* ─── FAQ (emits FAQPage JSON-LD) ─────────────────────────────── */}
      <FaqSection
        heading={`${label}: common questions`}
        idPrefix={`${category}-category-faq`}
        items={c.faqs}
      />

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-background">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Not sure which program fits your practice?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              Book a 15-minute call and we&rsquo;ll map the right programs to
              your patients and workflows, and tell you honestly whether Zenith
              is a fit.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-sm">
                <Link href="/roi-calculator">Estimate your ROI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
