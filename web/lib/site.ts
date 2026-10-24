/**
 * Site-wide constants. Edit here; propagates everywhere.
 */

export const site = {
  name: "Zenith Care Solutions",
  legalName: "Zenith Care Solutions LLC",
  // Virtual mailing address (mail forwarding), not a physical office: never
  // label it "office" or "headquarters", and keep it out of PostalAddress schema.
  // The Wyoming registered agent address is intentionally not on the site.
  mailingAddress: "30 N Gould St, Suite #70349, Sheridan, WY 82801, USA",
  // Wyoming Secretary of State filing facts (Articles of Organization).
  formation: {
    state: "Wyoming",
    filingId: "2026-002113280",
    formedOn: "October 22, 2026",
  },
  // Empty until the IRS issues the EIN; every consumer renders it only when set.
  ein: process.env.NEXT_PUBLIC_EIN ?? "",
  tagline:
    "Remote care management, revenue cycle management, and virtual medical staffing for U.S. physician practices. HIPAA Business Associate, inside your EHR.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://thezcs.com",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@thezcs.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  // Footer contact block. Phone stays empty until a real line exists (no
  // placeholder number); hours is a plain business fact, override via env.
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? "Mon to Fri, 9:00 AM to 6:00 PM EST",
  linkedin:
    "https://www.linkedin.com/company/zenith-care-solutions",
  locale: "en_US",
} as const;

/**
 * Social profiles for the footer. Only entries with a URL render, so the row
 * shows LinkedIn now and picks up the others once their env vars are set.
 */
export const socials = [
  { label: "LinkedIn", href: site.linkedin },
  { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "" },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "" },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "" },
] as const;

/** Founder identity, shared across home, about, and blog bylines. */
export const founder = {
  name: "Furqan Ali",
  initials: "FA",
  aboutUrl: "/about",
} as const;

/** Founders with the one-line intros used on the homepage and blog bylines. */
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
    intro:
      "Software engineer who has shipped for multiple customers, bringing the same reliability to your practice’s daily work.",
  },
  {
    name: "Muhammad Usman",
    initials: "MU",
    title: "Co-founder",
    credential: "PharmD",
    intro:
      "Doctor of Pharmacy (PharmD) and entrepreneur, turning ambitious ideas into meaningful results.",
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
