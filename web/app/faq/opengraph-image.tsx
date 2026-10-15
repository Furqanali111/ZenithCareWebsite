import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "FAQ, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "Frequently Asked Questions",
    subtitle: "Common questions about remote care management, billing, and compliance.",
  });
}
