/**
 * Slow CSS marquee of plain text items (CPT codes, service names). Decorative:
 * the list is aria-hidden because the same items are reachable as real links
 * elsewhere. Pauses on hover and focus; static under reduced motion.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const row = (
    <ul className="flex shrink-0 items-center gap-12 pr-12 text-sm font-medium text-muted-foreground">
      {items.map((t) => (
        <li key={t} className="whitespace-nowrap">
          {t}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-hidden="true"
      className="marquee overflow-hidden border-b border-border/60 bg-background py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
