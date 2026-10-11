import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FounderMonogram } from "@/components/founder-monogram";
import { founder, site } from "@/lib/site";
import {
  ANCHOR_MONTHLY,
  ANCHOR_PATIENTS,
  formatUsd,
} from "@/lib/roi";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — Remote Chronic Care Management`,
  description:
    "Zenith Care Solutions runs end-to-end Chronic Care Management for U.S. primary care, internal medicine, and geriatric practices. Clinically led by a PharmD, HIPAA Business Associate, inside your EHR.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={serviceLd({
          name: "Chronic Care Management, delivered",
          description:
            "End-to-end Chronic Care Management services for U.S. physician practices.",
          path: "/",
        })}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 md:pt-32 md:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
            For U.S. physician practices
          </span>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[color:var(--color-brand-900)] md:text-6xl">
            Capture the recurring Medicare revenue your practice may be
            leaving on the table — through{" "}
            <span className="relative inline-block">
              Chronic Care Management
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-[3px] bg-[color:var(--color-gold-500)]"
              />
            </span>
            .
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-600)] md:text-lg">
            Zenith runs end-to-end CCM for U.S. primary care, internal medicine,
            and geriatric practices — delivered by trained clinical staff under
            your supervision, inside the EHR you already use.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="/roi-calculator">Estimate your ROI</Link>
            </Button>
          </div>

          <p className="mt-5 max-w-xl text-xs text-muted-foreground">
            Representative example: a {ANCHOR_PATIENTS}-patient CCM panel at
            the base code ≈ {formatUsd(ANCHOR_MONTHLY)}/month in Medicare
            reimbursement. Actual results vary.
          </p>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <header className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              How it works
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
              Three steps. Your practice stays the billing provider.
            </h2>
          </header>

          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <HowStep
              number="01"
              title="Identify & enroll"
              body="We find patients in your panel with two or more chronic conditions on Medicare Part B, confirm eligibility, and obtain documented consent."
            />
            <HowStep
              number="02"
              title="Deliver monthly care coordination"
              body="Each month our clinical team spends 20+ minutes per patient on calls, medication reconciliation, specialist follow-up, and care-plan documentation — inside your EHR."
            />
            <HowStep
              number="03"
              title="You bill, we invoice"
              body="Your practice bills Medicare for CPT 99490 and relevant add-ons (99439 / 99487 / 99489). Zenith invoices you for the clinical labor. Monthly, predictable."
            />
          </ol>
        </div>
      </section>

      {/* ─── Revenue math card ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-2xl bg-[color:var(--color-brand-900)] px-8 py-14 text-[color:var(--color-surface-0)] md:px-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-accent-600)]">
                Representative revenue
              </span>
              <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                {formatUsd(ANCHOR_MONTHLY)}
              </p>
              <p className="mt-3 text-base text-[color:var(--color-surface-0)]/80">
                per month, for a {ANCHOR_PATIENTS}-patient CCM panel.
              </p>
              <p className="mt-6 text-sm text-[color:var(--color-accent-600)]">
                Based on <span className="font-mono">CPT 99490</span> base-code
                billing at the 2026 Medicare rate. Complex-CCM add-ons
                (<span className="font-mono">99487</span>/
                <span className="font-mono">99489</span>) swing it higher;
                actual mix varies.
              </p>
            </div>

            <div className="flex flex-col gap-4 md:items-end">
              <p className="max-w-sm text-sm text-[color:var(--color-surface-0)]/70 md:text-right">
                Plug in your panel size and expected enrollment rate — the
                calculator does the math client-side and shows a typical range.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
              >
                <Link href="/roi-calculator">
                  Estimate your panel&rsquo;s number
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Founder credibility strip ───────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
            <FounderMonogram initials={founder.initials} name={founder.name} />
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Clinically led
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
                Zenith is run by a trained pharmacist, not a call centre.
              </h2>
              <p className="mt-5 max-w-prose text-base leading-relaxed text-[color:var(--color-ink-600)]">
                Founder <strong className="font-medium text-[color:var(--color-ink-900)]">{founder.name}</strong>{" "}
                brings a clinical oncology and bone-marrow-transplant background
                to every CCM workflow Zenith delivers. Your practice gets care
                coordination from staff who understand the medications, the
                comorbidities, and the compliance posture.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span>PharmD, Clinical Pharmacist</span>
                <span>·</span>
                <span>Oncology / BMT</span>
                <span>·</span>
                <Link
                  href="/about"
                  className="text-[color:var(--color-brand-700)] hover:underline"
                >
                  Read the full story →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA band ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-2xl border border-border/70 bg-background px-8 py-14 text-center md:px-14 md:py-20">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
            Ready to see the math for your panel?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
            Fifteen minutes. We confirm your eligible patient count, walk through
            the per-code revenue, and tell you honestly whether we&rsquo;re a fit.
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

function HowStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex flex-col">
      <span className="font-mono text-sm font-medium text-[color:var(--color-brand-700)]">
        {number}
      </span>
      <h3 className="mt-4 font-serif text-xl font-semibold text-[color:var(--color-brand-900)]">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-[color:var(--color-ink-600)]">
        {body}
      </p>
    </li>
  );
}

