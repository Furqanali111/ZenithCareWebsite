import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Who Zenith Care Solutions serves";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    path: "/who-we-serve",
    title: "Who We Serve",
    subtitle: "Primary care, internal medicine and geriatrics practices across the U.S.",
  });
}
