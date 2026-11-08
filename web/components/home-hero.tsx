import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroLedger } from "@/components/hero-ledger";

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
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="aurora-shape aurora-1" />
        <div className="aurora-shape aurora-2" />
        <div className="aurora-shape aurora-3" />
      </div>

      <div className="relative z-[1] mx-auto grid max-w-[90rem] grid-cols-1 gap-14 px-6 pt-24 pb-24 md:grid-cols-2 md:items-center md:gap-16 md:pt-28 md:pb-28">
        {/* Left, copy */}
        <div className="max-w-xl">
          <h1 className="font-serif text-[2.5rem] font-semibold leading-[1.04] tracking-tight text-brand-ink md:text-[3.25rem] lg:text-[3.75rem]">
            A typical 200-patient CCM panel adds about $13K a month to your
            practice.
          </h1>

          <p className="reveal-up reveal-up-3 mt-7 max-w-lg text-base leading-relaxed text-body-ink md:text-lg">
            Zenith Care Solutions provides trained clinical and administrative
            staff who work inside your EHR, under one BAA. Your practice stays
            the billing provider. You keep the revenue.
          </p>

          <div className="reveal-up reveal-up-4 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-14 px-9 text-base font-semibold shadow-[var(--shadow-lift)] hover:bg-[color:var(--color-brand-700)]"
            >
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-body-ink transition-colors hover:text-brand-ink"
            >
              See our services
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* hairline trust row, text with dividers, not pill-chips */}
          <ul className="reveal-up reveal-up-5 mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <li>Signed BAA with every client</li>
            <li aria-hidden="true" className="h-3 w-px bg-border" />
            <li>Works inside your EHR</li>
          </ul>
        </div>

        {/* Right: interactive reimbursement ledger (real math, not a fake dashboard) */}
        <HeroLedger />
      </div>
    </section>
  );
}
