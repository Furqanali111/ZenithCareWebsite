import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/page-stub";
import { specialties, specialtyLabel, type Specialty } from "@/lib/site";

type Params = { specialty: string };

export function generateStaticParams(): Params[] {
  return specialties.map((specialty) => ({ specialty }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { specialty } = await params;
  if (!isSpecialty(specialty)) return pageMetadata({ title: "Not found", description: "", noindex: true });

  const label = specialtyLabel[specialty];
  return pageMetadata({
    title: `Chronic Care Management for ${label}`,
    description: `Remote Chronic Care Management services for ${label} practices in the U.S. — care coordination, HIPAA-compliant delivery, Medicare reimbursement support.`,
    path: `/who-we-serve/${specialty}`,
  });
}

export default async function WhoWeServePage(
  { params }: { params: Promise<Params> },
) {
  const { specialty } = await params;
  if (!isSpecialty(specialty)) notFound();

  const label = specialtyLabel[specialty];
  return (
    <PageStub
      eyebrow="Who we serve"
      title={`Chronic Care Management for ${label}`}
    />
  );
}

function isSpecialty(value: string): value is Specialty {
  return (specialties as readonly string[]).includes(value);
}
