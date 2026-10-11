import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";
import { CPT_RATES, type CptCode } from "@/lib/roi";

const PATH = "/services/chronic-care-management";
const NAME = "Chronic Care Management Services";
const DESCRIPTION =
  "Remote Chronic Care Management for U.S. primary care and internal medicine practices — care coordination, documentation, time tracking, and CPT 99490/99439/99487/99489 billing support.";

export const metadata: Metadata = pageMetadata({
  title: NAME,
  description: DESCRIPTION,
  path: PATH,
});

export default function ServicesCCMPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceLd({ name: NAME, description: DESCRIPTION, path: PATH }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: PATH },
            { name: "Chronic Care Management", path: PATH },
          ]),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-3xl">
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
            Services
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[color:var(--color-brand-900)] md:text-5xl">
            Chronic Care Management, delivered end to end by a clinically-led team.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-600)] md:text-lg">
            We find eligible patients, obtain documented consent, deliver the
            20+ minutes of monthly non-face-to-face care coordination that
            CCM requires, and keep the care plan up to date inside your EHR.
            Your practice remains the billing provider for every CPT code.
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

      {/* ─── What CCM is ──────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <header className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Primer
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
              What Chronic Care Management is, in one page.
            </h2>
          </header>

          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
            <div className="space-y-5 text-base leading-relaxed text-[color:var(--color-ink-600)]">
              <p>
                <strong className="font-medium text-[color:var(--color-ink-900)]">
                  Chronic Care Management (CCM)
                </strong>{" "}
                is a{" "}
                <a
                  href="https://www.cms.gov/medicare/medicare-fee-for-service-payment/physicianfeesched/downloads/ccm.pdf"
                  className="text-[color:var(--color-brand-700)] underline underline-offset-2 hover:text-[color:var(--color-brand-900)]"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Medicare program
                </a>{" "}
                that reimburses eligible practitioners — physicians, nurse
                practitioners, and physician assistants — for coordinating
                care for patients with two or more chronic conditions
                expected to last at least twelve months.
              </p>
              <p>
                Reimbursement is paid to the <em>billing practitioner</em>,
                not to CCM vendors. Zenith operates as subcontracted
                clinical staff: your practice bills Medicare for the CPT
                codes below, and Zenith invoices your practice for the
                clinical labor performed &ldquo;incident to&rdquo; your
                supervision. This is a well-established model used by
                every major CCM vendor.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[color:var(--color-brand-900)]">
                A patient qualifies when
              </h3>
              <ul className="mt-4 space-y-3 text-base text-[color:var(--color-ink-600)]">
                <BulletedListItem>
                  They have two or more chronic conditions expected to last
                  12+ months (hypertension, diabetes, COPD, CKD, depression,
                  CHF, arthritis, etc.).
                </BulletedListItem>
                <BulletedListItem>
                  They are enrolled in Medicare Part B.
                </BulletedListItem>
                <BulletedListItem>
                  They have given documented consent to receive CCM services,
                  recorded in the medical record.
                </BulletedListItem>
                <BulletedListItem>
                  They have a comprehensive care plan on file (problem list,
                  treatment goals, medication management, outside-provider
                  coordination).
                </BulletedListItem>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CPT code table — the key SEO + buyer-conviction asset ────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <header className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Billing reference
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
            The six CPT codes that make up a CCM program.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[color:var(--color-ink-600)]">
            Rates below are 2026 Medicare national averages, rounded for
            readability. Actual amounts vary by geography (Medicare locality
            adjustment) and payer contract. These are the figures that
            drive the revenue math on the{" "}
            <Link
              href="/roi-calculator"
              className="text-[color:var(--color-brand-700)] underline underline-offset-2 hover:text-[color:var(--color-brand-900)]"
            >
              ROI calculator
            </Link>
            .
          </p>
        </header>

        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Medicare CPT codes for Chronic Care Management with
              descriptions and 2026 rate estimates.
            </caption>
            <thead className="bg-[color:var(--color-surface-50)] text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold md:px-6">
                  CPT
                </th>
                <th scope="col" className="px-4 py-3 font-semibold md:px-6">
                  What it covers
                </th>
                <th scope="col" className="px-4 py-3 font-semibold md:px-6">
                  Time
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold md:px-6"
                >
                  ~Rate (2026)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 text-[color:var(--color-ink-900)]">
              {CPT_ROWS.map((row) => (
                <tr key={row.code}>
                  <td className="px-4 py-4 font-mono text-sm font-medium text-[color:var(--color-brand-700)] md:px-6">
                    {row.code}
                  </td>
                  <td className="px-4 py-4 md:px-6">
                    <div className="font-medium">{row.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {row.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground md:px-6">
                    {row.time}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-sm font-medium md:px-6">
                    ~${CPT_RATES[row.code]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Sources:{" "}
          <a
            href="https://www.cms.gov/medicare/medicare-fee-for-service-payment/physicianfeesched"
            className="underline underline-offset-2 hover:text-[color:var(--color-ink-900)]"
            rel="noopener noreferrer"
            target="_blank"
          >
            CMS Physician Fee Schedule
          </a>
          . Rates are national-average starting points, not quotes.
        </p>
      </section>

      {/* ─── Division of labor ───────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <header className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Division of labor
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
              What Zenith handles. What your practice keeps.
            </h2>
          </header>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <LaborColumn
              label="Zenith delivers"
              items={[
                "Monthly patient outreach calls — medications, symptoms, follow-up, barriers to care",
                "Care plan documentation and quarterly updates in your EHR",
                "Medication reconciliation and refill coordination",
                "Specialist referral tracking and closed-loop follow-up",
                "Monthly time-tracking logs that meet CMS audit requirements",
                "A single monthly summary report delivered to your office",
              ]}
            />
            <LaborColumn
              label="Your practice keeps"
              items={[
                "Clinical oversight and the billing-provider relationship",
                "Medicare billing for every CPT code we support",
                "Final sign-off on care-plan changes requiring physician judgment",
                "The patient relationship — Zenith never bills patients directly",
                "Access to your EHR and the configuration your IT governs",
                "The right to end the engagement with 30 days’ notice",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── HIPAA callout ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-2xl border border-border/70 bg-background p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_auto] md:items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Compliance
              </span>
              <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-3xl">
                HIPAA Business Associate from day one.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
                Zenith signs a Business Associate Agreement with every client
                practice before any patient information changes hands.
                Clinical staff work inside your EHR, no PHI is exported
                off-platform, and communications use HIPAA-eligible
                channels only.
              </p>
            </div>
            <Button asChild size="lg" variant="outline">
              <Link href="/hipaa-compliance">
                Read our HIPAA posture
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Final CTA band ──────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
            Fifteen minutes gets you a real number.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
            On the call we confirm your eligible patient count, walk through
            the per-code revenue for your panel, and tell you honestly
            whether Zenith is a fit.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/roi-calculator">Estimate your ROI first</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

type CptRow = {
  code: CptCode;
  title: string;
  description: string;
  time: string;
};

// Rate column is derived from CPT_RATES in lib/roi.ts (single source of truth).
const CPT_ROWS: CptRow[] = [
  {
    code: "99490",
    title: "CCM, base code",
    description:
      "Clinical staff time directed by a physician / NP / PA for a patient with 2+ chronic conditions.",
    time: "20+ min / month",
  },
  {
    code: "99439",
    title: "CCM, add-on",
    description:
      "Each additional 20 minutes of clinical staff time, same patient, same month.",
    time: "+20 min",
  },
  {
    code: "99487",
    title: "Complex CCM, base",
    description:
      "60+ minutes with moderate-to-high medical decision-making for patients with complex comorbidities.",
    time: "60+ min / month",
  },
  {
    code: "99489",
    title: "Complex CCM, add-on",
    description: "Each additional 30 minutes beyond the 99487 base time.",
    time: "+30 min",
  },
  {
    code: "99491",
    title: "CCM, physician-performed",
    description:
      "Used when the billing physician / NP / PA personally performs the care coordination time (not clinical staff).",
    time: "30+ min / month",
  },
  {
    code: "99437",
    title: "CCM, physician-performed add-on",
    description:
      "Each additional 30 minutes of physician-performed CCM beyond the 99491 base.",
    time: "+30 min",
  },
];

function LaborColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 md:p-8">
      <h3 className="font-serif text-xl font-semibold text-[color:var(--color-brand-900)]">
        {label}
      </h3>
      <ul className="mt-5 space-y-3 text-base leading-relaxed text-[color:var(--color-ink-600)]">
        {items.map((item) => (
          <BulletedListItem key={item}>{item}</BulletedListItem>
        ))}
      </ul>
    </div>
  );
}
