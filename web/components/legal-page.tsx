import type { ReactNode } from "react";

/**
 * Shared chrome for every legal page (privacy, terms, hipaa-statement,
 * accessibility). The shell is identical across all four — this component
 * is where to edit when the eyebrow styling, header padding, prose
 * overrides, or date-line format need to change.
 *
 * Callers pass the body as children and emit any JSON-LD outside the
 * `<LegalPage>` boundary.
 */
export function LegalPage({
  title,
  lastUpdated,
  effectiveDate,
  children,
}: {
  title: string;
  lastUpdated: string;
  effectiveDate?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-prose px-6 pt-24 pb-20 md:pt-32 md:pb-24">
      <header>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Legal
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {effectiveDate ? (
            <>
              Effective date: {effectiveDate} &middot; Last updated:{" "}
              {lastUpdated}
            </>
          ) : (
            <>Last updated: {lastUpdated}</>
          )}
        </p>
      </header>

      <div className="prose prose-neutral mt-10 max-w-none text-base leading-relaxed text-[color:var(--color-ink-600)] [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[color:var(--color-brand-900)] [&_h2]:tracking-tight [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2 [&_strong]:font-medium [&_strong]:text-[color:var(--color-ink-900)]">
        {children}
      </div>
    </article>
  );
}
