import Link from "next/link";

/**
 * Renders an FAQ answer string, turning `[label](/path)` into an internal
 * link. Plain text answers pass through unchanged. JSON-LD uses the same
 * string with the link syntax stripped (see `plainAnswer` in lib/seo.tsx).
 */
export function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\(\/[^)\s]*\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/);
        return m ? (
          <Link
            key={i}
            href={m[2]}
            className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
          >
            {m[1]}
          </Link>
        ) : (
          part
        );
      })}
    </>
  );
}
