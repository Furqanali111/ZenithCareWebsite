import { Reveal } from "@/components/reveal";
import type { HowStep } from "@/lib/services";

/**
 * "How it works" as a stack of cards. From `lg` up, each card sticks a little
 * lower than the one before, so as you scroll the cards pile up like a deck;
 * heading stays pinned on the left. Pure CSS (`position: sticky`), no script.
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
        {subtitle ? <p className="mt-4 max-w-md text-base leading-relaxed text-body-ink">{subtitle}</p> : null}
      </Reveal>

      <ol className="space-y-6 lg:space-y-0">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="lg:sticky lg:mb-[22svh] last:lg:mb-0"
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
      </ol>
    </div>
  );
}
