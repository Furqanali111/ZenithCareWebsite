import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Care Management Services, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogImage({
    path: "/services/care-management",
    title: "Care Management",
    subtitle: "CCM, PCM, RPM, RTM, and TCM programs delivered by trained remote staff inside your EHR.",
    badge: "CORE SERVICE",
  });
}
