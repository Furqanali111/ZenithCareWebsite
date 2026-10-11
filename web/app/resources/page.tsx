import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { getAllPosts } from "@/content/posts";

const PATH = "/resources";

export const metadata: Metadata = pageMetadata({
  title: "Resources",
  description:
    "Articles, guides, and reference material for practices running or evaluating Chronic Care Management.",
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

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-10 md:pt-32 md:pb-14">
        <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-brand-700)]">
          Resources
        </span>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[color:var(--color-brand-900)] md:text-5xl">
          Articles for practices evaluating CCM.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[color:var(--color-ink-600)] md:text-lg">
          Honest, practical writing on Chronic Care Management — billing,
          operations, compliance. Written by Ali Hassan Kaleem, PharmD.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-28">
        <ul className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <Link
                href={`/resources/${post.slug}`}
                className="group block"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
                <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight text-[color:var(--color-brand-900)] group-hover:text-[color:var(--color-brand-700)] md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[color:var(--color-ink-600)]">
                  {post.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-[color:var(--color-brand-700)]">
                  Read article →
                </span>
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
