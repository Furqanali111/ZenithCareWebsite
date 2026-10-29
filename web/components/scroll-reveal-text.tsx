/**
 * A statement whose words light up as it scrolls into view. CSS scroll-driven
 * animation (`.reveal-word` in globals.css): browsers without support, and
 * anyone preferring reduced motion, simply see all the text.
 */
export function ScrollRevealText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="reveal-word">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
