import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BrandFigure } from "@/components/brand-figure";
import { BulletedListItem } from "@/components/bulleted-list";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { FaqSection, type FaqEntry } from "@/components/faq-section";
import { specialties, specialtyLabel, type Specialty } from "@/lib/site";
import { getService, categoryMeta } from "@/lib/services";
import { CPT_RATES, formatUsd } from "@/lib/roi";

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
          serviceLd({
            name: `Remote care management and virtual staffing for ${label.toLowerCase()} practices`,
            description: c.metaDescription,
            path,
            serviceType: "Chronic Care Management",
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Who We Serve", path },
            { name: label, path },
          ]),
        ]}
      />

      {/* ─── Hero (shared premium aurora hero, consistent with home/services) ─ */}
      <PageHero
        eyebrow={`Who we serve · ${label}`}
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
        <div className="mx-auto max-w-7xl px-6">
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
        <div className="mx-auto max-w-7xl px-6">
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
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                    {p.eyebrow}
                  </span>
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
        <div className="mx-auto max-w-7xl px-6">
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
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] px-8 py-14 text-brand-ink md:px-14 md:py-20 dark:border-white/10 dark:bg-[color:var(--color-brand-800)] dark:text-[color:var(--color-surface-0)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-teal-500)]/18 blur-3xl"
            />
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-accent">
                Representative panel
              </span>
              <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                {formatUsd(monthlyRevenue)}
              </p>
              <p className="mt-3 text-base text-body-ink dark:text-[color:var(--color-surface-0)]/80">
                per month, for the panel below.
              </p>
              <p className="mt-6 text-sm text-muted-foreground dark:text-[color:var(--color-accent-600)]">
                {c.example.panel}-patient {label.toLowerCase()} panel with
                roughly {Math.round(c.example.enrollmentRate * 100)}% of
                eligible patients enrolled, at the{" "}
                <span className="font-mono">CPT 99490</span> base rate.
                Complex-CCM add-ons (
                <span className="font-mono">99439</span> /{" "}
                <span className="font-mono">99487</span> /{" "}
                <span className="font-mono">99489</span>) lift the figure
                for patients with higher clinical complexity.
                {c.example.note ? ` ${c.example.note}` : ""}
              </p>
            </div>

            <div className="flex flex-col gap-4 md:items-end">
              <p className="max-w-sm text-sm text-muted-foreground md:text-right dark:text-[color:var(--color-surface-0)]/70">
                Plug in your real numbers to see the figure for your panel,
                the calculator runs entirely in your browser.
              </p>
              <Button
                asChild
                size="lg"
                className="h-11 bg-[color:var(--color-gold-500)] px-6 text-sm text-[color:var(--color-brand-900)] hover:brightness-105"
              >
                <Link href="/roi-calculator">Estimate your panel</Link>
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
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

