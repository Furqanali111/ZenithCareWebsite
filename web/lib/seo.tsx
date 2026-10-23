import type { Metadata } from "next";
import { site } from "./site";

/* --------------------------------------------------------------------------
 * Per-page <Metadata>
 * ------------------------------------------------------------------------ */

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
 * Keep title ≤ 60 chars, description 140-160 chars.
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
    // `absolute` stops the root layout's `%s | <brand>` template from
    // re-appending the brand, which doubled it (fullTitle already has it).
    title: { absolute: fullTitle },
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

/* --------------------------------------------------------------------------
 * JSON-LD helpers
 *
 * Zenith is a B2B services vendor, NOT a medical clinic. We use plain
 * `Organization` (not MedicalBusiness/MedicalOrganization) so Google doesn't
 * treat us as a patient-facing provider. The actual care-coordination
 * offering is modelled as a separate `Service` whose `provider` is this
 * Organization.
 * ------------------------------------------------------------------------ */

type JsonLd = Record<string, unknown>;

const abs = (path: string) => new URL(path, site.url).toString();

export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: abs("/logo.png"),
    description: site.tagline,
    sameAs: [site.linkedin],
    // Services Zenith offers, surfaced so search + AI engines can map the
    // brand to its full offering catalogue across the three service
    // categories (care management, revenue cycle, virtual staffing). Mirrors
    // the /services/* registry.
    knowsAbout: [
      "Chronic Care Management",
      "Principal Care Management",
      "Remote Patient Monitoring",
      "Transitional Care Management",
      "Medical Billing",
      "Medical Coding",
      "Provider Credentialing",
      "Accounts Receivable Management",
      "Virtual Medical Staffing",
      "Medicare care-management billing",
      "HIPAA Business Associate services",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "sales",
      areaServed: "US",
      availableLanguage: ["en"],
    },
  };
}

/**
 * Site-level WebSite node. Gives search + AI engines a single canonical
 * identity for the domain (name, publisher, language). No SearchAction, 
 * the site has no on-site search endpoint, and claiming one Google can't
 * use would be a structured-data error.
 */
export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    description: site.tagline,
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}#organization` },
  };
}

type ServiceLdInput = {
  name: string;
  description: string;
  path: string;
  /** Required so a new service page can't silently inherit the wrong type.
     Use "Chronic Care Management", "Patient Care Coordination", etc. */
  serviceType: string;
};

export function serviceLd({
  name,
  description,
  path,
  serviceType,
}: ServiceLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: abs(path),
    provider: { "@id": `${site.url}#organization` },
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Physician",
    },
  };
}

type PersonLdInput = {
  name: string;
  jobTitle: string;
  path: string;
  /** 1-2 sentence bio for `description`. */
  bio: string;
  /** LinkedIn / Doximity / other canonical profile URLs. */
  sameAs?: string[];
  /** Expertise topics as plain strings. */
  knowsAbout?: string[];
  /** Formal credentials (e.g. "MD", "RN"). */
  hasCredential?: string[];
  /** Portrait image URL, absolute, served from our origin. */
  image?: string;
};

export function personLd({
  name,
  jobTitle,
  path,
  bio,
  sameAs,
  knowsAbout,
  hasCredential,
  image,
}: PersonLdInput): JsonLd {
  const obj: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description: bio,
    url: abs(path),
    worksFor: { "@id": `${site.url}#organization` },
  };
  if (sameAs?.length) obj.sameAs = sameAs;
  if (knowsAbout?.length) obj.knowsAbout = knowsAbout;
  if (image) obj.image = image;
  if (hasCredential?.length) {
    obj.hasCredential = hasCredential.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c,
    }));
  }
  return obj;
}

type ArticleLdInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: { name: string; url?: string };
  image?: string;
};

// Google wants a timezone on Article dates; frontmatter has date-only values.
// shortcut: date-only means midnight UTC; add real times to frontmatter if that matters.
const withTz = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d);

export function articleLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  image,
}: ArticleLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: withTz(publishedAt),
    dateModified: withTz(updatedAt ?? publishedAt),
    author: author.url
      ? { "@type": "Person", name: author.name, url: author.url }
      : { "@type": "Person", name: author.name },
    publisher: { "@id": `${site.url}#organization` },
    mainEntityOfPage: abs(`/resources/${slug}`),
    ...(image ? { image } : {}),
  };
}

export function faqPageLd(
  items: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      // Drop `[label](/path)` link syntax so structured data stays plain text.
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer.replace(/\[([^\]]+)\]\(\/[^)\s]*\)/g, "$1"),
      },
    })),
  };
}

export function breadcrumbLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/* --------------------------------------------------------------------------
 * <JsonLd>, tiny server-component renderer. Use once per page per schema.
 * ------------------------------------------------------------------------ */

export function JsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe; keys/values are not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* --------------------------------------------------------------------------
 * Dev-only self-check, catches shape drift without a test runner.
 * Server-only so HMR / client bundles don't duplicate the console output.
 * ------------------------------------------------------------------------ */

if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
  const org = organizationLd();
  console.assert(org.name === site.name, "organizationLd: name drifted");
  console.assert(typeof org.url === "string", "organizationLd: url missing");

  const svc = serviceLd({
    name: "Test",
    description: "Test",
    path: "/t",
    serviceType: "Chronic Care Management",
  });
  console.assert(svc["@type"] === "Service", "serviceLd: wrong @type");

  const faq = faqPageLd([{ question: "Q?", answer: "A." }]);
  const main = (faq as { mainEntity: unknown[] }).mainEntity;
  console.assert(main.length === 1, "faqPageLd: mainEntity length wrong");

  const bc = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);
  const items = (bc as { itemListElement: { position: number }[] })
    .itemListElement;
  console.assert(
    items[0].position === 1 && items[1].position === 2,
    "breadcrumbLd: positions off",
  );
}
