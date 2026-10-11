import type { ReactNode } from "react";

/**
 * House-style bulleted list item: brand-700 dot, 12px gap, aligned to text
 * leading. Use inside a `<ul class="space-y-3">` (or similar) parent so the
 * caller controls the spacing rhythm for its surface.
 */
export function BulletedListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-700)]"
      />
      <span>{children}</span>
    </li>
  );
}
