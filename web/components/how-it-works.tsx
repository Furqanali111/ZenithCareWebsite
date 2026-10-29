import { Fragment } from "react";
import { Reveal } from "@/components/reveal";
import type { HowStep } from "@/lib/services";

/**
 * "How it works", a factual 3-step flow. Numbered cyan step tiles joined by
 * apricot connector arrows (→ on desktop, ↓ on mobile), with ink title/body.
 * Theme-aware via brand tokens; order is carried by the visible number + text,
 * never by color alone. Decorative connectors are aria-hidden.
 */
export function HowItWorks({
  heading = "How it works",
  subtitle,
  steps,
}: {
  heading?: string;
  subtitle?: string;
  steps: HowStep[];
}) {
  return (
    <div className="mx-auto max-w-[90rem] px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
          {heading}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-base leading-relaxed text-body-ink">{subtitle}</p>
        ) : null}
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-5xl items-start gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
        {steps.map((s, i) => (
          <Fragment key={s.title}>
            {i > 0 ? <Connector /> : null}
            <Reveal delay={i * 0.08} className="text-center">
              <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-primary font-mono text-sm font-semibold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-serif text-lg font-semibold text-brand-ink">
                {s.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-body-ink">
                {s.body}
              </p>
            </Reveal>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden="true"
      className="flex justify-center md:mt-[14px]"
    >
      <svg
        viewBox="0 0 40 24"
        className="h-6 w-10 rotate-90 text-[color:var(--color-gold-500)] md:rotate-0"
        fill="none"
      >
        <path
          d="M2 12h33M27 5l8 7-8 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