function resolveProgram(ref: ProgramRef): ProgramCard {
  if ("slug" in ref) {
    const s = getService(ref.slug)!; // validated at module load
    return {
      eyebrow: "Care Management",
      title: s.name,
      body: s.shortDesc,
      href: `/services/${s.slug}#who-we-serve`,
      cta: "See who qualifies",
    };
  }
  const m = categoryMeta[ref.category];
  return {
    eyebrow: "For any practice",
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
    metaTitle:
      "Remote Care Management, Monitoring & Staffing for Primary Care Practices",
    metaDescription:
      "Remote care management (CCM, PCM, RPM, TCM), revenue-cycle support, and virtual staffing for U.S. primary care practices. HIPAA Business Associate. The broadest program fit in medicine.",
    heroHeadline:
      "Primary care practices have the broadest fit across Zenith's programs.",
    heroLead:
      "From Chronic Care Management to remote monitoring, transitional care, revenue-cycle support, and virtual staffing, a primary care practice is eligible for more of Zenith's service line than almost any other specialty. CCM is usually the biggest single revenue lever; the rest compound it.",
    whyHeadline: "Why CCM pays for itself in a primary care practice.",
    whyParagraphs: [
      "The eligibility bar, two or more chronic conditions expected to last twelve months, is cleared by a large fraction of any established primary-care panel. We routinely see 25-40% of a panel qualify once we actually run the list against the diagnoses.",
      "Zenith’s clinical team does the monthly outreach, documentation, and time tracking inside your EHR so your MAs and front-desk team stay focused on visits. Your practice bills the CPT codes; we invoice for the clinical work.",
    ],
    patientMix: [
      "Hypertension",
      "Type 2 diabetes",
      "Hyperlipidemia",
      "COPD and chronic asthma",
      "Depression and anxiety",
      "Obesity-related comorbidities",
      "Osteoarthritis",
      "Early chronic kidney disease",
    ],
    example: {
      panel: 1500,
      enrollmentRate: 0.3,
    },
    faqs: [
      {
        question: "Which Zenith programs can a primary care practice run?",
        answer:
          "Primary care practices are typically eligible for Chronic Care Management, Principal Care Management, Remote Patient Monitoring, and Transitional Care Management, plus Revenue Cycle Management and virtual staffing, which apply to any practice. Final eligibility is confirmed per patient and per payer at the time of service.",
      },
      {
        question: "How much of a primary care panel typically qualifies for CCM?",
        answer:
          "We routinely see 25 to 40 percent of an established primary-care panel qualify once the list is run against documented diagnoses. The bar is two or more chronic conditions expected to last at least twelve months, with the patient enrolled in Medicare Part B.",
      },
      {
        question: "Which primary care conditions count toward CCM eligibility?",
        answer:
          "Common qualifying conditions include hypertension, Type 2 diabetes, hyperlipidemia, COPD and chronic asthma, depression and anxiety, obesity-related comorbidities, osteoarthritis, and early chronic kidney disease. Any two or more together can qualify a patient.",
      },
      {
        question: "Does running CCM add work for my MAs and front-desk team?",
        answer:
          "No. Zenith's clinical team does the monthly outreach, documentation, and time tracking inside your EHR, so your medical assistants and front-desk staff stay focused on visits. Your practice bills the CPT codes and Zenith invoices for the clinical work.",
      },
    ],
  },

  "internal-medicine": {
    metaTitle:
      "Remote Care Management, Monitoring & Staffing for Internal Medicine",
    metaDescription:
      "Remote care management (CCM, PCM, RPM, TCM), revenue-cycle support, and virtual staffing for U.S. internal medicine practices. HIPAA Business Associate. Built for polychronic panels.",
    heroHeadline:
      "Internal medicine panels fit the full care-management stack, and the staffing to run it.",
    heroLead:
      "Polychronic, older, more complex patients map to every Medicare care-management program Zenith runs, from CCM and PCM to remote monitoring and transitional care, plus the revenue-cycle and virtual-staffing support that keeps it all moving. CCM and complex CCM are usually the largest levers.",
    whyHeadline: "Where internal medicine really outperforms on CCM.",
    whyParagraphs: [
      "Internal medicine panels frequently qualify 40-50% of patients for base CCM (CPT 99490), and a meaningful subset, those with moderate-to-high medical decision-making needs, for Complex CCM (CPT 99487 / 99489), which reimburses roughly 2× the base rate per patient per month.",
      "Zenith’s clinical team is set up for polychronic patient workflows: medication reconciliation across multiple specialists, closed-loop follow-up on hospital discharges, and documentation that reads correctly to a Medicare auditor.",
    ],
    patientMix: [
      "Congestive heart failure",
      "Chronic kidney disease",
      "Type 2 diabetes with complications",
      "COPD",
      "Atrial fibrillation",
      "Post-hospital follow-up and transitions of care",
      "Hyperlipidemia with ASCVD",
      "Osteoporosis",
    ],
    example: {
      panel: 650,
      enrollmentRate: 0.5,
    },
    faqs: [
      {
        question: "Which Zenith programs can an internal medicine practice run?",
        answer:
          "Internal medicine practices are typically eligible for Chronic Care Management, Principal Care Management, Remote Patient Monitoring, and Transitional Care Management, alongside Revenue Cycle Management and virtual staffing, which apply to any practice. Eligibility is confirmed per patient and per payer at the time of service.",
      },
      {
        question:
          "How much of an internal medicine panel qualifies for CCM?",
        answer:
          "Internal-medicine panels frequently qualify 40 to 50 percent of patients for base CCM (CPT 99490), and a meaningful subset for complex CCM (CPT 99487 and 99489), which reimburses roughly twice the base rate per patient per month.",
      },
      {
        question: "Why do internal medicine panels perform well on CCM?",
        answer:
          "Internal-medicine patients are older on average and more likely to be managing three or four conditions at once. That profile maps directly to the Medicare codes that pay for Chronic Care Management and often qualifies a larger share for the higher-reimbursing complex-CCM codes.",
      },
      {
        question:
          "Which conditions are typical in an internal medicine CCM panel?",
        answer:
          "Congestive heart failure, chronic kidney disease, Type 2 diabetes with complications, COPD, atrial fibrillation, post-hospital transitions of care, hyperlipidemia with ASCVD, and osteoporosis are all common, and patients often carry several at once.",
      },
    ],
  },

  geriatrics: {
    metaTitle:
      "Remote Care Management, Monitoring & Staffing for Geriatric Practices",
    metaDescription:
      "Remote care management (CCM, RPM, TCM), revenue-cycle support, and virtual staffing for U.S. geriatric practices. HIPAA Business Associate. The highest CCM yield in medicine.",
    heroHeadline:
      "Geriatric panels are built for care management, and the admin support to sustain it.",
    heroLead:
      "Near-universal Medicare coverage and dense, multi-condition panels make geriatrics the highest-yield fit for Chronic Care Management, with remote monitoring and transitional care close behind, plus revenue-cycle and virtual-staffing support for a small team carrying a heavy load. CCM is the flagship.",
    whyHeadline: "Geriatrics gets the highest per-panel CCM revenue in medicine.",
    whyParagraphs: [
      "Cognitive decline, polypharmacy, frailty, and cardiovascular comorbidities almost always coexist in geriatric patients. That combination pushes a substantial share of the panel into Complex CCM (99487 / 99489), which reimburses roughly double the base code.",
      "Zenith’s clinical team handles the care-coordination patterns geriatric patients need most: medication reviews across specialists, caregiver communication, closed-loop follow-up on fall-risk and ADL interventions, and the documentation audit standard requires.",
    ],
    patientMix: [
      "Cognitive decline and dementia",
      "Congestive heart failure",
      "Chronic kidney disease",
      "Osteoporosis and fall-risk comorbidities",
      "Polypharmacy management",
      "Frailty and functional decline",
      "Atrial fibrillation",
      "Depression and late-life anxiety",
    ],
    example: {
      panel: 500,
      enrollmentRate: 0.7,
      note: "With a substantial Complex CCM mix typical of geriatric panels, actual reimbursement often runs 30-50% higher than the base-code figure shown.",
    },
    faqs: [
      {
        question: "Which Zenith programs can a geriatric practice run?",
        answer:
          "Geriatric practices are typically eligible for Chronic Care Management, Remote Patient Monitoring, and Transitional Care Management, plus Revenue Cycle Management and virtual staffing, which apply to any practice. Eligibility is confirmed per patient and per payer at the time of service.",
      },
      {
        question: "What share of a geriatric panel qualifies for CCM?",
        answer:
          "The share of a geriatric panel that qualifies for Chronic Care Management is higher than any other specialty, frequently 60 to 80 percent, because geriatric practices combine near-universal Medicare coverage with near-universal multi-condition eligibility.",
      },
      {
        question: "Why does geriatrics produce the highest CCM revenue per panel?",
        answer:
          "Cognitive decline, polypharmacy, frailty, and cardiovascular comorbidities almost always coexist in geriatric patients. That combination pushes a substantial share of the panel into complex CCM (CPT 99487 and 99489), which reimburses roughly double the base code.",
      },
      {
        question: "Which conditions count toward CCM in a geriatric panel?",
        answer:
          "Cognitive decline and dementia, congestive heart failure, chronic kidney disease, osteoporosis and fall-risk comorbidities, polypharmacy, frailty and functional decline, atrial fibrillation, and late-life depression are all common qualifying conditions.",
      },
    ],
  },
};
