import Link from "next/link";
import { Check, Database, ShieldCheck, Wallet } from "lucide-react";

/**
 * Right-hand visual for inner-page heroes: a nested "tray and plate" card that
 * lists the page's own items, with three small chips floating around it. The
 * chips repeat claims already on the site (see TrustStrip), never new ones.
 * Motion is CSS only (`float-y`) and switches off under reduced motion.
 */
const CHIPS = [
  { Icon: ShieldCheck, label: "BAA before any PHI", pos: "-top-5 left-8", motion: "float-y" },
  { Icon: Database, label: "Inside your EHR", pos: "-right-4 top-1/2", motion: "float-y float-y-b" },
  { Icon: Wallet, label: "You stay the billing provider", pos: "-bottom-5 left-10", motion: "float-y float-y-c" },
] as const;

export function HeroPanel({
  heading,
  items,
}: {
  heading: string;
  items: readonly { label: string; href?: string }[];
}) {
  return (
    <aside aria-label={heading} className="reveal-up reveal-up-3 relative">
      {/* Outer tray */}
      <div className="rounded-[2rem] border border-border/60 bg-card/50 p-2 shadow-[var(--shadow-float)]">
        {/* Inner plate */}
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/70 bg-card p-7 md:p-8">
          <p className="font-serif text-lg font-semibold text-brand-ink">{heading}</p>
          <ul className="mt-5 divide-y divide-border/60">
            {items.map((it) => (
              <li key={it.label} className="py-3">
                {it.href ? (
                  <Link
                    href={it.href}
                    className="group flex items-start gap-3 text-base text-body-ink transition-colors hover:text-brand-ink"
                  >
                    <Check className="mt-1 size-4 shrink-0 text-brand-accent" aria-hidden="true" />
                    {it.label}
                  </Link>
                ) : (
                  <span className="flex items-start gap-3 text-base text-body-ink">
                    <Check className="mt-1 size-4 shrink-0 text-brand-accent" aria-hidden="true" />
                    {it.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {CHIPS.map(({ Icon, label, pos, motion }) => (
        <span
          key={label}
          aria-hidden="true"
          className={`absolute ${pos} ${motion} hidden items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-brand-ink shadow-[var(--shadow-lift)] lg:inline-flex`}
        >
          <Icon className="size-4 text-brand-accent" aria-hidden="true" />
          {label}
        </span>
      ))}
    </aside>
  );
}
