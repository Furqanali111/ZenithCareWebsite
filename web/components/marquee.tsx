import Link from "next/link";

/**
 * Slow CSS marquee of links (CPT codes). The first row is the real, focusable
 * list; the second row only exists to make the loop seamless, so it is hidden
 * from assistive tech and out of the tab order. Pauses on hover and focus;
 * static under reduced motion.
 */
export function Marquee({
  label,
  items,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
}) {
  const row = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className="flex shrink-0 items-center gap-12 pr-12 text-sm font-medium text-muted-foreground"
    >
      {items.map((it) => (
        <li key={it.href} className="whitespace-nowrap">
          <Link
            href={it.href}
            tabIndex={copy ? -1 : undefined}
            className="rounded-sm transition-colors hover:text-brand-accent"
          >
            {it.label}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <nav
      aria-label={label}
      className="marquee overflow-hidden border-b border-border/60 bg-background py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </nav>
  );
}
