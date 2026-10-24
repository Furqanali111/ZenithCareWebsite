import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll-reveal wrapper for below-the-fold content. Fades + lifts its
 * children as they enter the viewport, using a CSS scroll-driven animation
 * (`.reveal-in` in globals.css). No JavaScript, so it ships no client code
 * and cannot delay hydration or the LCP.
 *
 * Browsers without `animation-timeline` support, and users who prefer
 * reduced motion, simply see the content with no animation.
 *
 * `delay` (seconds, as before) staggers siblings by shifting where in the
 * viewport entry the fade starts: 0.08 becomes an 8% later start.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const style = delay
    ? ({ "--reveal-delay": `${Math.round(delay * 100)}%` } as CSSProperties)
    : undefined;

  return (
    <div className={className ? `reveal-in ${className}` : "reveal-in"} style={style}>
      {children}
    </div>
  );
}
