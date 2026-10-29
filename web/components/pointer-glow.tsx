"use client";

import { useEffect } from "react";

/**
 * One pointer listener for the whole site. Any element with the `spotlight`
 * class (see globals.css) gets --mx / --my set to the pointer position inside
 * it, which drives its soft light and glowing edge. Pointer devices only;
 * nothing renders and nothing changes layout.
 */
export function PointerGlow() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element | null)?.closest?.(".spotlight, .spotlight-edge") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
