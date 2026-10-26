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
import { DENIAL_BASE, denialCodes, denialPath, getDenial } from "@/lib/denial-codes";
import { getAllPosts } from "@/content/posts";

type Params = { code: string };

// Fully static, SEO-prerendered page (same pattern as /services/[service]).
export const instant = false;

export function generateStaticParams(): Params[] {
  return denialCodes.map((d) => ({ code: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  const d = getDenial(code);
  if (!d) return pageMetadata({ title: "Not found", description: "", noindex: true });
  return pageMetadata({
    title: `${d.code} Denial: ${d.shortTitle}`,
    description: d.metaDescription,
    path: denialPath(d.slug),
  });
}

export default async function DenialCodePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const d = getDenial(code);
  if (!d) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Revenue Cycle Management", path: "/services/revenue-cycle-management" },
    { name: "Denial Codes", path: DENIAL_BASE },
    { name: d.code, path: denialPath(d.slug) },
  ];

  const related = d.related.map((r) => getDenial(r)!);

  // RCM posts only, keeps the silo tight (same tags the RCM service pages use).
  const posts = getAllPosts()
    .filter((p) => p.tags.some((t) => ["rcm", "denials", "medical-billing", "ar"].includes(t)))
    .slice(0, 4);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <PageHero
        eyebrow="Revenue Cycle · Denial code"
        title={`${d.code} denial: ${d.shortTitle}`}
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "AR follow-up service", href: "/services/accounts-receivable" }}
      >
        {d.summary}
        {d.routine
          ? " This is usually a routine adjustment on a paid claim, not a true denial."
          : ""}
      </PageHero>

      <section className="section-rhythm">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <Reveal>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Common causes
            </h2>
            <ul className="mt-6 space-y-3 text-base text-body-ink">
              {d.causes.map((c) => (
                <BulletedListItem key={c}>{c}</BulletedListItem>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              How to fix it
            </h2>
            <ul className="mt-6 space-y-3 text-base text-body-ink">
              {d.fixes.map((c) => (
                <BulletedListItem key={c}>{c}</BulletedListItem>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
            How to prevent it
          </h2>
          <ul className="mt-6 space-y-3 text-base text-body-ink">
            {d.prevention.map((c) => (
              <BulletedListItem key={c}>{c}</BulletedListItem>
            ))}
          </ul>
          <p className="mt-8 text-base leading-relaxed text-body-ink">
            Zenith billers and AR specialists work denials like this inside your
            practice-management system, and your practice stays the billing
            provider. See{" "}
            <Link
              href="/services/accounts-receivable"
              className="font-medium text-brand-accent hover:underline"
            >
              AR follow-up
            </Link>{" "}
            and{" "}
            <Link
              href="/services/medical-billing"
              className="font-medium text-brand-accent hover:underline"
            >
              medical billing
            </Link>
            .
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Educational summary, not billing or legal advice. Payer rules and
            deadlines vary; always check the payer&rsquo;s own policy and the
            remark code on your remittance.
          </p>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-rhythm border-t border-border/60">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Related denial codes
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={denialPath(r.slug)}
                    className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
                  >
                    <span className="font-mono text-sm font-medium text-brand-accent">
                      {r.code}
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

      {posts.length > 0 ? (
        <section className="section-rhythm border-t border-border/60 bg-surface-tint">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Revenue cycle guides
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/resources/${p.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-lg"
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
        heading={`${d.code}: common questions`}
        idPrefix={`denial-${d.slug}-faq`}
        items={d.faqs}
      />

      <section className="border-t border-border/60 bg-surface-tint">
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
                <Link href={DENIAL_BASE}>All denial codes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
