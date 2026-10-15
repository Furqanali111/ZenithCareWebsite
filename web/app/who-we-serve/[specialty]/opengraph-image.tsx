import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { specialties, specialtyLabel, type Specialty } from "@/lib/site";

export const alt = "Specialty, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return specialties.map((specialty) => ({ specialty }));
}

/** Per-specialty titles. Kept here (not imported from page.tsx) to avoid pulling the full CONTENT record into the OG route. */
const TITLES: Record<Specialty, string> = {
  "primary-care": "Remote Services for Primary Care Practices",
  "internal-medicine": "Remote Services for Internal Medicine Practices",
  geriatrics: "Remote Services for Geriatrics Practices",
};

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty } = await params;
  if (!specialties.includes(specialty as Specialty)) {
    return ogImage({ title: "Specialty Not Found" });
  }
  const label = specialtyLabel[specialty as Specialty];
  return ogImage({
    title: TITLES[specialty as Specialty],
    subtitle: `Care management, RCM, and virtual staffing tailored for ${label.toLowerCase()}.`,
  });
}
