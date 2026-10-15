import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "HIPAA Compliance, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "HIPAA Compliance",
    subtitle: "Our security posture, BAA process, and data protection commitments.",
    badge: "COMPLIANCE",
  });
}
