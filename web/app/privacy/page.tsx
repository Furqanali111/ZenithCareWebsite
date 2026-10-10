import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Zenith Care Solutions handles information collected through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageStub eyebrow="Legal" title="Privacy Policy">
      <p>
        Final copy renders from{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
          WebSiteDoc/08-legal-pages-draft.md §1
        </code>{" "}
        after attorney review.
      </p>
    </PageStub>
  );
}
