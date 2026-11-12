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
import { BrandFigure } from "@/components/brand-figure";
import { BulletedListItem } from "@/components/bulleted-list";
import { HeroPanel } from "@/components/hero-panel";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { FaqSection, type FaqEntry } from "@/components/faq-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { specialties, specialtyLabel, type Specialty } from "@/lib/site";
import { getService, categoryMeta } from "@/lib/services";
import { CPT_RATES, formatUsd } from "@/lib/roi";
import specialtiesFile from "@/content/specialties.json";

type Params = { specialty: string };

// Fully static, SEO-prerendered page: the whole page depends on `params`, so
// there is no partial shell to stream. Under cacheComponents this declares the
// route blocking instead of requiring a Suspense boundary around the page.
export const instant = false;

export function generateStaticParams(): Params[] {
  return specialties.map((specialty) => ({ specialty }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { specialty } = await params;
  if (!isSpecialty(specialty))
    return pageMetadata({ title: "Not found", description: "", noindex: true });

  const content = CONTENT[specialty];
  return pageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/who-we-serve/${specialty}`,
  });
}

export default async function WhoWeServePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { specialty } = await params;
  if (!isSpecialty(specialty)) notFound();

  const label = specialtyLabel[specialty];
  const path = `/who-we-serve/${specialty}`;
  const c = CONTENT[specialty];
  const enrolledPatients = Math.round(c.example.panel * c.example.enrollmentRate);
  const monthlyRevenue = enrolledPatients * CPT_RATES["99490"];
  const programs = specialtyPrograms[specialty].map(resolveProgram);

  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path,
            name: label,
            description: c.metaDescription,
            about: serviceId(path),
          }),
          serviceLd({
            name: `Remote care management and virtual staffing for ${label.toLowerCase()} practices`,
            description: c.metaDescription,
            path,
            serviceType: "Chronic Care Management",
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Who We Serve", path: "/who-we-serve" },
            { name: label, path },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Who We Serve", path: "/who-we-serve" },
          { name: label, path },
        ]}
      />

      {/* ─── Hero (shared premium aurora hero, consistent with home/services) ─ */}
      <PageHero
        visual={
          <HeroPanel
            heading={`Programs for ${label.toLowerCase()} practices`}
            items={programs.map((p) => ({ label: p.title, href: p.href }))}
          />
        }
        title={c.heroHeadline}
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "Estimate your ROI", href: "/roi-calculator" }}
      >
        {c.heroLead}
      </PageHero>

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />

      {/* ─── Specialty image band (art-directed cyan duotone) ────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal>
            <BrandFigure
              src={`/specialties/${specialty}.webp`}
              alt={`Care setting typical of ${label.toLowerCase()} practices`}
              className="aspect-[16/7]"
              sizes="(min-width: 768px) 960px, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ─── Programs this practice can offer (full service line) ─────── */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Programs your {label.toLowerCase()} practice can offer
            </h2>
            <span
              aria-hidden="true"
              className="mt-4 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
            />
            <p className="mt-6 text-base leading-relaxed text-body-ink">
              The services a {label.toLowerCase()} practice is typically eligible
              to offer. CCM is usually the single biggest revenue lever; the rest
              compound it. Eligibility is confirmed per patient and per payer at
              the time of service.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p.href} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  href={p.href}
                  className="spotlight group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[var(--shadow-lift)]"
                >
                  <h3 className="mt-2 font-serif text-lg font-semibold text-brand-ink group-hover:text-brand-accent">
                    {p.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
                    {p.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
                    {p.cta}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why CCM is the flagship lever for this specialty ────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <Reveal>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                {c.whyHeadline}
              </h2>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
              />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-body-ink">
                {c.whyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {specialty === "primary-care" ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Zenith handles{" "}
                  <Link
                    href="/services/medical-billing"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    medical billing
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/services/virtual-staffing"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    virtual staffing
                  </Link>{" "}
                  for primary care practices alongside care management programs.
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="font-serif text-xl font-semibold text-brand-ink">
                Conditions you&rsquo;ll already be seeing
              </h3>
              <span
                aria-hidden="true"
                className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
              />
              <ul className="mt-5 space-y-3 text-base text-body-ink">
                {c.patientMix.map((cond) => (
                  <BulletedListItem key={cond}>{cond}</BulletedListItem>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Representative revenue ──────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] px-8 py-14 text-brand-ink md:px-14 md:py-20 dark:border-white/10 dark:bg-[color:var(--color-brand-800)] dark:text-[color:var(--color-surface-0)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-teal-500)]/18 blur-3xl"
            />
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
            <div>
              <span className="text-xs font-medium tracking-[0.14em] text-brand-accent">
                Representative panel
              </span>
              <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                {formatUsd(monthlyRevenue)}
              </p>
              <p className="mt-3 text-base text-body-ink dark:text-[color:var(--color-surface-0)]/80">
                per month, for the panel below.
              </p>
              <p className="mt-6 text-sm text-muted-foreground">
                {c.example.panel}-patient {label.toLowerCase()} panel with
                roughly {Math.round(c.example.enrollmentRate * 100)}% of
                eligible patients enrolled, at the{" "}
                CPT 99490 base rate. Complex-CCM add-ons (99439 / 99487 /
                99489) lift the figure
                for patients with higher clinical complexity.
                {c.example.note ? ` ${c.example.note}` : ""}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="max-w-sm text-sm text-muted-foreground dark:text-[color:var(--color-surface-0)]/70">
                Plug in your real numbers to see the figure for your panel,
                the calculator runs entirely in your browser.
              </p>
              <Button
                asChild
                size="lg"
                className="h-11 px-6 text-sm"
              >
                <Link href="/roi-calculator">Estimate your panel size</Link>
              </Button>
            </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ (specialty-specific; emits FAQPage JSON-LD) ─────────── */}
      <FaqSection
        heading={`Zenith for ${label.toLowerCase()} practices: common questions`}
        idPrefix={`${specialty}-faq`}
        tone="surface"
        items={c.faqs}
      />

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-background">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Fifteen minutes to see the fit.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
            We&rsquo;ll confirm how many of your {label.toLowerCase()}{" "}
            patients qualify, map the programs that fit your practice, and tell
            you honestly whether Zenith is a fit.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6 text-sm">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-6 text-sm"
            >
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

function isSpecialty(value: string): value is Specialty {
  return (specialties as readonly string[]).includes(value);
}

/**
 * Which programs each specialty is typically eligible to offer. A `slug` points
 * at a specific care-management service; a `category` points at a whole
 * category (RCM / staffing) that applies to any practice. Derived strictly from
 * the Who-We-Serve eligibility doc: geriatrics inherits RPM + TCM as a
 * primary-care discipline, and omits PCM (single-condition) and RTM (ortho/PT).
 */
type ProgramRef = { slug: string } | { category: "rcm" | "staffing" };

const CARE_MGMT_PROGRAMS: ProgramRef[] = [
  { slug: "chronic-care-management" },
  { slug: "principal-care-management" },
  { slug: "remote-patient-monitoring" },
  { slug: "transitional-care-management" },
];

const specialtyPrograms: Record<Specialty, ProgramRef[]> = {
  "primary-care": [...CARE_MGMT_PROGRAMS, { category: "rcm" }, { category: "staffing" }],
  "internal-medicine": [...CARE_MGMT_PROGRAMS, { category: "rcm" }, { category: "staffing" }],
  geriatrics: [
    { slug: "chronic-care-management" },
    { slug: "remote-patient-monitoring" },
    { slug: "transitional-care-management" },
    { category: "rcm" },
    { category: "staffing" },
  ],
};

// Fail the build if a mapping points at a slug that no longer exists.
for (const refs of Object.values(specialtyPrograms)) {
  for (const ref of refs) {
    if ("slug" in ref && !getService(ref.slug)) {
      throw new Error(`specialtyPrograms: unknown service slug "${ref.slug}"`);
    }
  }
}

type ProgramCard = {
  title: string;
  body: string;
  href: string;
  cta: string;
};

function resolveProgram(ref: ProgramRef): ProgramCard {
  if ("slug" in ref) {
    const s = getService(ref.slug)!; // validated at module load
    return {
      title: s.name,
      body: s.shortDesc,
      href: `/services/${s.slug}#who-we-serve`,
      cta: "See who qualifies",
    };
  }
  const m = categoryMeta[ref.category];
  return {
    title: m.label,
    body: m.blurb,
    href: m.href,
    cta: "Explore",
  };
}

