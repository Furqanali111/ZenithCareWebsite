import type { ReactNode } from "react";

/**
 * A three-column bento that always fills its rows. The first tile spans two
 * columns; if the last row would be short, the final tile stretches to close
 * it. Below `lg` it is a plain stack (two columns from `sm`).
 * Static class names so Tailwind can see them.
 */
export function BentoGrid({ tiles, className = "" }: { tiles: ReactNode[]; className?: string }) {
  const n = tiles.length;
  const pad = n > 1 ? (3 - ((n + 1) % 3)) % 3 : 0; // cells missing from the last row
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {tiles.map((tile, i) => {
        let span = "";
        if (i === 0 && n > 1) span = "lg:col-span-2";
        else if (i === n - 1 && pad === 1) span = "lg:col-span-2";
        else if (i === n - 1 && pad === 2) span = "lg:col-span-3";
        return (
          <div key={i} className={`h-full ${span}`}>
            {tile}
          </div>
        );
      })}
    </div>
  );
}
