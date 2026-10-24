import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, JsonLd, articleLd, breadcrumbLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BrandFigure } from "@/components/brand-figure";
import { FaqSection } from "@/components/faq-section";
import { FounderMonogram } from "@/components/founder-monogram";
import { Button } from "@/components/ui/button";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/content/posts";
import { reviewer, site } from "@/lib/site";
import { SERVICE_TAGS, getService } from "@/lib/services";
import type { Post } from "@/content/posts";

type Params = { slug: string };

// Fully static, SEO-prerendered page: the whole page depends on `params`, so
// there is no partial shell to stream. Under cacheComponents this declares the
// route blocking instead of requiring a Suspense boundary around the page.
export const instant = false;

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
    title: post.metaTitle ?? post.title,
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
            author: { name: site.name, url: site.url },
            ...(post.coverImage ? { image: new URL(post.coverImage, site.url).toString() } : {}),
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: post.title, path: `/resources/${post.slug}` },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: post.title, path: `/resources/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 pt-8 pb-16 md:pt-12 md:pb-20">
        <header>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-brand-accent">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt !== post.publishedAt ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated{" "}
                  <time dateTime={post.updatedAt}>
                    {formatDate(post.updatedAt)}
                  </time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-body-ink md:text-lg">
            {post.description}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Reviewed by {reviewer.name}, PharmD, co-founder of {site.name}.
          </p>
        </header>

        {post.coverImage ? (
          <BrandFigure
            src={post.coverImage}
            alt={post.title}
            className="mt-10 aspect-[16/8]"
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        ) : null}

        <div
          className="prose prose-neutral dark:prose-invert mt-12 max-w-none
            [&_h2]:font-serif [&_h2]:text-brand-ink [&_h2]:tracking-tight
            [&_h3]:font-serif [&_h3]:text-brand-ink [&_h3]:tracking-tight
            [&_strong]:text-ink-strong
            [&_a]:text-brand-accent hover:[&_a]:text-brand-ink"
        >
          <Component />
        </div>
      </article>

      {post.faqs ? <FaqSection id="post-faq" items={post.faqs} tone="surface" /> : null}

      {/* ─── Author bio ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <FounderMonogram initials={reviewer.initials} name={reviewer.name} />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Reviewed by
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-brand-ink">
                {reviewer.name}, PharmD
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-body-ink">
                {reviewer.intro} Co-founder of Zenith Care Solutions.{" "}
                <Link
                  href="/about"
                  className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
                >
                  More about our team →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related articles ──────────────────────────────────────── */}
      <RelatedArticles post={post} />

      {/* ─── Final CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
          Want to walk through this for your panel?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
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

function RelatedArticles({ post }: { post: Post }) {
  // Rank siblings by shared tags (newest wins ties) so links spread across the
  // library instead of always pointing at the same two newest posts.
  const shared = (p: Post) => p.tags.filter((t) => post.tags.includes(t)).length;
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => shared(b) - shared(a))
    .slice(0, 3);
  // Parent service page: first service whose tags this post carries.
  const serviceSlug = Object.keys(SERVICE_TAGS).find((s) =>
    SERVICE_TAGS[s].some((t) => post.tags.includes(t)),
  );
  const service = serviceSlug ? getService(serviceSlug) : undefined;
  if (related.length === 0 && !service) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      {service ? (
        <p className="mb-10 text-base text-body-ink">
          Related service:{" "}
          <Link
            href={`/services/${service.slug}`}
            className="font-medium text-brand-accent underline underline-offset-4"
          >
            {service.name}
          </Link>
        </p>
      ) : null}
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink">
        Related reading
      </h2>
      <ul className="mt-6 divide-y divide-border">
        {related.map((p) => (
          <li key={p.slug} className="py-5">
            <Link href={`/resources/${p.slug}`} className="group block">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-accent">
                {p.category}
              </p>
              <p className="mt-2 font-serif text-lg font-semibold text-brand-ink group-hover:text-brand-accent">
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
