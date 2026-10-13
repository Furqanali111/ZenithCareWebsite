import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CategoryLanding } from "@/components/category-landing";
import { categoryContent } from "@/lib/categories";

const c = categoryContent.rpm;

export const metadata: Metadata = pageMetadata({
  title: c.metaTitle,
  description: c.metaDescription,
  path: c.path,
});

export default function CareManagementPage() {
  return <CategoryLanding category="rpm" />;
}
