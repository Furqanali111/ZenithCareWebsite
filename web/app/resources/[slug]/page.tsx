import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, JsonLd, articleLd, breadcrumbLd } from "@/lib/seo";
import { FounderMonogram } from "@/components/founder-monogram";
import { Button } from "@/components/ui/button";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/content/posts";
import { founder, site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return pageMetadata({ title: "Not found", description: "", noindex: true });
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/resources/${post.slug}`,
  });
}


export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { Component } = post;

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            title: post.title,
            description: post.description,
            slug: post.slug,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            author: { name: founder.name, url: `${site.url}${founder.aboutUrl}` },
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: post.title, path: `/resources/${post.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <header>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/resources" className="hover:text-[color:var(--color-brand-700)]">
              ← All articles
            </Link>
          </nav>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-[color:var(--color-brand-700)]">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[color:var(--color-brand-900)] md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[color:var(--color-ink-600)] md:text-lg">
            {post.description}
          </p>
        </header>

        <div
          className="prose prose-neutral mt-12 max-w-none
            [&_h2]:font-serif [&_h2]:text-[color:var(--color-brand-900)] [&_h2]:tracking-tight
            [&_h3]:font-serif [&_h3]:text-[color:var(--color-brand-900)] [&_h3]:tracking-tight
            [&_strong]:text-[color:var(--color-ink-900)]
            [&_a]:text-[color:var(--color-brand-700)] hover:[&_a]:text-[color:var(--color-brand-900)]"
        >
          <Component />
        </div>
      </article>

      {/* ─── Author bio ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-[color:var(--color-surface-50)]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <FounderMonogram initials={founder.initials} name={founder.name} />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Written by
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-[color:var(--color-brand-900)]">
                {founder.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-600)]">
                Clinical pharmacist with oncology / BMT background. Founder
                of Zenith Care Solutions.{" "}
                <Link
                  href="/about"
                  className="text-[color:var(--color-brand-700)] underline underline-offset-2 hover:text-[color:var(--color-brand-900)]"
                >
                  More about Ali →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related articles ──────────────────────────────────────── */}
      <RelatedArticles currentSlug={post.slug} />

      {/* ─── Final CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--color-brand-900)] md:text-4xl">
          Want to walk through this for your panel?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
          Fifteen minutes on the calendar. We&rsquo;ll confirm your eligible
          patient count, run the per-code math, and tell you honestly
          whether Zenith is a fit.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">Book a 15-minute call</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/roi-calculator">Estimate your ROI</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 2);
  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--color-brand-900)]">
        Related reading
      </h2>
      <ul className="mt-6 divide-y divide-border">
        {related.map((p) => (
          <li key={p.slug} className="py-5">
            <Link href={`/resources/${p.slug}`} className="group block">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
                {p.category}
              </p>
              <p className="mt-2 font-serif text-lg font-semibold text-[color:var(--color-brand-900)] group-hover:text-[color:var(--color-brand-700)]">
                {p.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
function formatDate(iso: string): string {
  return DATE_FMT.format(new Date(iso));
}
