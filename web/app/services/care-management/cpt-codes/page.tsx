import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CPT_BASE, cptByProgram, cptPath, programMeta, type CptProgram } from "@/lib/cpt-codes";

export const metadata: Metadata = pageMetadata({
  title: "Care Management CPT Codes Guide",
  description:
    "Plain-English guide to the Medicare CPT codes behind CCM, PCM, RPM and TCM: time thresholds, documentation, 2026 rates and common billing mistakes.",
  path: CPT_BASE,
  rootOgImage: true,
});

const PROGRAMS: CptProgram[] = ["ccm", "pcm", "rpm", "tcm"];

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Care Management", path: "/services/care-management" },
  { name: "CPT Codes", path: CPT_BASE },
];

export default function CptCodesIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <PageHero
        eyebrow="Care Management"
        title="CPT codes for Medicare care management, explained."
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "Care management programs", href: "/services/care-management" }}
      >
        Time thresholds, documentation and common billing mistakes for the codes
        behind CCM, PCM, RPM and TCM. Your practice bills these codes; Zenith
        supplies the clinical staff time. Educational summaries, not billing
        advice.
      </PageHero>

      {PROGRAMS.map((p, i) => {
        const meta = programMeta[p];
        return (
          <section
            key={p}
            className={`section-rhythm border-t border-border/60 ${i % 2 ? "bg-surface-tint" : ""}`}
          >
            <div className="mx-auto max-w-7xl px-6">
              <Reveal className="max-w-2xl">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                  {meta.label}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  <Link
                    href={`/services/${meta.serviceSlug}`}
                    className="font-medium text-brand-accent hover:underline"
                  >
                    How the {meta.label} program works
                  </Link>
                </p>
              </Reveal>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cptByProgram(p).map((c) => (
                  <li key={c.code}>
                    <Link
                      href={cptPath(c.code)}
                      className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
                    >
                      <span className="font-mono text-sm font-medium text-brand-accent">
                        CPT {c.code}
                      </span>
                      <span className="mt-1 font-serif text-base font-semibold text-brand-ink group-hover:text-brand-accent">
                        {c.shortTitle}
                      </span>
                      <span className="mt-2 flex-1 text-sm leading-relaxed text-body-ink">
                        {c.time}
                      </span>
                      <span className="mt-3 font-mono text-sm text-muted-foreground">
                        {c.rate}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
