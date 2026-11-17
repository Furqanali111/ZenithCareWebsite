import type { Metadata } from "next";
import { site, founders } from "./site";
import pageSeoFile from "@/content/page-seo.json";
import serviceSeoFile from "@/content/page-seo-services.json";
import structuredFile from "@/content/structured-data.json";
import breadcrumbFile from "@/content/breadcrumb-labels.json";
import globalFile from "@/content/global-seo.json";
import { parseCustomJsonLd } from "./custom-jsonld";
import { applyTitleTemplate } from "./google-snippet";

// Site-wide defaults edited in /keystatic ("Global SEO settings"). Empty image fields save null.
const globalSeo: { titleTemplate: string; defaultDescription: string; defaultSocialImage: string | null; logo: string | null } = globalFile;

/** The <title> for a page: the editor's template with the page title and site name filled in. */
export const fullTitle = (title: string) => applyTitleTemplate(globalSeo.titleTemplate, title, site.name);

// Editor settings from /keystatic: FAQPage schema switched off by path, shorter
// breadcrumb labels by path, extra Organization fields. Empty JSON arrays infer as
// never[], so the files get their real shape here.
const structured: { faqSchemaOff: string[]; organizationPhone: string; organizationSameAs: string[] } = structuredFile;
const crumbFile: { labels: { path: string; label: string }[] } = breadcrumbFile;
const faqOff = new Set(structured.faqSchemaOff);
const crumbLabels = new Map(crumbFile.labels.map((l) => [l.path, l.label]));
export const isFaqOff = (path: string) => faqOff.has(path);
export const crumbLabel = (path: string, name: string) => crumbLabels.get(path) ?? name;

type SeoEntry = {
  title: string;
  description: string;
  ogTitle?: string;
  ogSubtitle?: string;
  noindex?: boolean;
  focusKeyword?: string;
  keywordSynonyms?: string[];
  nofollow?: boolean;
  canonicalUrl?: string | null;
  socialTitle?: string;
  socialDescription?: string;
  socialImage?: string | null;
  /** Main schema.org page type picked in the editor. "default" keeps the type the page's code uses. */
  schemaType?: string;
  /** Extra JSON-LD pasted in the editor, for any other schema.org type. */
  customJsonLd?: string;
};

/** Social-card and robots fields a post carries in its own frontmatter. */
export type SeoExtra = Pick<SeoEntry, "nofollow" | "socialTitle" | "socialDescription" | "socialImage">;

// Titles and descriptions edited in /keystatic (content/page-seo.json and
// content/page-seo-services.json). They win over the text passed in code, which is only
// the fallback for pages with no entry.
const seoByPath = new Map<string, SeoEntry>(
  [...pageSeoFile.pages, ...serviceSeoFile.pages].map((p: SeoEntry & { path: string }) => [p.path, p]),
);

// Custom JSON-LD by page path. A bad value throws here, so it fails the build.
const customByPath = new Map(
  [...seoByPath].filter(([, e]) => e.customJsonLd?.trim()).map(([p, e]) => [p, parseCustomJsonLd(e.customJsonLd ?? "", `page SEO ${p}`)] as const),
);

/** Every page entry edited in /keystatic, for the SEO dashboard. */
const inServiceFile = new Set(serviceSeoFile.pages.map((p) => p.path));
export const pageSeoEntries = [...seoByPath].map(([path, e]) => ({
  ...e,
  path,
  // Which editor singleton holds the entry, for the dashboard's Edit link.
  singleton: inServiceFile.has(path) ? ("serviceSeo" as const) : ("pageSeo" as const),
}));

/** True when the editor ticked "Hide from Google" for this path. Used by the sitemap too. */
export const isNoindexed = (path: string) => !!seoByPath.get(path)?.noindex;

/** Share-card text for a path: the editor's override if set, else the code default. */
export const ogText = (path: string, title: string, subtitle?: string) => {
  const e = seoByPath.get(path);
  return { title: e?.ogTitle || title, subtitle: e?.ogSubtitle || subtitle };
};

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
  /** Overrides the canonical URL (absolute). Posts only. */
  canonical?: string | null;
  /** Use the root /opengraph-image. Needed only for pages with no opengraph-image file of their own. */
  rootOgImage?: boolean;
  /** Social-card and nofollow settings for pages that are not in the page SEO files (posts). */
  extra?: SeoExtra;
};

/**
 * Build a per-page Metadata object with sensible defaults for SEO.
 * Keep title ≤ 60 chars, description 140-160 chars.
 */
