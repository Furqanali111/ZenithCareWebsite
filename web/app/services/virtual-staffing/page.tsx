import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CategoryLanding } from "@/components/category-landing";
import { categoryContent } from "@/lib/categories";

const c = categoryContent.staffing;

export const metadata: Metadata = pageMetadata({
  title: c.metaTitle,
  description: c.metaDescription,
  path: c.path,
});

// Service + breadcrumb JSON-LD is emitted once by CategoryLanding.
export default function VirtualStaffingPage() {
  return <CategoryLanding category="staffing" />;
}
