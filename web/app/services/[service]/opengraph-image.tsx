import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { getService, getServiceSlugs, categoryMeta } from "@/lib/services";

export const alt = "Service detail, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getServiceSlugs().map((service) => ({ service }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const s = getService(service);
  if (!s) return ogImage({ title: "Service Not Found" });

  const cat = categoryMeta[s.category];
  return ogImage({
    title: s.metaTitle,
    badge: cat.label.toUpperCase(),
  });
}
