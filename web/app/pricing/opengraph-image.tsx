import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Zenith Care Solutions pricing";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "Pricing and Billing Model",
    subtitle: "How each service line is priced, what is included and how billing works.",
  });
}
