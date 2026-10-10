import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = pageMetadata({
  title: "Resources",
  description:
    "Articles, guides, and reference material for practices running or evaluating Chronic Care Management.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <PageStub
      eyebrow="Resources"
      title="Articles & guides"
    >
      <p>Blog index renders here once the MDX pipeline lands.</p>
    </PageStub>
  );
}
