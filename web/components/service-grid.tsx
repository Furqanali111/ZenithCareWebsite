import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BentoGrid } from "@/components/bento-grid";
import { Reveal } from "@/components/reveal";
import type { Service } from "@/lib/services";

/**
 * Service tiles (name + one-line description + "Learn more") as a bento: the
 * first tile is wider and set larger. Shared by the services overview and the
 * three category landing pages. Each tile links to /services/<slug>.
 */
export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <BentoGrid
      className="mt-10"
      tiles={services.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 3) * 0.08} className="h-full">
          <Link
            href={`/services/${s.slug}`}
            className="spotlight group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-[border-color] duration-300 hover:border-[color:var(--color-teal-500)]/40 md:p-7"
          >
            <h3
              className={`font-serif font-semibold text-brand-ink group-hover:text-brand-accent ${i === 0 ? "text-2xl" : "text-lg"}`}
            >
              {s.name}
            </h3>
            <p className={`mt-3 flex-1 leading-relaxed text-body-ink ${i === 0 ? "max-w-md text-base" : "text-sm"}`}>
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
    />
  );
}
