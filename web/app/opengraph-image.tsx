import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Zenith Care Solutions, Care Management, RCM and Virtual Staffing";
export const size = ogSize;
export const contentType = ogContentType;

/** Default OG card. Pages override with their own opengraph-image.tsx. */
export default function OpenGraphImage() {
  return ogImage({
    title: "Care Management, RCM & Virtual Staffing",
    subtitle: "HIPAA-compliant remote clinical services for U.S. practices.",
  });
}
