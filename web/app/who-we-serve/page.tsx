import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { specialties, specialtyLabel } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Who We Serve",
  description:
    "Zenith supports U.S. primary care, internal medicine and geriatric practices with remote care management, revenue cycle services and virtual staffing.",
  path: "/who-we-serve",
  rootOgImage: true,
});

const blurbs = {
  "primary-care":
    "Chronic care management and virtual staff for busy primary care panels.",
  "internal-medicine":
    "Care coordination for complex adult patients with multiple chronic conditions.",
  geriatrics:
    "Longitudinal care management for older adults and Medicare-heavy panels.",
} as const;

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Who We Serve", path: "/who-we-serve" },
];

export default function WhoWeServeIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <PageHero
        title="Built for U.S. physician practices."
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "All services", href: "/services" }}
      >
        Zenith supplies trained clinical and administrative staff to the
        practice. Your practice stays the billing provider. Choose your
        specialty to see the programs that fit.
      </PageHero>

      <section className="section-rhythm border-t border-border/60">
        <div className="mx-auto max-w-[90rem] px-6">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((s, i) => (
              <li key={s}>
                <Reveal delay={i * 0.08} className="h-full">
                  <Link
                    href={`/who-we-serve/${s}`}
                    className="spotlight group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[var(--shadow-lift)]"
                  >
                    <h2 className="font-serif text-lg font-semibold text-brand-ink group-hover:text-brand-accent">
                      {specialtyLabel[s]}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
                      {blurbs[s]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
                      See programs
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
