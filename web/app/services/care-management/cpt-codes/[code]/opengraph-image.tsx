import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { cptCodes, getCpt } from "@/lib/cpt-codes";

export const alt = "CPT code guide, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return cptCodes.map((c) => ({ code: c.code }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const c = getCpt(code);
  if (!c) return ogImage({ title: "Code Not Found" });
  return ogImage({ title: `CPT ${c.code}: ${c.shortTitle}`, badge: "CPT CODE GUIDE" });
}
