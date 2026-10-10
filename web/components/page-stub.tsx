import { ReactNode } from "react";

/**
 * Minimal placeholder shell for routes that exist in the IA but will be
 * filled with real copy in Phase 2 of the implementation plan.
 * Delete this component once every stub has been replaced.
 */
export function PageStub({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-prose px-6 py-20 md:py-28">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h1>
      {children ? (
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[color:var(--color-ink-600)]">
          {children}
        </div>
      ) : (
        <p className="mt-6 text-base leading-relaxed text-[color:var(--color-ink-600)]">
          Placeholder — real content lands in Phase 2 of the implementation plan.
        </p>
      )}
    </section>
  );
}
