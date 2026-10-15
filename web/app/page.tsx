import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowRight, Receipt, Users } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FounderMonogram } from "@/components/founder-monogram";
import { HeroEyebrow } from "@/components/hero-eyebrow";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { categoryMeta } from "@/lib/services";
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
 *, a realistic mix for internal-medicine and geriatric practices. Keeps
 * the single-source-of-truth rule by deriving from CPT_RATES; the dev
 * self-check in lib/roi.ts guards the base rate drift.
 */
const COMPLEX_MIX_FRACTION = 0.2;
const COMPLEX_MIX_MONTHLY =
  Math.round(ANCHOR_PATIENTS * (1 - COMPLEX_MIX_FRACTION)) * CPT_RATES["99490"] +
  Math.round(ANCHOR_PATIENTS * COMPLEX_MIX_FRACTION) * CPT_RATES["99487"];

// The three service lines for the home preview, linking to each category hub.
const HOME_CATEGORIES = [
  { meta: categoryMeta.rpm, icon: <Activity className="size-5" aria-hidden="true" /> },
  { meta: categoryMeta.rcm, icon: <Receipt className="size-5" aria-hidden="true" /> },
  { meta: categoryMeta.staffing, icon: <Users className="size-5" aria-hidden="true" /> },
];

export const metadata: Metadata = pageMetadata({
  title: "Remote Clinical Services",
  description:
    "Care management, revenue cycle and virtual staffing for U.S. physician practices. HIPAA Business Associate, inside your EHR.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={serviceLd({
          name: "Remote care management, revenue cycle, and virtual staffing",
          description:
            "Remote care management, revenue cycle management, and virtual medical staffing for U.S. physician practices.",
          path: "/",
          serviceType: "Healthcare Practice Support",
        })}
      />

      {/* ─── Hero: dark editorial ledger-split ────────────────────────── */}
      <HomeHero />

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />

      {/* ─── Service lines (three categories) ────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                Three service lines. One operational partner.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Everything a practice needs to capture unbilled revenue and
                recover staff hours, under one BAA. Take one line or all three.
              </p>
            </header>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOME_CATEGORIES.map(({ meta, icon }, i) => (
              <Reveal key={meta.href} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  href={meta.href}
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    {icon}
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-brand-ink group-hover:text-brand-accent">
                    {meta.label}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
                    {meta.blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
                    Explore
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

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-7xl px-6">
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
                body="Each month our clinical team spends 20+ minutes per patient on calls, medication reconciliation, specialist follow-up, and care-plan documentation, inside your EHR."
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

      {/* ─── Revenue math navy band, complex-mix ceiling vs the hero's base floor ─ */}
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
                <p className="text-sm text-body-ink dark:text-[color:var(--color-surface-0)]/70">
                  For practices running care management programs:
                </p>
                <span className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.18em] text-brand-accent">
                  With Complex-CCM mix
                </span>
                <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                  {formatUsd(COMPLEX_MIX_MONTHLY)}
                </p>
                <p className="mt-3 text-base text-body-ink dark:text-[color:var(--color-surface-0)]/80">
                  per month, same {ANCHOR_PATIENTS}-patient panel with a 1-in-5
                  Complex-CCM share.
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground dark:text-[color:var(--color-accent-600)]">
                  Base-only revenue is{" "}
                  <span className="font-mono">{formatUsd(ANCHOR_MONTHLY)}</span>{" "}
                  (shown above). Shifting ~20% of patients to{" "}
                  <span className="font-mono">CPT 99487</span> lifts the figure
                  by roughly 20%. Internal-medicine and geriatric panels
                  typically index higher; primary-care lower.
                </p>
              </div>

              <div className="flex flex-col gap-4 md:items-end">
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right dark:text-[color:var(--color-surface-0)]/70">
                  Plug in your panel size and expected enrollment rate, the
                  calculator does the math client-side and shows a typical range.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="h-11 bg-[color:var(--color-gold-500)] px-6 text-sm text-[color:var(--color-brand-900)] hover:brightness-105"
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
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
              <FounderMonogram initials={founder.initials} name={founder.name} />
              <div>
                <HeroEyebrow>The founder</HeroEyebrow>
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
                  <span>Clinical Pharmacist</span>
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
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card px-8 py-14 text-center md:px-14 md:py-20">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Ready to find out if we are a fit?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              Fifteen minutes. We confirm your eligible patient count or scope
              the role, walk through the numbers, and tell you honestly whether
              Zenith is the right partner.
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
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-gold-500)]/35 bg-[color:var(--color-gold-100)]/35 font-mono text-sm font-medium text-[color:var(--color-gold-500)] dark:bg-[color:var(--color-gold-500)]/10">
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
