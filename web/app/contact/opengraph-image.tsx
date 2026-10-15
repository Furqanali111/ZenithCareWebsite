import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Contact Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "Book a Discovery Call",
    subtitle: "15 minutes to see how remote care management fits your practice.",
    badge: "FREE CONSULTATION",
  });
}
