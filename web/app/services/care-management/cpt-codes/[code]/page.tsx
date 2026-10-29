import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { BulletedListItem } from "@/components/bulleted-list";
import { FaqSection } from "@/components/faq-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  CPT_BASE,
  cptByProgram,
  cptCodes,
  cptPath,
  getCpt,
  programMeta,
} from "@/lib/cpt-codes";
import { SERVICE_TAGS } from "@/lib/services";
import { getAllPosts } from "@/content/posts";

type Params = { code: string };

// Fully static, SEO-prerendered page (same pattern as /services/[service]).
export const instant = false;

export function generateStaticParams(): Params[] {
  return cptCodes.map((c) => ({ code: c.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  const c = getCpt(code);
  if (!c) return pageMetadata({ title: "Not found", description: "", noindex: true });
  return pageMetadata({
    title: `CPT ${c.code}: ${c.shortTitle}`,
    description: c.metaDescription,
    path: cptPath(c.code),
  });
}

export default async function CptCodePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const c = getCpt(code);
  if (!c) notFound();

  const program = programMeta[c.program];
  const programPath = `/services/${program.serviceSlug}`;
  const path = cptPath(c.code);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Care Management", path: "/services/care-management" },
    { name: "CPT Codes", path: CPT_BASE },
    { name: `CPT ${c.code}`, path },
  ];

  // Silo links: same-program siblings first, then explicit pairings, no dupes.
  const related = [
    ...c.pairsWith.map((p) => getCpt(p)!),
    ...cptByProgram(c.program).filter(
      (s) => s.code !== c.code && !c.pairsWith.includes(s.code),
    ),
  ];

  // Posts tagged for this program (same tag source the program page uses).
  const tags = SERVICE_TAGS[program.serviceSlug] ?? [];
  const posts = getAllPosts()
    .filter((p) => tags.some((t) => p.tags.includes(t)))
    .slice(0, 4);

  const facts: [string, string][] = [
    ["Time threshold", c.time],
    ["Who performs it", c.performer],
    ["How often", c.frequency],
    ["Approx. 2026 national rate", c.rate],
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <PageHero
        title={`CPT ${c.code}: ${c.shortTitle}`}
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: `About ${program.label}`, href: programPath }}
      >
        {c.summary}
      </PageHero>

      {/* ─── At a glance ─────────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              CPT {c.code} at a glance
            </h2>
          </Reveal>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-border/70 bg-card p-5"
              >
                <dt className="text-xs font-semibold text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-2 text-base leading-snug text-ink-strong">{v}</dd>
              </div>
            ))}
          </dl>
          {c.conflicts ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {c.conflicts}
            </p>
          ) : null}
        </div>
      </section>

      {/* ─── Requirements + pitfalls ─────────────────────────────────── */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <Reveal>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              What the record needs to show
            </h2>
            <ul className="mt-6 space-y-3 text-base text-body-ink">
              {c.requirements.map((r) => (
                <BulletedListItem key={r}>{r}</BulletedListItem>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Common billing mistakes
            </h2>
            <ul className="mt-6 space-y-3 text-base text-body-ink">
              {c.pitfalls.map((r) => (
                <BulletedListItem key={r}>{r}</BulletedListItem>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ─── Zenith's role (claims hygiene) ──────────────────────────── */}
      <section className="section-rhythm border-t border-border/60">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
            Where Zenith fits
          </h2>
          <p className="mt-4 text-base leading-relaxed text-body-ink">
            Your practice stays the billing provider for CPT {c.code}. Zenith
            supplies trained clinical staff who do the work inside your EHR and
            invoice your practice for the labor. Zenith does not bill Medicare.
            See{" "}
            <Link
              href={programPath}
              className="font-medium text-brand-accent hover:underline"
            >
              {program.label}
            </Link>{" "}
            for how the program runs.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Educational summary, not billing or legal advice. Rates are 2026
            Medicare national averages and vary by locality and payer. Confirm
            current rules in the CMS Physician Fee Schedule and with your
            Medicare Administrative Contractor.
          </p>
        </div>
      </section>

      {/* ─── Related codes (same silo only) ──────────────────────────── */}
      {related.length > 0 ? (
        <section className="section-rhythm border-t border-border/60 bg-surface-tint">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Related {program.label} codes
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.code}>
                  <Link
                    href={cptPath(r.code)}
                    className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-5 transition-[transform,box-shadow,border-color,background-color] hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
                  >
                    <span className="text-sm font-medium text-brand-accent">
                      CPT {r.code}
                    </span>
                    <span className="mt-1 text-sm font-medium leading-snug text-brand-ink group-hover:text-brand-accent">
                      {r.shortTitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ─── Guides (posts tagged for this program) ──────────────────── */}
      {posts.length > 0 ? (
        <section className="section-rhythm border-t border-border/60">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              {program.label} guides
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/resources/${p.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-border/70 bg-card p-5 transition-[transform,box-shadow,border-color,background-color] hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
                  >
                    <ArrowRight
                      className="mt-0.5 size-4 shrink-0 text-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium leading-snug text-brand-ink group-hover:text-brand-accent">
                      {p.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <FaqSection
        heading={`CPT ${c.code}: common questions`}
        idPrefix={`cpt-${c.code}-faq`}
        items={c.faqs}
        tone="surface"
      />

      <section className="border-t border-border/60 bg-background">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Fifteen minutes to see if it fits.
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-sm">
                <Link href={CPT_BASE}>All CPT codes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
