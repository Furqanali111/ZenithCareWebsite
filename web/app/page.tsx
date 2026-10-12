import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, HeartPulse, UserCog } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FounderMonogram } from "@/components/founder-monogram";
import { HeroEyebrow } from "@/components/hero-eyebrow";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { TrustStrip } from "@/components/trust-strip";
import { founder } from "@/lib/site";
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
  // Keyword-first, brand appended once by pageMetadata (avoids the prior
  // double-brand 78-char title).
  title: "Chronic Care Management & Care Coordination",
  description:
    "Remote Chronic Care Management and Patient Care Coordinator staffing for U.S. physician practices. PharmD-led, HIPAA Business Associate, inside your EHR.",
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
          serviceType: "Chronic Care Management",
        })}
      />

      {/* ─── Hero: dark editorial ledger-split ────────────────────────── */}
      <HomeHero />

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />

      {/* ─── Services preview ────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                Two remote-staffing programs for one clinical operation.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Run them separately or together under one BAA. Both are
                PharmD-supervised and work inside your EHR.
              </p>
            </header>
          </Reveal>

          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
            <Reveal delay={0.05} className="h-full">
              <ServiceCard
                image="/services/ccm.jpg"
                imageAlt="Clinician documenting care on a laptop beside a stethoscope"
                icon={<HeartPulse className="size-4" aria-hidden="true" />}
                label="Reimbursed by Medicare"
                title="Chronic Care Management"
                teaser="End-to-end CCM for patients with two or more chronic conditions — your practice bills, Zenith delivers the clinical labor."
                body="End-to-end CCM for patients with two or more chronic conditions. Your practice bills the CPT codes; Zenith delivers the clinical labor."
                href="/services/chronic-care-management"
                bullets={[
                  "20+ min / month of non-face-to-face care coordination per patient",
                  "CPT 99490 / 99439 / 99487 / 99489 / 99491 / 99437",
                  "Audit-ready documentation and time logs in your EHR",
                ]}
              />
            </Reveal>
            <Reveal delay={0.17} className="h-full">
              <ServiceCard
                image="/services/pcc.jpg"
                imageAlt="Care coordinator on a call while working at a laptop"
                icon={<UserCog className="size-4" aria-hidden="true" />}
                label="Flat monthly rate"
                title="Patient Care Coordinator"
                teaser="Remote coordinators for the admin that clogs your clinical team — pre-visit prep, referrals, prior auths, inbox triage."
                body="Remote coordinators for pre-visit prep, referral tracking, prior auths, inbox triage, and care-gap outreach — so your in-house team stays on clinical work."
                href="/services/patient-care-coordinator"
                bullets={[
                  "Pre-visit chart review and no-show follow-up",
                  "Referrals, prior authorizations, insurance verification",
                  "Portal inbox triage and panel-level outreach",
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <header className="max-w-2xl">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  Three steps. Your practice stays the billing provider.
                </h2>
              </header>
            </Reveal>

            <Reveal delay={0.1}>
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Revenue math navy band — complex-mix ceiling vs the hero's base floor ─ */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-brand-900)] px-8 py-14 text-[color:var(--color-surface-0)] md:px-14 md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-teal-500)]/18 blur-3xl"
            />
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
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
          </Reveal>
        </div>
      </section>

      {/* ─── Founder credibility strip ───────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
              <FounderMonogram initials={founder.initials} name={founder.name} />
              <div>
                <HeroEyebrow>Clinically led</HeroEyebrow>
                <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  Zenith is run by a trained pharmacist, not a call centre.
                </h2>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-body-ink">
                  Founder <strong className="font-medium text-ink-strong">{founder.name}</strong>{" "}
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
                    className="text-brand-accent hover:underline"
                  >
                    Read the full story →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Final CTA band ──────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card px-8 py-14 text-center md:px-14 md:py-20">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Ready to see the math for your practice?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
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
          </Reveal>
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
      <span className="inline-flex size-9 items-center justify-center rounded-full border border-brand-100 bg-card font-mono text-sm font-medium text-brand-accent">
        {number}
      </span>
      <h3 className="mt-5 font-serif text-xl font-semibold text-brand-ink">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-body-ink">
        {body}
      </p>
    </li>
  );
}
