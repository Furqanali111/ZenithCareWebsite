import type { Metadata } from "next";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { CategoryLanding } from "@/components/category-landing";
import { categoryContent } from "@/lib/categories";

const c = categoryContent.rcm;

export const metadata: Metadata = pageMetadata({
  title: c.metaTitle,
  description: c.metaDescription,
  path: c.path,
});

export default function RevenueCycleManagementPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceLd({ name: c.metaTitle, description: c.metaDescription, path: c.path, serviceType: c.serviceType }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: c.eyebrow, path: c.path },
          ]),
        ]}
      />
      <CategoryLanding category="rcm" />
    </>
  );
}
