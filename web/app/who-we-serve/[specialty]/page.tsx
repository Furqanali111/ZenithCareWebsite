import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";
import { specialties, specialtyLabel, type Specialty } from "@/lib/site";
import { CPT_RATES, formatUsd } from "@/lib/roi";

type Params = { specialty: string };

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
    title: `Chronic Care Management for ${specialtyLabel[specialty]}`,
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

  return (
    <>
      <JsonLd
        data={[
          serviceLd({
            name: `Chronic Care Management for ${label}`,
            description: c.metaDescription,
            path,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Who We Serve", path },
            { name: label, path },
          ]),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-3xl">
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
            Who we serve · {label}
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[color:var(--color-brand-900)] md:text-5xl">
            {c.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-600)] md:text-lg">
            {c.heroLead}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/roi-calculator">Estimate your ROI</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Why CCM for this specialty ──────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Why CCM here
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
                {c.whyHeadline}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-[color:var(--color-ink-600)]">
                {c.whyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Typical patient mix
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-[color:var(--color-brand-900)]">
                Conditions you&rsquo;ll already be seeing
              </h3>
              <ul className="mt-5 space-y-3 text-base text-[color:var(--color-ink-600)]">
                {c.patientMix.map((cond) => (
                  <BulletedListItem key={cond}>{cond}</BulletedListItem>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Representative revenue ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-2xl bg-[color:var(--color-brand-900)] px-8 py-14 text-[color:var(--color-surface-0)] md:px-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-accent-600)]">
                Representative panel
              </span>
              <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                {formatUsd(monthlyRevenue)}
              </p>
              <p className="mt-3 text-base text-[color:var(--color-surface-0)]/80">
                per month, for the panel below.
              </p>
              <p className="mt-6 text-sm text-[color:var(--color-accent-600)]">
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
              <p className="max-w-sm text-sm text-[color:var(--color-surface-0)]/70 md:text-right">
                Plug in your real numbers to see the figure for your panel —
                the calculator runs entirely in your browser.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/roi-calculator">Estimate your panel</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
            Fifteen minutes with a PharmD.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
            We&rsquo;ll confirm how many of your {label.toLowerCase()}{" "}
            patients qualify, walk through the per-code math, and tell you
            honestly whether Zenith is a fit.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services/chronic-care-management">
                CCM services overview
              </Link>
            </Button>
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

type SpecialtyContent = {
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
};

const CONTENT: Record<Specialty, SpecialtyContent> = {
  "primary-care": {
    metaDescription:
      "Chronic Care Management for U.S. primary care practices — the broadest chronic-condition mix in medicine, often with a large share of your panel eligible but unenrolled.",
    heroHeadline:
      "Primary care panels have the biggest unbilled CCM revenue in medicine.",
    heroLead:
      "Family medicine and primary care practices see the broadest chronic-condition mix of any specialty — hypertension, Type 2 diabetes, hyperlipidemia, COPD, depression, obesity, arthritis. A big share of that panel qualifies for CCM today; most practices bill little or none of it.",
    whyHeadline: "Why CCM pays for itself in a primary care practice.",
    whyParagraphs: [
      "The eligibility bar — two or more chronic conditions expected to last twelve months — is cleared by a large fraction of any established primary-care panel. We routinely see 25–40% of a panel qualify once we actually run the list against the diagnoses.",
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
  },

  "internal-medicine": {
    metaDescription:
      "Chronic Care Management for U.S. internal medicine practices — polychronic patients, higher complex-CCM share, and the per-patient revenue to match.",
    heroHeadline:
      "Internal medicine panels skew polychronic — which is exactly what CCM reimburses for.",
    heroLead:
      "Internal medicine patients are older on average, more medically complex, and more likely to be managing three or four conditions at once. That profile maps directly to the Medicare codes that pay for Chronic Care Management — and often qualifies a bigger share for the complex-CCM codes that reimburse at a higher rate.",
    whyHeadline: "Where internal medicine really outperforms on CCM.",
    whyParagraphs: [
      "Internal medicine panels frequently qualify 40–50% of patients for base CCM (CPT 99490), and a meaningful subset — those with moderate-to-high medical decision-making needs — for Complex CCM (CPT 99487 / 99489), which reimburses roughly 2× the base rate per patient per month.",
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
  },

  geriatrics: {
    metaDescription:
      "Chronic Care Management for U.S. geriatric practices — nearly every patient is Medicare-eligible and chronic-condition-dense, which is where CCM pays the most.",
    heroHeadline:
      "Geriatric panels are built for CCM — Medicare-dense, chronic-dense, and often cognitively complex.",
    heroLead:
      "Geriatrics practices sit at the intersection of nearly 100% Medicare coverage and nearly universal multi-condition eligibility. The share of a geriatric panel that qualifies for Chronic Care Management is higher than any other specialty — frequently 60–80% — and a large portion qualify for the higher-reimbursing complex-CCM codes.",
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
      note: "With a substantial Complex CCM mix typical of geriatric panels, actual reimbursement often runs 30–50% higher than the base-code figure shown.",
    },
  },
};
