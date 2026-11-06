import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "How Zenith remote care management works";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "How Remote Care Management Works",
    subtitle: "Onboarding, daily workflow and reporting, all inside your EHR.",
  });
}
