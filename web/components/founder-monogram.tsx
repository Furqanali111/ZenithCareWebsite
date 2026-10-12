/**
 * Placeholder for the founder portrait until the real photo exists
 * (see WebSiteDoc/13-deferred-items.md §1). When the image lands, swap
 * this component for a <next/image> at the same slot — same ring, same
 * aria label, no layout shift.
 */
export function FounderMonogram({
  initials,
  name,
  size = "md",
}: {
  initials: string;
  name: string;
  size?: "md" | "lg";
}) {
  const sizeClasses =
    size === "lg"
      ? "size-40 md:size-48 text-4xl md:text-5xl"
      : "size-32 md:size-40 text-3xl md:text-4xl";
  return (
    <div
      role="img"
      aria-label={name}
      className={`flex shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-900)] text-[color:var(--color-surface-0)] ring-1 ring-[color:var(--color-gold-500)]/45 ring-offset-4 ring-offset-background ${sizeClasses}`}
    >
      <span className="font-serif font-semibold tracking-wide">{initials}</span>
    </div>
  );
}