export function pageMetadata({
  title: codeTitle,
  description: codeDescription,
  path,
  noindex = false,
  canonical,
  rootOgImage = false,
  extra,
}: PageMetadataInput): Metadata {
  // Only a call that names its path can be edited. The 404 pages pass none (it would
  // default to "/") and must not pick up the home page's text.
  const edited = path === undefined ? undefined : seoByPath.get(path);
  const e = edited ?? extra;
  const title = edited?.title || codeTitle;
  const description = edited?.description || codeDescription || globalSeo.defaultDescription;
  const url = new URL(path ?? "/", site.url).toString();
  const full = fullTitle(title);
  const socialTitle = e?.socialTitle || full;
  const socialDescription = e?.socialDescription || description;
  // A page-level openGraph object drops the root file-based image, so pages
  // without their own opengraph-image file would ship no social preview.
  // The editor's own image wins; the global default only fills pages with no card of their own.
  const rootImage = globalSeo.defaultSocialImage
    ? { url: globalSeo.defaultSocialImage, alt: site.name }
    : { url: "/opengraph-image", width: 1200, height: 630, alt: site.name };
  const images = e?.socialImage ? [{ url: e.socialImage, alt: socialTitle }] : rootOgImage ? [rootImage] : undefined;

  return {
    // `absolute` stops the root layout's `%s | <brand>` template from
    // re-appending the brand, which doubled it (full already has it).
    title: { absolute: full },
    description,
    alternates: { canonical: canonical || edited?.canonicalUrl || url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: socialTitle,
      description: socialDescription,
      locale: site.locale,
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      ...(images && { images }),
    },
    robots: noindex || edited?.noindex ? { index: false, follow: false } : e?.nofollow ? { index: true, follow: false } : undefined,
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

const pageTypeOverride = (path: string) => {
  const t = seoByPath.get(path)?.schemaType;
  return t && t !== "default" ? (t as NonNullable<WebPageLdInput["type"]>) : undefined;
};

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
    logo: abs(globalSeo.logo || "/logo.png"),
    description: site.tagline,
    sameAs: [site.linkedin, site.facebook, site.instagram, ...structured.organizationSameAs],
    // Same @ids the /about page gives each founder.
    founder: founders.map((f) => ref(personId(f.initials))),
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
      ...(structured.organizationPhone && { telephone: structured.organizationPhone }),
      url: `${site.url}/contact`,
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
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage" | "ItemPage" | "ProfilePage";
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
  /** Day the clinical reviewer last checked the page, ISO date. */
  lastReviewed?: string;
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
  lastReviewed,
}: WebPageLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    // The editor's "Page type" wins over the type the page's code passes.
    "@type": pageTypeOverride(path) ?? type,
    "@id": pageId(path),
    url: abs(path),
    name,
    description,
    inLanguage: "en-US",
    isPartOf: ref(WEBSITE_ID),
    publisher: ref(ORG_ID),
    ...(breadcrumb && { breadcrumb: ref(`${abs(path)}#breadcrumb`) }),
    ...(about && { about: ref(about) }),
    // No dangling link to a FAQ node the editor turned off.
    ...(mainEntity && !(mainEntity === faqId(path) && faqOff.has(path)) && { mainEntity: ref(mainEntity) }),
    ...(reviewedBy && { reviewedBy: ref(reviewedBy) }),
    ...(datePublished && { datePublished: withTz(datePublished) }),
    ...(dateModified && { dateModified: withTz(dateModified) }),
    ...(lastReviewed && { lastReviewed }),
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
  about?: { name: string; url?: string | null }[];
  mentions?: { name: string; url?: string | null }[];
  /** Article by default; posts can pick a more specific Article type. */
  type?: "Article" | "BlogPosting" | "NewsArticle" | "TechArticle";
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
  about,
  mentions,
  type = "Article",
}: ArticleLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": type,
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
    ...(about?.length && { about: about.map(thing) }),
    ...(mentions?.length && { mentions: mentions.map(thing) }),
  };
}

const thing = (e: { name: string; url?: string | null }) => ({
  "@type": "Thing",
  name: e.name,
  ...(e.url && { sameAs: e.url }),
});

export function faqPageLd(
  items: { question: string; answer: string }[],
  /** Page path; gives the FAQ an @id the page's WebPage can reference. */
  path?: string,
): JsonLd | null {
  if (path && faqOff.has(path)) return null;
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
  rawItems: { name: string; path: string }[],
): JsonLd {
  const items = rawItems.map((it) => ({ ...it, name: crumbLabel(it.path, it.name) }));
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

export function JsonLd({ data }: { data: JsonLd | null | (JsonLd | null)[] }) {
  // A null node (FAQ schema turned off in the CMS) is skipped.
  const list = Array.isArray(data) ? data.filter(Boolean) : data;
  if (!list) return null;
  // The page's own WebPage node says which path it is, so custom JSON-LD from the editor rides along.
  const page = [list].flat().find((n) => typeof n?.["@id"] === "string" && (n["@id"] as string).endsWith("#webpage") && typeof n.url === "string");
  const extra = page ? (customByPath.get(new URL(page.url as string).pathname) ?? []) : [];
  const nodes = extra.length ? [...[list].flat(), ...extra] : list;
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe; keys/values are not user input.
      // Escape "<" so content containing "</script>" cannot break out.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(nodes).replace(/</g, "\\u003c"),
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
