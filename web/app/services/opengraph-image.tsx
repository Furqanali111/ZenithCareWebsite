import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Services, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "Our Services",
    subtitle: "Care management, revenue cycle management, and virtual staffing for U.S. practices.",
  });
}
