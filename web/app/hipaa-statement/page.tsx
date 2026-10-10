import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "HIPAA Statement",
  description:
    "Zenith Care Solutions' formal HIPAA posture as a Business Associate.",
  path: "/hipaa-statement",
});

export default function HipaaStatementPage() {
  return (
    <PageStub eyebrow="Legal" title="HIPAA Statement">
      <p>
        Final copy renders from{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
          WebSiteDoc/08-legal-pages-draft.md §3
        </code>{" "}
        after attorney review.
      </p>
    </PageStub>
  );
}
