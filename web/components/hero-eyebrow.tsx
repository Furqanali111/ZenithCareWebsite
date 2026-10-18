/**
 * Small uppercase label used sparingly above a page's H1. Taste-skill caps
 * eyebrows at ceil(sections / 3) per page, see WebSiteDoc design review.
 * Prefer this component over inline `<span>` so count audits grep one place.
 */
export function HeroEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-[color:var(--color-brand-50)] px-3 py-1 text-xs font-medium tracking-[0.14em] text-brand-accent dark:border-white/15 dark:bg-white/5">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-[color:var(--color-teal-500)]"
      />
      {children}
    </span>
  );
}
