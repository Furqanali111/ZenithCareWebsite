import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { denialCodes, getDenial } from "@/lib/denial-codes";

export const alt = "Denial code guide, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return denialCodes.map((d) => ({ code: d.slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const d = getDenial(code);
  if (!d) return ogImage({ title: "Code Not Found" });
  return ogImage({ title: `${d.code} denial: ${d.shortTitle}`, badge: "DENIAL CODE GUIDE" });
}
