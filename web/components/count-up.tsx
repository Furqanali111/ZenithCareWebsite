"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows `value`. The server HTML already holds the final figure (so no-JS and
 * crawlers see the real number). On first scroll into view it climbs from 85%
 * of the value; afterwards, whenever `value` changes, it eases to the new one.
 * Under reduced motion it just shows the value.
 */
export function CountUp({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [n, setN] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => {
        shown.current = value;
        setN(value);
      });
      return () => cancelAnimationFrame(raf);
    }
    const tween = (from: number, to: number, ms: number) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / ms, 1);
        const v = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
        shown.current = v;
        setN(v);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (started.current) {
      tween(shown.current, value, 320);
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      started.current = true;
      tween(Math.round(value * 0.85), value, 1100);
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
