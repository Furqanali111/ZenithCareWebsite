import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "CCM Revenue Calculator";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    path: "/roi-calculator",
    title: "CCM Revenue Calculator",
    subtitle: "Estimate Medicare reimbursement for your chronic care management panel.",
    badge: "INTERACTIVE TOOL",
  });
}
