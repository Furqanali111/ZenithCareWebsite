import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Zenith Care Solutions guides";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    path: "/resources",
    title: "CCM, Billing and Staffing Guides",
    subtitle: "Practical guides for U.S. physician practices.",
  });
}
