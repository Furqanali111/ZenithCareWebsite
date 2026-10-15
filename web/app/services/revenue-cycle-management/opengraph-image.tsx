import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Revenue Cycle Management, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "Revenue Cycle Management",
    subtitle: "Medical billing, coding, credentialing, and AR follow-up for U.S. providers.",
  });
}
