import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "Chronic Care Management Services",
  description:
    "Remote Chronic Care Management for U.S. primary care and internal medicine practices — care coordination, documentation, time tracking, and CPT 99490/99439/99487/99489 billing support.",
  path: "/services/chronic-care-management",
});

export default function ServicesCCMPage() {
  return (
    <PageStub
      eyebrow="Services"
      title="Chronic Care Management"
    />
  );
}
