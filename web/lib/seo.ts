import type { Metadata } from "next";
import { site } from "./site";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path like "/about". Omit for home. */
  path?: string;
  /** Prevent indexing (used for drafts, 404). */
  noindex?: boolean;
};

/**
 * Build a per-page Metadata object with sensible defaults for SEO.
 * Keep page title short (≤ 60 chars). Keep description 140–160 chars.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, site.url).toString();
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
