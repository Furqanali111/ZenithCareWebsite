import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "CCM ROI Calculator",
  description:
    "Estimate your practice's monthly and annual Medicare Chronic Care Management reimbursement based on eligible patient panel size.",
  path: "/roi-calculator",
});

export default function RoiCalculatorPage() {
  return (
    <PageStub
      eyebrow="Tools"
      title="CCM ROI Calculator"
    >
      <p>
        A client-side calculator will live here. No data is stored or
        transmitted off your browser.
      </p>
    </PageStub>
  );
}
