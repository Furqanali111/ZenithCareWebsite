import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "About Zenith Care Solutions",
  description:
    "Founder-led by Ali Hassan Kaleem, PharmD. A clinically-led partner for U.S. practices scaling Chronic Care Management.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageStub
      eyebrow="About"
      title="Clinically led. Compliance first."
    />
  );
}