type SpecialtyContent = {
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroLead: string;
  whyHeadline: string;
  whyParagraphs: string[];
  patientMix: string[];
  example: {
    panel: number;
    enrollmentRate: number;
    note?: string;
  };
  faqs: FaqEntry[];
};

const CONTENT: Record<Specialty, SpecialtyContent> = {
  "primary-care": {
    metaTitle: "Services for Primary Care",
    metaDescription:
      "CCM, RPM, TCM, billing and virtual staffing for U.S. primary care practices. Zenith supplies the staff; your practice stays the billing provider.",
    ...specialtiesFile["primary-care"],
    example: { panel: 1500, enrollmentRate: 0.3 },
  },

  "internal-medicine": {
    metaTitle: "Services for Internal Medicine",
    metaDescription:
      "CCM, RPM, TCM, billing and virtual staffing for U.S. internal medicine practices. Built for polychronic panels; your practice stays the billing provider.",
    ...specialtiesFile["internal-medicine"],
    example: { panel: 650, enrollmentRate: 0.5 },
  },

  geriatrics: {
    metaTitle: "Services for Geriatric Practices",
    metaDescription:
      "CCM, RPM, TCM, billing and virtual staffing for U.S. geriatric practices, where many Medicare patients have multiple chronic conditions.",
    ...specialtiesFile["geriatrics"],
    example: { panel: 500, enrollmentRate: 0.7, note: "Geriatric panels often have many Complex CCM patients. Actual reimbursement often runs 30-50% higher than the base-code figure shown." },
  },
};
