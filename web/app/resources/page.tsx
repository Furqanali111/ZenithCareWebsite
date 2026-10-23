import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { BrandFigure } from "@/components/brand-figure";
import { getAllPosts } from "@/content/posts";

const PATH = "/resources";

export const metadata: Metadata = pageMetadata({
  title: "CCM, Billing & Staffing Guides",
  description:
    "Practical guides on Chronic Care Management, CPT billing, RPM, credentialing, claim denials and virtual medical staffing for U.S. physician practices.",
  path: PATH,
});

export default function ResourcesPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Resources", path: PATH },
        ])}
      />

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-10 md:pt-32 md:pb-14">
        <div className="max-w-2xl">
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium tracking-[0.14em] text-brand-accent">
            Resources
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
            Guides for practices evaluating care management, billing and staffing.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-body-ink md:text-lg">
            Honest, practical writing on Chronic Care Management, billing,
            operations, compliance. Written by Furqan Ali.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every article is written for practice managers and physicians who
            want numbers, not sales copy. Topics include CPT code rates,
            documentation requirements, vendor vetting, and the real cost math
            behind outsourcing clinical staff.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/resources/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
              >
                {post.coverImage ? (
                  <BrandFigure
                    src={post.coverImage}
                    alt={post.title}
                    className="aspect-[16/9] rounded-none border-0"
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="text-brand-accent">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                  <h2 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-brand-ink group-hover:text-brand-accent md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-body-ink">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-brand-accent">
                    Read article →
                  </span>
                  <time
                    dateTime={post.publishedAt}
                    className="mt-5 block text-xs text-muted-foreground"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
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
