import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  noindex: true,
});

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-prose flex-col items-start justify-center px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-body-ink">
        The link may be out of date, or the page has moved. Here are a few
        places that will almost certainly help.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services/chronic-care-management">Services</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact</Link>
        </Button>
      </div>
    </section>
  );
}
