import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — Remote Chronic Care Management`,
  description:
    "Remote Chronic Care Management for U.S. primary care and internal medicine practices. Clinically led, HIPAA-compliant, PharmD-founded.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-[color:var(--color-brand-700)]">
            Chronic Care Management, delivered.
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-6xl">
            Recurring Medicare revenue your practice may not be billing today.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--color-ink-600)]">
            {site.name} runs end-to-end CCM for U.S. primary care and internal
            medicine practices. Clinically led by a PharmD, HIPAA-compliant,
            and built for the Medicare patient panels you already manage.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/roi-calculator">Estimate your ROI</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-xl text-sm text-muted-foreground">
            Representative example: a 200-patient CCM panel at the base code
            ≈ $13,200/month in Medicare reimbursement to the practice. Actual
            results vary by panel composition and billing.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
            A short, focused homepage will land here in Phase 2.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
            This is Phase 1 of the implementation plan — global layout, routes,
            metadata, and the design system are in place; polished sections
            (how it works, services, trust strip, FAQ excerpt) ship next.
          </p>
        </div>
      </section>
    </>
  );
}
