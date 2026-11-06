import Link from "next/link";
import type { Metadata } from "next";
import { CPT_RATES } from "@/lib/roi";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { RoiCalculator } from "@/components/roi-calculator";

const PATH = "/roi-calculator";
const NAME = "CCM ROI Calculator";
const DESCRIPTION =
  "Estimate monthly CCM Medicare reimbursement for your practice based on panel size and enrollment rate. Runs client-side.";

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
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Estimate your CCM reimbursement
          </h1>
          <p className="mt-5 text-base leading-relaxed text-body-ink">
            Two inputs. A representative monthly and annual figure. No data
            leaves your browser, the calculator is entirely client-side.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The estimate uses 2026 national-average Medicare rates for CPT 99490
            (base CCM) and typical add-on utilization. Actual reimbursement
            varies by locality, payer mix, and documentation completeness. Enter
            your eligible patient count and expected enrollment rate to see the
            range for your practice.
          </p>
        </header>
        <div className="mt-10">
          <RoiCalculator />
        </div>

        <div className="mt-16 max-w-prose space-y-10 text-base leading-relaxed text-body-ink">
          <section>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink">
              How the estimate is calculated
            </h2>
            <p className="mt-4">
              Monthly reimbursement is your eligible patients, times the share
              you enroll, times the base CPT 99490 rate of ${CPT_RATES["99490"]}.
              Annual is twelve months of that figure. For example, 200 eligible
              patients at a 50% enrollment rate is 100 enrolled patients, about{" "}
              ${(100 * CPT_RATES["99490"]).toLocaleString("en-US")} a month or{" "}
              ${(100 * CPT_RATES["99490"] * 12).toLocaleString("en-US")} a year.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink">
              What the estimate leaves out
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                Add-on codes such as{" "}
                <Link href="/services/care-management/cpt-codes/99439" className="text-brand-accent underline-offset-4 hover:underline">CPT 99439</Link>
                {" "}and{" "}
                <Link href="/resources/cpt-99487-99489-complex-ccm" className="text-brand-accent underline-offset-4 hover:underline">complex CCM</Link>
                , which can raise revenue per patient.
              </li>
              <li>Local Medicare rates, payer mix, and denied or unbilled months.</li>
              <li>
                What the practice pays for care-coordination labor. Zenith does
                not bill Medicare; your practice does. See{" "}
                <Link href="/pricing" className="text-brand-accent underline-offset-4 hover:underline">pricing</Link>
                {" "}for what Zenith charges.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink">
              Before you rely on the number
            </h2>
            <p className="mt-4">
              Billing needs a consenting, eligible patient and 20 documented
              minutes each month. Read{" "}
              <Link href="/resources/how-ccm-billing-works" className="text-brand-accent underline-offset-4 hover:underline">how CCM billing works</Link>
              {" "}or{" "}
              <Link href="/resources/in-house-vs-outsourced-ccm" className="text-brand-accent underline-offset-4 hover:underline">compare in-house and outsourced CCM</Link>
              , then{" "}
              <Link href="/contact" className="text-brand-accent underline-offset-4 hover:underline">book a 15-minute call</Link>
              {" "}to check the figure against your own panel.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
