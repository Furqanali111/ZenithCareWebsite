/**
 * Route transition. Next re-mounts this wrapper on every navigation, so the
 * CSS `page-enter` animation (see globals.css) replays each time the user
 * changes pages, a subtle fade-and-settle. CSS/paint-driven (no client JS,
 * no hydration gate) and neutralized under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
