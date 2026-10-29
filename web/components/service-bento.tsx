import Link from "next/link";
import { Activity, ArrowRight, Receipt, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { categoryMeta, servicesByCategory, type ServiceCategory } from "@/lib/services";

/**
 * The three service lines as a bento: care management is the large tile, the
 * other two stack beside it. Each tile lists the real services on its hub page.
 * The tile title is a stretched link; the service links sit above it.
 */
const TILES: { key: ServiceCategory; icon: React.ReactNode; big?: boolean }[] = [
  { key: "rpm", icon: <Activity className="size-5" aria-hidden="true" />, big: true },
  { key: "rcm", icon: <Receipt className="size-5" aria-hidden="true" /> },
  { key: "staffing", icon: <Users className="size-5" aria-hidden="true" /> },
];

export function ServiceBento() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
      {TILES.map(({ key, icon, big }, i) => {
        const meta = categoryMeta[key];
        const services = servicesByCategory(key);
        return (
          <Reveal
            key={key}
            delay={i * 0.08}
            className={big ? "h-full lg:col-span-2 lg:row-span-2" : "h-full"}
          >
            <div className="spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-7 transition-[border-color] duration-300 hover:border-[color:var(--color-teal-500)]/40 md:p-8">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                {icon}
              </span>
              <h3
                className={`mt-5 font-serif font-semibold text-brand-ink ${big ? "text-2xl md:text-3xl" : "text-xl"}`}
              >
                <Link
                  href={meta.href}
                  className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-accent"
                >
                  {meta.label}
                </Link>
              </h3>
              <p className={`mt-3 leading-relaxed text-body-ink ${big ? "max-w-xl text-base" : "text-sm"}`}>
                {meta.blurb}
              </p>
              {big ? (
                <ul className="mt-8 divide-y divide-border/60 border-t border-border/60">
                  {services.map((s) => (
                    <li key={s.slug} className="py-4">
                      <Link
                        href={`/services/${s.slug}`}
                        className="relative z-10 font-medium text-brand-ink underline-offset-4 transition-colors hover:text-brand-accent hover:underline"
                      >
                        {s.name}
                      </Link>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-body-ink">{s.shortDesc}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-6 grid gap-y-2 text-sm">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="relative z-10 text-body-ink underline-offset-4 transition-colors hover:text-brand-accent hover:underline"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-brand-accent">
                Explore {meta.label.toLowerCase()}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
