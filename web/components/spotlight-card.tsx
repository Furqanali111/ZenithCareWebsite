"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * A card with a soft cyan light that follows the pointer (see `.spotlight` in
 * globals.css). Pointer devices only; touch and keyboard users see a plain
 * card. The light is behind the content and never changes layout.
 */
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
