import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DENIAL_BASE, denialCodes, denialPath } from "@/lib/denial-codes";

export const metadata: Metadata = pageMetadata({
  title: "Claim Denial Codes Explained",
  description:
    "Plain-English guide to common claim denial codes (CO-16, CO-18, CO-29, CO-50, CO-97 and more): what they mean, how to fix them and how to prevent them.",
  path: DENIAL_BASE,
  rootOgImage: true,
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Revenue Cycle Management", path: "/services/revenue-cycle-management" },
  { name: "Denial Codes", path: DENIAL_BASE },
];

export default function DenialCodesIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <PageHero
        eyebrow="Revenue Cycle"
        title="Claim denial codes, explained."
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "Revenue cycle services", href: "/services/revenue-cycle-management" }}
      >
        What each common denial code means, what usually causes it, and the
        steps to fix and prevent it. Educational summaries, not billing advice.
        Payer rules vary.
      </PageHero>

      <section className="section-rhythm">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {denialCodes.map((d) => (
              <li key={d.slug}>
                <Link
                  href={denialPath(d.slug)}
                  className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
                >
                  <span className="font-mono text-sm font-medium text-brand-accent">
                    {d.code}
                  </span>
                  <span className="mt-1 font-serif text-base font-semibold text-brand-ink group-hover:text-brand-accent">
                    {d.shortTitle}
                  </span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-body-ink">
                    {d.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
