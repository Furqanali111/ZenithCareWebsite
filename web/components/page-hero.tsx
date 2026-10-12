import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Cta = { label: string; href: string };

/**
 * Shared inner-page hero — the same art-directed dark aurora canvas as the
 * homepage hero (teal accents, CSS `reveal-up` entrance, no client JS), so
 * every top-level page opens with one consistent, premium moment. Explicit
 * light colors throughout (always-dark band, independent of site theme).
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
    <section className="relative overflow-hidden bg-[color:var(--color-brand-900)] text-white">
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
        className="pointer-events-none absolute inset-0 opacity-[0.1] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 md:pt-28 md:pb-24">
        <div className="max-w-3xl">
          <span className="reveal-up reveal-up-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-teal-400)]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[color:var(--color-teal-400)]"
            />
            {eyebrow}
          </span>

          <h1 className="reveal-up reveal-up-2 mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl">
            {title}
          </h1>

          {children ? (
            <div className="reveal-up reveal-up-3 mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              {children}
            </div>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div className="reveal-up reveal-up-4 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {primaryCta ? (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 px-7 text-sm"
                >
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
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
