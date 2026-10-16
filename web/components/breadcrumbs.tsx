import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { name: string; path: string };

/**
 * Visible breadcrumb trail. Renders as an accessible <nav> with aria-label
 * and the current (last) item marked aria-current="page". Pairs with the
 * existing BreadcrumbList JSON-LD emitted separately via breadcrumbLd().
 *
 * Place directly above PageHero or at the top of the page content area.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-6 pt-4"
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className="truncate font-medium text-ink-strong">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="truncate transition-colors hover:text-brand-accent"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
