import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * v3 image: a local photo in its natural color, with a consistent rounded
 * frame + hairline border so images feel like one system without altering the
 * photo itself. Works in light and dark.
 *
 * Local /public images only (CSP img-src 'self'; served via /_next/image).
 * `sizes` defaults to a single-column content width; pass a tighter value for
 * grid thumbnails to avoid over-fetching.
 */
export function BrandFigure({
  src,
  alt,
  className,
  sizes = "(min-width: 768px) 720px, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-muted",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
