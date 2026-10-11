import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, HeartPulse, UserCog } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FounderMonogram } from "@/components/founder-monogram";
import { HeroEyebrow } from "@/components/hero-eyebrow";
import { TrustStrip } from "@/components/trust-strip";
import { founder, site } from "@/lib/site";
import {
  ANCHOR_MONTHLY,
  ANCHOR_PATIENTS,
  CPT_RATES,
  formatUsd,
} from "@/lib/roi";

/**
 * Homepage-only derived figure. Represents a typical panel where ~20% of
 * enrolled patients bill Complex CCM (CPT 99487) instead of the base code
 * — a realistic mix for internal-medicine and geriatric practices. Keeps
 * the single-source-of-truth rule by deriving from CPT_RATES; the dev
 * self-check in lib/roi.ts guards the base rate drift.
 */
const COMPLEX_MIX_FRACTION = 0.2;
const COMPLEX_MIX_MONTHLY =
  Math.round(ANCHOR_PATIENTS * (1 - COMPLEX_MIX_FRACTION)) * CPT_RATES["99490"] +
  Math.round(ANCHOR_PATIENTS * COMPLEX_MIX_FRACTION) * CPT_RATES["99487"];

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — Remote Chronic Care Management`,
  description:
    "Zenith Care Solutions runs end-to-end Chronic Care Management and remote Patient Care Coordinator staffing for U.S. physician practices. Clinically led by a PharmD, HIPAA Business Associate, inside your EHR.",
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

      {/* ─── Hero: asymmetric split ───────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-dotgrid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 pt-20 pb-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-16 md:pt-24 md:pb-24">
          {/* Left — copy */}
          <div className="max-w-xl">
            <HeroEyebrow>For U.S. physician practices</HeroEyebrow>

            <h1 className="mt-6 font-serif text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-[color:var(--color-brand-900)] md:text-5xl lg:text-[3.25rem]">
              Remote clinical staff for the work you can bill, but can&rsquo;t{" "}
              <span className="relative inline-block">
                staff
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[color:var(--color-gold-500)]"
                />
              </span>
              .
            </h1>

            <p className="mt-7 max-w-lg text-base leading-relaxed text-[color:var(--color-ink-600)] md:text-lg">
              Zenith delivers remote Chronic Care Management and Patient Care
              Coordinator staffing to U.S. primary care, internal medicine, and
              geriatric practices. Clinically led. HIPAA Business Associate.
              Inside your EHR.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm shadow-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm"
              >
                <Link href="/roi-calculator">Estimate your ROI</Link>
              </Button>
            </div>

            <p className="mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
              Representative example: a {ANCHOR_PATIENTS}-patient CCM panel at
              the base code ≈ {formatUsd(ANCHOR_MONTHLY)}/month in Medicare
              reimbursement. Actual results vary.
            </p>
          </div>

          {/* Right — glanceable revenue card (real data, not a fake screenshot) */}
          <aside aria-label="Representative CCM revenue" className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[color:var(--color-brand-50)]/70 blur-2xl" />
            <div className="rounded-2xl border border-border/70 bg-background p-7 shadow-xl shadow-[color:var(--color-brand-900)]/10 md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
                  Monthly revenue, typical panel
                </span>
                <span className="rounded-full bg-[color:var(--color-brand-50)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-brand-700)]">
                  CPT 99490
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-3 font-serif font-semibold tracking-tight text-[color:var(--color-brand-900)]">
                <span className="text-5xl md:text-6xl">
                  {formatUsd(ANCHOR_MONTHLY)}
                </span>
                <span className="text-base font-medium text-[color:var(--color-ink-600)]">
                  / month
                </span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--color-ink-600)]">
                {ANCHOR_PATIENTS} enrolled patients × ${CPT_RATES["99490"]}{" "}
                base-code reimbursement
              </p>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <StatPill label="Base" value={`$${CPT_RATES["99490"]}`} note="99490" />
                <StatPill label="Add-on" value={`$${CPT_RATES["99439"]}`} note="99439" />
                <StatPill label="Complex" value={`$${CPT_RATES["99487"]}`} note="99487" />
              </div>

              <Link
                href="/roi-calculator"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-brand-700)] hover:text-[color:var(--color-brand-900)]"
              >
                Run the full math
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />

      {/* ─── Services preview ────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-6xl px-6">
          <header className="max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
              Two remote-staffing programs for one clinical operation.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[color:var(--color-ink-600)]">
              Run them separately or together under one BAA. Both are
              PharmD-supervised and work inside your EHR.
            </p>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <ServiceCard
              icon={<HeartPulse className="size-5" aria-hidden="true" />}
              label="Reimbursed by Medicare"
              title="Chronic Care Management"
              body="End-to-end CCM for patients with two or more chronic conditions. Your practice bills the CPT codes; Zenith delivers the clinical labor."
              href="/services/chronic-care-management"
              bullets={[
                "20+ min / month of non-face-to-face care coordination per patient",
                "CPT 99490 / 99439 / 99487 / 99489 / 99491 / 99437",
                "Audit-ready documentation and time logs in your EHR",
              ]}
            />
            <ServiceCard
              icon={<UserCog className="size-5" aria-hidden="true" />}
              label="Flat monthly rate"
              title="Patient Care Coordinator"
              body="Remote coordinators for pre-visit prep, referral tracking, prior auths, inbox triage, and care-gap outreach — so your in-house team stays on clinical work."
              href="/services/patient-care-coordinator"
              bullets={[
                "Pre-visit chart review and no-show follow-up",
                "Referrals, prior authorizations, insurance verification",
                "Portal inbox triage and panel-level outreach",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="section-rhythm">
          <div className="mx-auto max-w-6xl px-6">
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
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
        </div>
      </section>

      {/* ─── Revenue math navy band — complex-mix ceiling vs the hero's base floor ─ */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-brand-900)] px-8 py-14 text-[color:var(--color-surface-0)] md:px-14 md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-gold-500)]/15 blur-3xl"
            />
            <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
              <div>
                <HeroEyebrow>With Complex-CCM mix</HeroEyebrow>
                <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                  {formatUsd(COMPLEX_MIX_MONTHLY)}
                </p>
                <p className="mt-3 text-base text-[color:var(--color-surface-0)]/80">
                  per month, same {ANCHOR_PATIENTS}-patient panel with a 1-in-5
                  Complex-CCM share.
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-[color:var(--color-accent-600)]">
                  Base-only revenue is{" "}
                  <span className="font-mono">{formatUsd(ANCHOR_MONTHLY)}</span>{" "}
                  (shown above). Shifting ~20% of patients to{" "}
                  <span className="font-mono">CPT 99487</span> lifts the figure
                  by roughly 20%. Internal-medicine and geriatric panels
                  typically index higher; primary-care lower.
                </p>
              </div>

              <div className="flex flex-col gap-4 md:items-end">
                <p className="max-w-sm text-sm leading-relaxed text-[color:var(--color-surface-0)]/70 md:text-right">
                  Plug in your panel size and expected enrollment rate — the
                  calculator does the math client-side and shows a typical range.
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-11 px-6 text-sm"
                >
                  <Link href="/roi-calculator">
                    Estimate your panel&rsquo;s number
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Founder credibility strip ───────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="section-rhythm">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
              <FounderMonogram initials={founder.initials} name={founder.name} />
              <div>
                <HeroEyebrow>Clinically led</HeroEyebrow>
                <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
                  Zenith is run by a trained pharmacist, not a call centre.
                </h2>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-[color:var(--color-ink-600)]">
                  Founder <strong className="font-medium text-[color:var(--color-ink-900)]">{founder.name}</strong>{" "}
                  brings a clinical oncology and bone-marrow-transplant background
                  to every workflow Zenith delivers. Your practice gets care
                  coordination from staff who understand the medications, the
                  comorbidities, and the compliance posture.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span>PharmD, Clinical Pharmacist</span>
                  <span aria-hidden="true">·</span>
                  <span>Oncology / BMT</span>
                  <span aria-hidden="true">·</span>
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
        </div>
      </section>

      {/* ─── Final CTA band ──────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-border/70 bg-background px-8 py-14 text-center md:px-14 md:py-20">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
              Ready to see the math for your practice?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
              Fifteen minutes. We confirm your eligible patient count or scope
              the coordinator role, walk through the numbers, and tell you
              honestly whether we&rsquo;re a fit.
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
                <Link href="/roi-calculator">Estimate your ROI first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function StatPill({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-[color:var(--color-surface-50)] p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand-700)]">
        {label}
      </p>
      <p className="mt-1 font-serif text-lg font-semibold text-[color:var(--color-brand-900)]">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
        {note}
      </p>
    </div>
  );
}

function ServiceCard({
  icon,
  label,
  title,
  body,
  href,
  bullets,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  href: string;
  bullets: string[];
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background p-7 transition-colors hover:border-[color:var(--color-brand-700)]/40 md:p-9">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)] dark:bg-white/10 dark:text-[color:var(--color-accent-600)]">
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-brand-700)] dark:text-[color:var(--color-accent-600)]">
          {label}
        </span>
      </div>
      <h3 className="mt-6 font-serif text-2xl font-semibold tracking-tight text-[color:var(--color-brand-900)]">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-[color:var(--color-ink-600)]">
        {body}
      </p>
      <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-[color:var(--color-ink-600)]">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 flex-none rounded-full bg-[color:var(--color-gold-500)]"
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-brand-700)] hover:text-[color:var(--color-brand-900)]"
      >
        Explore {title}
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

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
      <span className="inline-flex size-9 items-center justify-center rounded-full border border-[color:var(--color-brand-100)] bg-background font-mono text-sm font-medium text-[color:var(--color-brand-700)]">
        {number}
      </span>
      <h3 className="mt-5 font-serif text-xl font-semibold text-[color:var(--color-brand-900)]">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-[color:var(--color-ink-600)]">
        {body}
      </p>
    </li>
  );
}
