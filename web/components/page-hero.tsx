import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Cta = { label: string; href: string };

/**
 * Shared inner-page hero, the same theme-reactive aurora canvas as the
 * homepage hero (airy light / navy dark, teal accents, CSS `reveal-up`
 * entrance, no client JS), so every top-level page opens with one consistent,
 * premium moment that matches the active light/dark theme.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}) {
  return (
    <section className="relative overflow-hidden bg-surface-tint dark:bg-[color:var(--color-brand-900)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="aurora-shape aurora-1" />
        <div className="aurora-shape aurora-2" />
        <div className="aurora-shape aurora-3" />
      </div>
      <div
        aria-hidden="true"
        className="bg-dotgrid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-28 md:pb-24">
        <div className="max-w-3xl">
          <span className="reveal-up reveal-up-1 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-accent dark:border-white/15 dark:bg-white/5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand-accent"
            />
            {eyebrow}
          </span>

          <h1 className="reveal-up reveal-up-2 mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
            {title}
          </h1>

          {children ? (
            <div className="reveal-up reveal-up-3 mt-6 max-w-2xl text-base leading-relaxed text-body-ink md:text-lg">
              {children}
            </div>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div className="reveal-up reveal-up-4 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {primaryCta ? (
                <Button asChild size="lg" className="h-12 px-7 text-sm">
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-body-ink transition-colors hover:text-brand-ink"
                >
                  {secondaryCta.label}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
