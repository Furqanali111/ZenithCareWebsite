import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "HIPAA Compliance",
  description:
    "How Zenith Care Solutions operates as a HIPAA Business Associate — Business Associate Agreements, encrypted communications, Minimum Necessary access.",
  path: "/hipaa-compliance",
});

export default function HipaaCompliancePage() {
  return (
    <PageStub
      eyebrow="Trust & compliance"
      title="HIPAA Compliance"
    >
      <p>
        Zenith operates as a HIPAA Business Associate and signs a BAA with
        every client practice. No PHI is collected through this website.
      </p>
    </PageStub>
  );
}
