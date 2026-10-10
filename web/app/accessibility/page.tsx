import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility Statement",
  description:
    "Zenith Care Solutions' commitment to WCAG 2.1 AA accessibility, with a reporting channel for any barriers.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <PageStub eyebrow="Legal" title="Accessibility Statement">
      <p>
        Final copy renders from{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
          WebSiteDoc/08-legal-pages-draft.md §4
        </code>{" "}
        after attorney review.
      </p>
    </PageStub>
  );
}
