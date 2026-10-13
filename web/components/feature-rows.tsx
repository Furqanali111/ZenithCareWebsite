import { BrandFigure } from "@/components/brand-figure";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export type FeatureRow = {
  heading: string;
  /** One short paragraph per entry. */
  body: string[];
  image: string;
  alt: string;
};

/**
 * Alternating image + text rows (image left/right flips down the page). Each
 * row carries its own heading and copy. Reuses BrandFigure so the photo frame
 * matches the rest of the site. Server component, no client JS.
 */
export function FeatureRows({ items }: { items: FeatureRow[] }) {
  if (items.length === 0) return null;
  return (
    <section className="section-rhythm">
      <div className="mx-auto max-w-7xl space-y-16 px-6 md:space-y-24">
        {items.map((row, i) => {
          const imageFirst = i % 2 === 1;
          return (
            <Reveal key={row.heading}>
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div className={cn(imageFirst && "md:order-2")}>
                  <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                    {row.heading}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="mt-4 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
                  />
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-body-ink">
                    {row.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </div>
                <BrandFigure
                  src={row.image}
                  alt={row.alt}
                  className={cn("aspect-[4/3]", imageFirst && "md:order-1")}
                  sizes="(min-width: 768px) 560px, 100vw"
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
