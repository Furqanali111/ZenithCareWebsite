import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANCHOR_MONTHLY, ANCHOR_PATIENTS, CPT_RATES, formatUsd } from "@/lib/roi";

/**
 * Homepage hero, theme-reactive. Light mode is an airy "Soft Structuralism"
 * canvas (pale surface, soft teal aurora, floating ledger card); dark mode is
 * the "Ethereal Glass" navy canvas. It uses the same theme tokens as the rest
 * of the site (`text-brand-ink`, `bg-surface-tint`, …) so day mode is no
 * longer navy-on-navy.
 *
 * Server component, zero client JS. The entrance is a CSS `reveal-up`
 * animation (see globals.css): it is in the SSR HTML and visible without
 * waiting for hydration, so the LCP headline is never gated behind JS, and
 * reduced-motion users get it instantly.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-surface-tint dark:bg-[color:var(--color-brand-900)]">
      {/* living aurora, teal + navy drifting glows (see globals.css) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="aurora-shape aurora-1" />
        <div className="aurora-shape aurora-2" />
        <div className="aurora-shape aurora-3" />
      </div>
      {/* dot-grid texture, theme-aware (dark dots on light, light dots on navy) */}
      <div
        aria-hidden="true"
        className="bg-dotgrid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pt-24 pb-24 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:items-center md:gap-16 md:pt-28 md:pb-28">
        {/* Left, copy */}
        <div className="max-w-xl">
          <span className="reveal-up reveal-up-1 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-accent dark:border-white/15 dark:bg-white/5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand-accent"
            />
            For U.S. physician practices
          </span>

          <h1 className="reveal-up reveal-up-2 mt-6 font-serif text-[2.5rem] font-semibold leading-[1.04] tracking-tight text-brand-ink md:text-[3.25rem] lg:text-[3.75rem]">
            Remote clinical staff for the work you can bill, but can&rsquo;t{" "}
            <span className="relative inline-block whitespace-nowrap italic">
              staff
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[color:var(--color-gold-500)]"
              />
            </span>
            .
          </h1>

          <p className="reveal-up reveal-up-3 mt-7 max-w-lg text-base leading-relaxed text-body-ink md:text-lg">
            Zenith delivers remote Chronic Care Management and Patient Care
            Coordinator staffing to U.S. primary care, internal medicine, and
            geriatric practices. Clinically led. HIPAA Business Associate.
            Inside your EHR.
          </p>

          <div className="reveal-up reveal-up-4 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 px-7 text-sm">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Link
              href="/roi-calculator"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-body-ink transition-colors hover:text-brand-ink"
            >
              Estimate your ROI
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* hairline trust row, text with dividers, not pill-chips */}
          <ul className="reveal-up reveal-up-5 mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <li>PharmD-led</li>
            <li aria-hidden="true" className="h-3 w-px bg-border" />
            <li>HIPAA Business Associate</li>
            <li aria-hidden="true" className="h-3 w-px bg-border" />
            <li>Inside your EHR</li>
          </ul>
        </div>

        {/* Right, light reimbursement ledger on navy (real data, not a fake dashboard) */}
        <aside
          aria-label="Representative CCM reimbursement"
          className="reveal-up reveal-up-3 relative"
        >
          <div className="rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-surface-0)] p-7 text-[color:var(--color-brand-900)] shadow-[0_24px_60px_-28px_rgba(11,37,69,0.35)] dark:border-white/10 dark:shadow-2xl dark:shadow-black/40 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
                Monthly reimbursement, typical panel
              </span>
              <span className="shrink-0 rounded-full bg-[color:var(--color-brand-50)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-brand-700)]">
                CPT 99490
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3 font-serif font-semibold tracking-tight">
              <span className="text-5xl tabular-nums md:text-6xl">
                {formatUsd(ANCHOR_MONTHLY)}
              </span>
              <span className="text-base font-medium text-[color:var(--color-ink-700)]">
                / month
              </span>
            </div>
            <p className="mt-2 text-sm text-[color:var(--color-ink-700)]">
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
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground dark:text-white/60">
            Representative example at the base code. Actual results vary.
          </p>
        </aside>
      </div>
    </section>
  );
}

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
    <div className="rounded-xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-surface-50)] p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand-700)]">
        {label}
      </p>
      <p className="mt-1 font-serif text-lg font-semibold text-[color:var(--color-brand-900)]">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[10px] text-[color:var(--color-ink-700)]/60">
        {note}
      </p>
    </div>
  );
}
