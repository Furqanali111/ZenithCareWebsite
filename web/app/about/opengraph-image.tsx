import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "About Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "About Zenith Care Solutions",
    subtitle: "Remote care management for U.S. physician practices, delivered inside your EHR.",
  });
}
