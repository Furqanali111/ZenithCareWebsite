import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Service } from "@/lib/services";

/**
 * Service card grid (name + one-line description + "Learn more"). Shared by the
 * services overview and the three category landing pages, so the card markup
 * lives in one place. Each card links to the full /services/<slug> page.
 */
export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 3) * 0.08} className="h-full">
          <Link
            href={`/services/${s.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[var(--shadow-lift)]"
          >
            <h3 className="font-serif text-lg font-semibold text-brand-ink group-hover:text-brand-accent">
              {s.name}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
              {s.shortDesc}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
              Learn more
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
