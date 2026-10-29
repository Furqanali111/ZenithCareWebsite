"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value` once when it scrolls into view. The server HTML already
 * holds the final figure (so no-JS and crawlers see the real number); the
 * client replays a short climb from 85% of it. Skipped under reduced motion.
 */
export function CountUp({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [n, setN] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const from = Math.round(value * 0.85);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1100, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setN(Math.round(from + (value - from) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-US")}
    </span>
  );
}
