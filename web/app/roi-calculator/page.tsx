import type { Metadata } from "next";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { RoiCalculator } from "@/components/roi-calculator";

const PATH = "/roi-calculator";
const NAME = "CCM ROI Calculator";
const DESCRIPTION =
  "Estimate your practice's monthly and annual Medicare Chronic Care Management reimbursement based on eligible patient panel size and expected enrollment. Client-side; nothing is stored.";

export const metadata: Metadata = pageMetadata({
  title: NAME,
  description: DESCRIPTION,
  path: PATH,
});

export default function RoiCalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceLd({
            name: "Chronic Care Management ROI Estimator",
            description: DESCRIPTION,
            path: PATH,
            serviceType: "Chronic Care Management",
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "ROI Calculator", path: PATH },
          ]),
        ]}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <header className="max-w-prose">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Tools
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Estimate your CCM reimbursement
          </h1>
          <p className="mt-5 text-base leading-relaxed text-body-ink">
            Two inputs. A representative monthly and annual figure. No data
            leaves your browser — the calculator is entirely client-side.
          </p>
        </header>
        <div className="mt-10">
          <RoiCalculator />
        </div>
      </section>
    </>
  );
}
