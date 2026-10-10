import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms governing use of the Zenith Care Solutions website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageStub eyebrow="Legal" title="Terms of Service">
      <p>
        Final copy renders from{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
          WebSiteDoc/08-legal-pages-draft.md §2
        </code>{" "}
        after attorney review.
      </p>
    </PageStub>
  );
}
