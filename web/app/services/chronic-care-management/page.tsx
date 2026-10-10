import type { Metadata } from "next";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";

const PATH = "/services/chronic-care-management";
const NAME = "Chronic Care Management Services";
const DESCRIPTION =
  "Remote Chronic Care Management for U.S. primary care and internal medicine practices — care coordination, documentation, time tracking, and CPT 99490/99439/99487/99489 billing support.";

export const metadata: Metadata = pageMetadata({
  title: NAME,
  description: DESCRIPTION,
  path: PATH,
});

export default function ServicesCCMPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceLd({ name: NAME, description: DESCRIPTION, path: PATH }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: PATH },
            { name: "Chronic Care Management", path: PATH },
          ]),
        ]}
      />
      <PageStub eyebrow="Services" title="Chronic Care Management" />
    </>
  );
}
