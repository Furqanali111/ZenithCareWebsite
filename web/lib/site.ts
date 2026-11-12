/**
 * Site-wide constants. Edit here; propagates everywhere.
 *
 * Contact details, social links, tagline, footer text and founder intros are
 * edited in /keystatic (content/site.json). Where a NEXT_PUBLIC_* env var also
 * exists, the env var wins when it is set (even to ""); the JSON is the value
 * used otherwise. To hand a value to the CMS, remove its env var.
 */
import siteFile from "@/content/site.json";

export const site = {
  name: "Zenith Care Solutions",
  legalName: "Zenith Care Solutions LLC",
  // Virtual mailing address (mail forwarding), not a physical office: never
  // label it "office" or "headquarters", and keep it out of PostalAddress schema.
  // The Wyoming registered agent address is intentionally not on the site.
  mailingAddress: siteFile.mailingAddress,
  // Filing ID and formation date are intentionally not published on the site.
  formation: {
    state: "Wyoming",
  },
  // Empty until the IRS issues the EIN; every consumer renders it only when set.
  ein: process.env.NEXT_PUBLIC_EIN ?? "",
  tagline: siteFile.tagline,
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://thezcs.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? siteFile.email,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? siteFile.whatsappNumber,
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? siteFile.calendlyUrl,
  // Footer contact block. Phone stays empty until a real line exists (no
  // placeholder number); hours is a plain business fact, override via env.
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? siteFile.phone,
  hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? siteFile.hours,
  linkedin: siteFile.linkedin,
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? siteFile.facebook,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? siteFile.instagram,
  footerBlurb: siteFile.footerBlurb,
  footerDisclaimer: siteFile.footerDisclaimer,
  locale: "en_US",
} as const;

/**
 * Social profiles for the footer. Only entries with a URL render, so the row
 * shows LinkedIn now and picks up the others once their env vars are set.
 */
export const socials = [
  { label: "LinkedIn", href: site.linkedin },
  { label: "Facebook", href: site.facebook },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "" },
  { label: "Instagram", href: site.instagram },
] as const;

/** Founder identity, shared across home, about, and blog bylines. */
export const founder = {
  name: "Furqan Ali",
  initials: "FA",
  aboutUrl: "/about",
} as const;

/** Founders with the one-line intros used on the homepage and blog bylines. */
const introOf = (name: string) =>
  siteFile.founders.find((f) => f.name === name)?.intro ?? "";

export const founders: readonly {
  name: string;
  initials: string;
  title: string;
  intro: string;
  /** Professional credential shown after the name and in Person schema. */
  credential?: string;
}[] = [
  {
    name: founder.name,
    initials: founder.initials,
    title: "Founder",
    intro: introOf(founder.name),
  },
  {
    name: "Muhammad Usman",
    initials: "MU",
    title: "Co-founder",
    credential: "PharmD",
    intro: introOf("Muhammad Usman"),
  },
];

/** Article reviewer: the co-founder with the PharmD (confirmed by the owner). */
export const reviewer = founders[1];

export function whatsappHref(prefill = "Hi Zenith, I'd like to learn about CCM.") {
  const n = site.whatsappNumber.replace(/\D/g, "");
  if (!n) return "#";
  return `https://wa.me/${n}?text=${encodeURIComponent(prefill)}`;
}

export function mailtoHref(subject = "CCM Inquiry") {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}


/** Navigation groups surfaced in the top nav + footer. */
export const nav = {
  whoWeServe: [
    { label: "Primary Care", href: "/who-we-serve/primary-care" },
    { label: "Internal Medicine", href: "/who-we-serve/internal-medicine" },
    { label: "Geriatrics", href: "/who-we-serve/geriatrics" },
  ],
  main: [
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "HIPAA Statement", href: "/hipaa-statement" },
    { label: "Accessibility", href: "/accessibility" },
  ],
} as const;

/** Specialties with static pages under /who-we-serve/[specialty]. */
export const specialties = [
  "primary-care",
  "internal-medicine",
  "geriatrics",
] as const;

export type Specialty = (typeof specialties)[number];

export const specialtyLabel: Record<Specialty, string> = {
  "primary-care": "Primary Care",
  "internal-medicine": "Internal Medicine",
  geriatrics: "Geriatrics",
};

/** Date the reference pages (CPT, denial, service) were last updated. Set by the owner. */
export const CONTENT_UPDATED = "2026-11-01";
