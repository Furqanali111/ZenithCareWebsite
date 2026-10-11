/**
 * Site-wide constants. Edit here; propagates everywhere.
 */

export const site = {
  name: "Zenith Care Solutions",
  tagline:
    "Remote Chronic Care Management for U.S. primary care and internal medicine practices.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenithcaresolutions.com",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "ali@zenithcaresolutions.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  linkedin:
    "https://www.linkedin.com/company/zenith-care-solutions",
  locale: "en_US",
} as const;

/** Founder identity, shared across home, about, and blog bylines. */
export const founder = {
  name: "Ali Hassan Kaleem, PharmD",
  initials: "AHK",
  aboutUrl: "/about",
} as const;

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
  services: [
    {
      label: "Chronic Care Management",
      href: "/services/chronic-care-management",
    },
    {
      label: "Patient Care Coordinator",
      href: "/services/patient-care-coordinator",
    },
  ],
  whoWeServe: [
    { label: "Primary Care", href: "/who-we-serve/primary-care" },
    { label: "Internal Medicine", href: "/who-we-serve/internal-medicine" },
    { label: "Geriatrics", href: "/who-we-serve/geriatrics" },
  ],
  main: [
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
