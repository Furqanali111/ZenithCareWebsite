import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { headingId } from "@/content/posts";

/** Blocks the editor can insert in a post body (names match keystatic/blog-content.ts). */

export function Callout({ tone, children }: { tone?: string; children: ReactNode }) {
  const warn = tone === "warning";
  return (
    <aside
      className={`not-prose my-8 rounded-xl border px-5 py-4 text-base leading-relaxed text-body-ink [&_p]:my-2 ${
        warn ? "border-amber-500/50 bg-amber-50 dark:bg-amber-950/30" : "border-brand-accent/40 bg-surface-tint"
      }`}
    >
      {children}
    </aside>
  );
}

export function BookCall({ label }: { label?: string }) {
  return (
    <p className="not-prose my-8">
      <Button asChild size="lg">
        <Link href="/contact">{label || "Book a 15-minute call"}</Link>
      </Button>
    </p>
  );
}

export function Toc({ title, items }: { title?: string; items: { id: string; text: string }[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className="not-prose my-8 rounded-xl border border-border/70 px-5 py-4">
      <p className="font-serif text-lg font-semibold text-brand-ink">{title || "On this page"}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="text-brand-accent hover:underline">
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const textOf = (n: ReactNode): string =>
  typeof n === "string" || typeof n === "number"
    ? String(n)
    : Array.isArray(n)
      ? n.map(textOf).join("")
      : n && typeof n === "object" && "props" in n
        ? textOf((n as { props: { children?: ReactNode } }).props.children)
        : "";

/** H2 with an id so the Toc links work. */
export function H2({ children, ...rest }: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 id={headingId(textOf(children)) || undefined} {...rest}>
      {children}
    </h2>
  );
}
