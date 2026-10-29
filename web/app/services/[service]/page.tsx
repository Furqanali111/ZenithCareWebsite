import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  pageMetadata,
  JsonLd,
  serviceLd,
  serviceId,
  breadcrumbLd,
  webPageLd,
} from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { HeroPanel } from "@/components/hero-panel";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { FeatureGrid } from "@/components/feature-grid";
import { HowItWorks } from "@/components/how-it-works";
import { FaqSection } from "@/components/faq-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  getService,
  getServiceSlugs,
  servicesByCategory,
  categoryMeta,
  type Service,
  SERVICE_TAGS,
} from "@/lib/services";
import { getAllPosts } from "@/content/posts";
import { getCpt, cptPath, CPT_BASE } from "@/lib/cpt-codes";
import { DENIAL_BASE } from "@/lib/denial-codes";

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
          webPageLd({
            path,
            name: s.name,
            description: s.metaDescription,
            about: serviceId(path),
          }),
          serviceLd({
            name: s.name,
            description: s.metaDescription,
            path,
            serviceType: s.serviceType,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: cat.label, path: cat.href },
            { name: s.name, path },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: cat.label, path: cat.href },
          { name: s.name, path },
        ]}
      />

      <PageHero
        visual={
          <HeroPanel
            heading={s.capabilitiesHeading}
            items={s.capabilities.slice(0, 4).map((c) => ({ label: c.title }))}
          />
        }
        title={s.title}
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "All services", href: "/services" }}
      >
        {s.lead}
      </PageHero>

      <TrustStrip tone="surface" items={s.trust} />

      {/*
       * SECTION RHYTHM — keep this alternating or both light/dark modes look flat.
       * Every section must differ from its neighbour. Conditional sections keep
       * their fixed bg regardless of what renders around them; the border-t
       * provides separation even when two defaults are adjacent.
       *
       *  TrustStrip      → tint  (component-managed via tone="surface")
       *  Capabilities    → default
       *  How it works    → tint
       *  Who we serve    → default
       *  Revenue band    → tint   (conditional)
       *  ServiceResources→ default (conditional)
       *  CrossLinkNote   → default (minor border-t element, always fine)
       *  FAQ             → tint  (component-managed via tone="surface")
       *  Related services→ default
       *  Final CTA       → tint
       */}

      {/* ─── Capability cards ────────────────────────────────────────── */}
      <section className="section-rhythm">
        <FeatureGrid
          heading={s.capabilitiesHeading}
          subtitle={s.capabilitiesSubtitle}
          items={s.capabilities}
        />
      </section>

      {/* ─── How it works (3-step flow) ──────────────────────────────── */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <HowItWorks steps={s.howItWorks} />
      </section>

      {/* ─── Who we serve: eligibility & billing (every service) ──────── */}
      <section
        id="who-we-serve"
        className="scroll-mt-24 border-t border-border/60"
      >
        <div className="section-rhythm">
          <div className="mx-auto max-w-[90rem] px-6">
            <Reveal className="max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                Who we serve
              </h2>
              <p className="mt-4 text-base leading-relaxed text-body-ink">
                Eligibility is confirmed per patient and per payer at the time of
                service. The guidance below shows who this service is built for.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <h3 className="font-serif text-lg font-semibold text-brand-ink">
                  Eligible practices
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
                />
                <p className="mt-5 text-base leading-relaxed text-body-ink">
                  {s.eligiblePractices}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h3 className="font-serif text-lg font-semibold text-brand-ink">
                  Patients who can be billed
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
                />
                <p className="mt-5 text-base leading-relaxed text-body-ink">
                  {s.billablePatients}
                </p>
              </Reveal>
            </div>

            {s.slug === "chronic-care-management" ? (
              <Reveal delay={0.12} className="mt-10">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Serving{" "}
                  <Link
                    href="/who-we-serve/primary-care"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    primary care
                  </Link>
                  ,{" "}
                  <Link
                    href="/who-we-serve/internal-medicine"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    internal medicine
                  </Link>
                  , and{" "}
                  <Link
                    href="/who-we-serve/geriatrics"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    geriatric
                  </Link>{" "}
                  practices.
                </p>
              </Reveal>
            ) : null}

            {s.billing ? (
              <Reveal delay={0.15} className="mt-14">
                <h3 className="font-serif text-lg font-semibold text-brand-ink">
                  What&rsquo;s billed
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
                />
                <BillingTable service={s} />
                {s.billingNote ? (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {s.billingNote}
                  </p>
                ) : null}
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* ─── Revenue band (care-management programs only) ─────────────── */}
      {s.revenue ? (
        <section className="section-rhythm border-t border-border/60 bg-surface-tint">
          <div className="mx-auto max-w-[90rem] px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] px-8 py-14 text-brand-ink md:px-14 md:py-16 dark:border-white/10 dark:bg-[color:var(--color-brand-800)] dark:text-[color:var(--color-surface-0)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-teal-500)]/18 blur-3xl"
                />
                <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
                  <div>
                    <span className="text-xs font-medium tracking-[0.14em] text-brand-accent">
                      Representative revenue
                    </span>
                    <p className="mt-5 font-serif text-5xl font-semibold leading-none tracking-tight md:text-6xl">
                      {s.revenue.value}
                    </p>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-body-ink dark:text-[color:var(--color-surface-0)]/75">
                      {s.revenue.note}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground dark:text-[color:var(--color-surface-0)]/70">
                      Plug in your real numbers to see the figure for your panel,
                      the calculator runs entirely in your browser.
                    </p>
                    <Button asChild size="lg" className="h-11 px-6 text-sm">
                      <Link href="/roi-calculator">
                        Estimate your panel size
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

      {/* ─── Related resources (blog links for service-to-content SEO) ── */}
      <ServiceResources slug={s.slug} name={s.name} />

      {/* ─── Cross-category link note ────────────────────────────────── */}
      <CrossLinkNote slug={s.slug} />

      {/* ─── FAQ (emits FAQPage JSON-LD) ─────────────────────────────── */}
      <FaqSection
        heading={`${s.name}: common questions`}
        idPrefix={`${s.slug}-faq`}
        items={s.faqs}
        tone="surface"
      />

      {/* ─── Related services (same category, excluding current) ─────── */}
      <RelatedServices current={s} />

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
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
                <Link href={cat.href}>Explore all {cat.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** Tag-driven resource links; renders nothing when no matching posts exist. */
function ServiceResources({ slug, name }: { slug: string; name: string }) {
  const tags = SERVICE_TAGS[slug];
  if (!tags) return null;
  // shortcut: caps at 8; raise when a service has a large content library
  const posts = getAllPosts()
    .filter((p) => tags.some((t) => p.tags.includes(t)))
    .slice(0, 8);
  if (posts.length === 0) return null;
  return (
    <section className="section-rhythm border-t border-border/60">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
            {name} resources
          </h2>
        </Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/resources/${p.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-border/70 bg-card p-5 transition-[transform,box-shadow,border-color,background-color] hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
              >
                <ArrowRight
                  className="mt-0.5 size-4 shrink-0 text-brand-accent transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium leading-snug text-brand-ink group-hover:text-brand-accent">
                  {p.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Silo link down: "99487 / 99489" -> each code links to its page if one exists. */
function CodeLinks({ codes }: { codes: string }) {
  return codes.split(" / ").map((code, i) => (
    <span key={code}>
      {i > 0 ? " / " : null}
      {getCpt(code) ? (
        <Link href={cptPath(code)} className="underline-offset-2 hover:underline">
          {code}
        </Link>
      ) : (
        code
      )}
    </span>
  ));
}

function BillingTable({ service }: { service: Service }) {
  if (!service.billing) return null;
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          CPT codes and representative 2026 Medicare rates for {service.name}.
        </caption>
        <thead className="bg-card text-xs text-muted-foreground">
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
                <CodeLinks codes={b.code} />
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

// SILO: every contextual cross-link stays inside the service's own category
// (care management, revenue cycle, virtual staffing). Cross-silo paths are the
// global nav, footer, contact CTA and the who-we-serve pages only.
type CrossLink = {
  before: string;
  href: string;
  label: string;
  /** Optional second in-silo link rendered as "See also". */
  extra?: { href: string; label: string };
};

const DENIAL_LINK = { href: DENIAL_BASE, label: "common claim denial codes" };

const CROSS_LINKS: Record<string, CrossLink> = {
  "chronic-care-management": {
    before: "Patients with only one serious condition are often a better fit for",
    href: "/services/principal-care-management",
    label: "Principal Care Management",
    extra: { href: CPT_BASE, label: "CPT code guide for care management" },
  },
  "principal-care-management": {
    before: "Patients with two or more chronic conditions fit",
    href: "/services/chronic-care-management",
    label: "Chronic Care Management",
  },
  "remote-patient-monitoring": {
    before: "Home readings are most useful alongside monthly coordination from",
    href: "/services/chronic-care-management",
    label: "Chronic Care Management",
  },
  "remote-therapeutic-monitoring": {
    before: "RTM shares the same monthly care-coordination model as",
    href: "/services/chronic-care-management",
    label: "Chronic Care Management",
  },
  "transitional-care-management": {
    before: "After the 30-day TCM period, many patients move into ongoing",
    href: "/services/chronic-care-management",
    label: "Chronic Care Management",
  },
  "medical-billing": {
    before: "Billing works hand in hand with",
    href: "/services/accounts-receivable",
    label: "AR follow-up on aged claims",
    extra: DENIAL_LINK,
  },
  "medical-coding": {
    before: "Clean codes lead to cleaner claims, which Zenith also handles through",
    href: "/services/medical-billing",
    label: "medical billing",
  },
  "provider-credentialing": {
    before: "Once providers are enrolled, their claims flow through",
    href: "/services/medical-billing",
    label: "medical billing",
  },
  "accounts-receivable": {
    before: "Preventing denials at the source is the job of",
    href: "/services/medical-billing",
    label: "medical billing",
    extra: DENIAL_LINK,
  },
  "medical-scribe": {
    before: "Scribed notes feed the follow-up work done by a",
    href: "/services/patient-care-coordinator",
    label: "patient care coordinator",
  },
  "medical-scheduler": {
    before: "Booking and call handling work together with a",
    href: "/services/medical-receptionist",
    label: "medical receptionist",
  },
  "medical-receptionist": {
    before: "Heavy booking workloads are better served by our",
    href: "/services/medical-scheduler",
    label: "Medical Scheduler",
  },
  "patient-care-coordinator": {
    before: "Pre-visit prep pairs with calendar management from our",
    href: "/services/medical-scheduler",
    label: "Medical Scheduler",
  },
  "virtual-assistant": {
    before: "Patient-facing workflows like referrals and authorizations belong to our",
    href: "/services/patient-care-coordinator",
    label: "Patient Care Coordinator",
  },
};

function CrossLinkNote({ slug }: { slug: string }) {
  const cl = CROSS_LINKS[slug];
  if (!cl) return null;
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-[90rem] px-6 py-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {cl.before}{" "}
          <Link href={cl.href} className="font-medium text-brand-accent hover:underline">
            {cl.label}
          </Link>
          .
          {cl.extra ? (
            <>
              {" "}See also:{" "}
              <Link href={cl.extra.href} className="font-medium text-brand-accent hover:underline">
                {cl.extra.label}
              </Link>
              .
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}

/**
 * Shows up to 4 sibling services from the same category, helping Googlebot
 * discover related pages and users explore adjacent services.
 */
function RelatedServices({ current }: { current: Service }) {
  const siblings = servicesByCategory(current.category).filter(
    (s) => s.slug !== current.slug,
  );
  if (siblings.length === 0) return null;
  const show = siblings.slice(0, 4);
  const cat = categoryMeta[current.category];

  return (
    <section className="section-rhythm border-t border-border/60">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
            Related {cat.label.toLowerCase()} services
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {show.map((sib) => (
            <Reveal key={sib.slug} className="h-full">
              <Link
                href={`/services/${sib.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-5 transition-[transform,box-shadow,border-color,background-color] hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
              >
                <h3 className="font-serif text-base font-semibold text-brand-ink group-hover:text-brand-accent">
                  {sib.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body-ink line-clamp-3">
                  {sib.metaDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-accent">
                  Learn more
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
