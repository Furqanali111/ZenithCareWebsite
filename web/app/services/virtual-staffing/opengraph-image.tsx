import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Virtual Staffing, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    title: "Virtual Staffing",
    subtitle: "Medical scribes, schedulers, receptionists, and care coordinators on demand.",
  });
}
