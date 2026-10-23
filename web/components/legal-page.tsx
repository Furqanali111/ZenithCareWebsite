import type { ReactNode } from "react";

/**
 * Shared chrome for every legal page (privacy, terms, hipaa-statement,
 * accessibility). The shell is identical across all four, this component
 * is where to edit when the eyebrow styling, header padding, prose
 * overrides, or date-line format need to change.
 *
 * Callers pass the body as children and emit any JSON-LD outside the
 * `<LegalPage>` boundary.
 */
export function LegalPage({
  title,
  eyebrow = "Legal",
  lastUpdated,
  effectiveDate,
  children,
}: {
  title: string;
  eyebrow?: string;
  lastUpdated: string;
  effectiveDate?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-prose px-6 pt-24 pb-20 md:pt-32 md:pb-24">
      <header>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-brand-ink md:text-5xl">
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

      <div className="prose prose-neutral mt-10 max-w-none text-base leading-relaxed text-body-ink [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-brand-ink [&_h2]:tracking-tight [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2 [&_a]:text-brand-accent [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-ink [&_strong]:font-medium [&_strong]:text-ink-strong [&_code]:text-ink-strong [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em]">
        {children}
      </div>
    </article>
  );
}
