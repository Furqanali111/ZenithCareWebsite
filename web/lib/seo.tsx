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
  /** Use the root /opengraph-image. Needed only for pages with no opengraph-image file of their own. */
  rootOgImage?: boolean;
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
  rootOgImage = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, site.url).toString();
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  // A page-level openGraph object drops the root file-based image, so pages
  // without their own opengraph-image file would ship no social preview.
  const images = rootOgImage
    ? [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }]
    : undefined;

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
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images && { images }),
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

// Stable @id helpers: every node gets one so WebPage can link its Service,
// FAQ, breadcrumb and people into a single graph.
export const ORG_ID =`${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
export const serviceId = (path: string) => `${abs(path)}#service`;
export const faqId = (path: string) => `${abs(path)}#faq`;
export const articleId = (slug: string) => `${abs(`/resources/${slug}`)}#article`;
export const personId = (initials: string) =>
  `${abs("/about")}#${initials.toLowerCase()}`;
const pageId = (path: string) => `${abs(path)}#webpage`;
const ref = (id: string) => ({ "@id": id });

export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
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
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.tagline,
    inLanguage: "en-US",
    publisher: ref(ORG_ID),
  };
}

type WebPageLdInput = {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  /** Set false on the home page, which has no BreadcrumbList. */
  breadcrumb?: boolean;
  /** @id of the entity the page is about (e.g. serviceId(path)). */
  about?: string;
  /** @id of the page's primary entity (e.g. faqId(path), articleId(slug)). */
  mainEntity?: string;
  /** @id of the clinical reviewer Person. */
  reviewedBy?: string;
  datePublished?: string;
  dateModified?: string;
};

/**
 * The glue node: one WebPage per URL that points at the page's Service, FAQ,
 * breadcrumb, article and reviewer by @id, so parsers read them as one graph.
 */
export function webPageLd({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumb = true,
  about,
  mainEntity,
  reviewedBy,
  datePublished,
  dateModified,
}: WebPageLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": pageId(path),
    url: abs(path),
    name,
    description,
    inLanguage: "en-US",
    isPartOf: ref(WEBSITE_ID),
    publisher: ref(ORG_ID),
    ...(breadcrumb && { breadcrumb: ref(`${abs(path)}#breadcrumb`) }),
    ...(about && { about: ref(about) }),
    ...(mainEntity && { mainEntity: ref(mainEntity) }),
    ...(reviewedBy && { reviewedBy: ref(reviewedBy) }),
    ...(datePublished && { datePublished: withTz(datePublished) }),
    ...(dateModified && { dateModified: withTz(dateModified) }),
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
    "@id": serviceId(path),
    name,
    description,
    serviceType,
    url: abs(path),
    provider: ref(ORG_ID),
    mainEntityOfPage: ref(pageId(path)),
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Physician",
    },
  };
}

type PersonLdInput = {
  /** @id; use personId(initials) so other pages can reference this person. */
  id?: string;
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
  id,
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
    "@id": id ?? `${abs(path)}#person`,
    name,
    jobTitle,
    description: bio,
    url: abs(path),
    worksFor: ref(ORG_ID),
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
    "@id": articleId(slug),
    headline: title,
    description,
    inLanguage: "en-US",
    datePublished: withTz(publishedAt),
    dateModified: withTz(updatedAt ?? publishedAt),
    // Articles are drafted by the company and reviewed by the PharmD co-founder,
    // so the author is the Organization, not a named person.
    author: { "@type": "Organization", name: author.name, ...(author.url ? { url: author.url } : {}) },
    publisher: ref(ORG_ID),
    mainEntityOfPage: ref(pageId(`/resources/${slug}`)),
    ...(image ? { image } : {}),
  };
}

export function faqPageLd(
  items: { question: string; answer: string }[],
  /** Page path; gives the FAQ an @id the page's WebPage can reference. */
  path?: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path && { "@id": faqId(path) }),
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
    "@id": `${abs(items[items.length - 1].path)}#breadcrumb`,
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
      // Escape "<" so content containing "</script>" cannot break out.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
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

  const wp = webPageLd({ path: "/t", name: "T", description: "T", about: serviceId("/t") });
  console.assert(
    (wp.about as { "@id": string })["@id"] === svc["@id"],
    "webPageLd: about must match serviceLd @id",
  );

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
