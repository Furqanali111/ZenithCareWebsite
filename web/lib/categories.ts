import type { ServiceCategory } from "./services";
import type { ServiceFaq } from "./services";
import type { FeatureRow } from "@/components/feature-rows";
import categoriesFile from "@/content/categories.json";

/**
 * Copy + SEO for the three category landing pages (hubs above the individual
 * /services/<slug> pages). Titles/metas/H1s follow the SEO workbook's Page SEO
 * Map; the service lists themselves are read from the registry at render time.
 * Title, lead, feature rows and FAQs live in content/categories.json (edited in
 * /keystatic); page paths and SEO text stay here. No fabricated claims.
 */
export type CategoryContent = {
  path: string;
  serviceType: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  lead: string;
  /** Alternating image + text feature rows. */
  features: FeatureRow[];
  faqs: ServiceFaq[];
};

export const categoryContent: Record<ServiceCategory, CategoryContent> = {
  rpm: {
    path: "/services/care-management",
    serviceType: "Care Management",
    metaTitle: "Care Management Programs",
    metaDescription:
      "CCM, PCM, RPM, RTM and TCM services for U.S. physician practices. Monthly clinical coordination inside your EHR; you stay the billing provider.",
    ...categoriesFile.rpm,
  },

  rcm: {
    path: "/services/revenue-cycle-management",
    serviceType: "Revenue Cycle Management",
    metaTitle: "Revenue Cycle Management Services",
    metaDescription:
      "Medical billing, coding, credentialing and AR follow-up services for U.S. physician practices. Inside your PM system, more claims collected.",
    ...categoriesFile.rcm,
  },

  staffing: {
    path: "/services/virtual-staffing",
    serviceType: "Virtual Staffing",
    metaTitle: "Virtual Medical Staffing Services",
    metaDescription:
      "Remote medical scribes, schedulers, receptionists, coordinators and virtual assistants for U.S. physician practices. Inside your systems under a BAA.",
    ...categoriesFile.staffing,
  },
};
