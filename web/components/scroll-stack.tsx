import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import type { HowStep } from "@/lib/services";

/**
 * "How it works" as a stack of cards. From `lg` up, each card sticks a little
 * lower than the one before, so as you scroll the cards pile up like a deck;
 * the heading, a step index and a call to action stay pinned on the left. Pure CSS (`position: sticky`), no script.
 * Below `lg` it is an ordinary list.
 */
export function ScrollStack({
  heading = "How it works",
  subtitle,
  steps,
}: {
  heading?: string;
  subtitle?: string;
  steps: HowStep[];
}) {
  return (
    <div className="mx-auto grid max-w-[90rem] gap-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">{heading}</h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-body-ink">
          {subtitle ?? "Three steps from the first call to a program running inside your EHR."}
        </p>

        <ol className="mt-8 hidden max-w-md border-l border-border/80 lg:block">
          {steps.map((s, i) => (
            <li key={s.title}>
              <a
                href={`#step-${i + 1}`}
                className="-ml-px flex items-baseline gap-4 border-l-2 border-transparent py-3 pl-5 text-body-ink transition-colors hover:border-[color:var(--step-accent)] hover:text-brand-ink"
              >
                <span className="font-serif text-sm tabular-nums text-brand-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>

        <Button asChild size="lg" className="mt-8 h-12 px-7 text-sm">
          <Link href="/contact">Book a 15-minute call</Link>
        </Button>
      </Reveal>

      <ol className="space-y-6 lg:space-y-0">
        {steps.map((s, i) => (
          <li
            key={s.title}
            id={`step-${i + 1}`}
            className="scroll-mt-28 lg:sticky lg:mb-[14svh] last:lg:mb-0"
            style={{ top: `calc(7rem + ${i * 1.25}rem)` }}
          >
            <div className="spotlight rounded-2xl border border-border/70 bg-card p-7 shadow-[var(--shadow-lift)] md:p-9">
              <p className="font-serif text-4xl font-semibold tabular-nums text-brand-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold text-brand-ink md:text-2xl">{s.title}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-body-ink">{s.body}</p>
            </div>
          </li>
        ))}
        {/* Keeps the pile pinned for a while after the last card lands. */}
        <li aria-hidden="true" className="hidden h-[14svh] lg:block" />
      </ol>
    </div>
  );
}
