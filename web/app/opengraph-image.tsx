import { ImageResponse } from "next/og";

export const alt = "Zenith Care Solutions — Remote Chronic Care Management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph card. Pages can override by defining their own
 * `opengraph-image.tsx` next to their `page.tsx`.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: "linear-gradient(135deg, #0B2545 0%, #13315C 100%)",
          color: "#F7F8FA",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            color: "#C9A227",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Zenith Care Solutions
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            Remote Chronic Care Management for U.S. Practices
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#8DA9C4",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Clinically led by a PharmD. HIPAA Business Associate. Built for
            Medicare patient panels.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#8DA9C4",
          }}
        >
          <span style={{ display: "flex" }}>zenithcaresolutions.com</span>
          <span style={{ display: "flex" }}>Primary care · Internal medicine · Geriatrics</span>
        </div>
      </div>
    ),
    size,
  );
}
