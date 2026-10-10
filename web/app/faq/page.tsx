import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Common questions about Chronic Care Management, billing, HIPAA, and working with Zenith Care Solutions.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <PageStub
      eyebrow="FAQ"
      title="Frequently asked questions"
    >
      <p>
        Full Q&amp;A list renders here from{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
          content/faq.json
        </code>{" "}
        once the content loader lands.
      </p>
    </PageStub>
  );
}
