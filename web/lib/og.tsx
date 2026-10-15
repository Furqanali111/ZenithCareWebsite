import { ImageResponse } from "next/og";
import { site } from "./site";

/**
 * Shared Open Graph image generator. Every per-page `opengraph-image.tsx`
 * calls this with page-specific copy; the visual treatment stays consistent.
 *
 * Brand v3 "Warm Cyan": deep cyan-ink gradient, warm apricot accent,
 * light cyan secondary text.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type OgInput = {
  /** Primary headline, 2-6 words. */
  title: string;
  /** One-liner under the title. */
  subtitle?: string;
  /** Overrides the bottom-left domain line. */
  badge?: string;
};

export function ogImage({ title, subtitle, badge }: OgInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(145deg, #0b2026 0%, #123038 55%, #155e75 100%)",
          color: "#faf7f2",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 3,
            color: "#5fc7d6",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {site.name}
        </div>

        {/* Center: title + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 26,
                color: "#cde6ec",
                maxWidth: 900,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Bottom: domain + badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            color: "#cde6ec",
          }}
        >
          <span style={{ display: "flex" }}>{new URL(site.url).host}</span>
          {badge ? (
            <span
              style={{
                display: "flex",
                fontSize: 18,
                color: "#db7e4c",
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                fontSize: 18,
                color: "#db7e4c",
                fontWeight: 600,
              }}
            >
              HIPAA Business Associate
            </span>
          )}
        </div>
      </div>
    ),
    ogSize,
  );
}
