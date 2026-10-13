import type { ServiceCategory } from "./services";
import type { ServiceFaq } from "./services";

/**
 * Copy + SEO for the three category landing pages (hubs above the individual
 * /services/<slug> pages). Titles/metas/H1s follow the SEO workbook's Page SEO
 * Map; the service lists themselves are read from the registry at render time.
 * No fabricated claims; eligibility and billing stay qualified.
 */
export type CategoryContent = {
  path: string;
  serviceType: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** "What it is" body, one paragraph per entry. */
  intro: string[];
  faqs: ServiceFaq[];
};

export const categoryContent: Record<ServiceCategory, CategoryContent> = {
  rpm: {
    path: "/services/care-management",
    serviceType: "Care Management",
    metaTitle: "Care Management & Monitoring Services",
    metaDescription:
      "CCM, PCM, RPM, RTM, and TCM support for U.S. medical practices. Zenith delivers the monthly clinical coordination inside your EHR; your practice stays the billing provider.",
    eyebrow: "Care Management & Monitoring",
    title: "Medicare care-management programs, delivered by clinical staff.",
    lead:
      "Five Medicare programs reimburse your practice for coordinating, monitoring, and transitioning patient care: CCM, PCM, RPM, RTM, and TCM. Zenith runs the monthly coordination labor inside your EHR, and your practice bills the CPT codes.",
    intro: [
      "Care management is recurring, between-visit work: monthly outreach, care plans, device and data review, medication reconciliation, and post-discharge follow-up for patients who need steady attention. Medicare reimburses physician practices for it under a set of CPT codes, but most practices run little of it because the labor is hard to staff in-house.",
      "Zenith provides that labor. Our clinical team does the enrollment, monthly contact, documentation, and time tracking inside your system. Your practice remains the billing provider and bills Medicare under its own credentials; Zenith invoices your practice for the care-coordination work. Eligibility is confirmed per patient and per payer at the time of service.",
    ],
    faqs: [
      {
        question: "What is the difference between CCM, PCM, RPM, RTM, and TCM?",
        answer:
          "CCM covers patients with two or more chronic conditions; PCM focuses on a single serious, high-risk condition; RPM reviews data from connected devices like blood-pressure cuffs and glucometers; RTM tracks therapy adherence and musculoskeletal or respiratory status; and TCM covers the 30 days after a hospital discharge. Each has its own eligibility rules and CPT codes.",
      },
      {
        question: "Who bills Medicare, my practice or Zenith?",
        answer:
          "Your practice remains the billing provider and bills Medicare for every CPT code under its own credentials. Zenith works as subcontracted clinical staff under your supervision and invoices your practice for the care-coordination labor. Zenith does not bill Medicare or patients.",
      },
      {
        question: "Can a patient be enrolled in more than one program?",
        answer:
          "Some programs can be combined and some cannot. For example, CCM and PCM cannot both be billed for the same patient in the same month by the same provider. We confirm the right program per patient and check payer rules before enrollment.",
      },
    ],
  },

  rcm: {
    path: "/services/revenue-cycle-management",
    serviceType: "Revenue Cycle Management",
    metaTitle: "Revenue Cycle Management Services",
    metaDescription:
      "Medical billing, coding, provider credentialing, and A/R follow-up for U.S. practices, handled inside your practice-management system. More claims coded right, billed clean, and collected.",
    eyebrow: "Revenue Cycle Management",
    title: "Revenue cycle support that gets more of what you earn collected.",
    lead:
      "Medical billing, coding, provider credentialing, and accounts-receivable follow-up, handled inside your practice-management system, so more of what you earn is coded right, billed clean, and collected.",
    intro: [
      "Revenue cycle management is the end-to-end claims and collections workflow: coding encounters accurately, submitting clean claims, enrolling providers with payers, and following up on unpaid or denied claims. Gaps anywhere in that chain quietly cost a practice money.",
      "Zenith works that chain inside your existing billing or practice-management system, across Medicare, Medicaid, and commercial payers. RCM support is not tied to a condition or patient population; it applies to your practice's overall claims and revenue workflow, for any specialty.",
    ],
    faqs: [
      {
        question: "What does revenue cycle management include?",
        answer:
          "Zenith's revenue cycle support covers medical billing (claim preparation, submission, and payment review), medical coding (ICD-10, CPT, and E/M with compliance review), provider credentialing and payer enrollment, and accounts-receivable follow-up on unpaid, denied, and underpaid claims.",
      },
      {
        question: "Which practices can use RCM support?",
        answer:
          "Any practice, any specialty. Because revenue cycle work applies to your claims rather than to a specific clinical program, it fits primary care, specialty practices, multi-specialty groups, and FQHCs alike.",
      },
      {
        question: "Do you work inside our existing billing system?",
        answer:
          "Yes. Zenith works inside your practice-management or billing system under a signed Business Associate Agreement, rather than moving your data to a separate platform.",
      },
    ],
  },

  staffing: {
    path: "/services/virtual-staffing",
    serviceType: "Virtual Staffing",
    metaTitle: "Virtual Medical Staffing & Administrative Support",
    metaDescription:
      "Remote medical scribes, schedulers, receptionists, patient care coordinators, and virtual assistants for U.S. practices. Trained staff inside your systems, under a BAA, at a flat monthly rate.",
    eyebrow: "Virtual Staffing & Admin Support",
    title: "Remote medical staff who absorb the admin that slows your team down.",
    lead:
      "Trained remote medical professionals, scribes, schedulers, receptionists, patient care coordinators, and virtual assistants, who take the clinical admin off your in-house team, inside your systems, under a signed BAA, at a flat monthly rate.",
    intro: [
      "Virtual staffing is remote people, not software: trained medical professionals who handle the day-to-day operational work every outpatient practice carries, documentation, scheduling, phones, referrals, prior authorizations, and inbox management, so your on-site team stays focused on patients.",
      "Zenith staff work inside your systems under a signed Business Associate Agreement at a flat monthly rate. These roles support any practice, any specialty, because the work is operational rather than tied to a clinical program or patient population.",
    ],
    faqs: [
      {
        question: "What roles can Zenith staff remotely?",
        answer:
          "Medical scribes, medical schedulers, medical receptionists, patient care coordinators, and general virtual assistants. Each role works remotely inside your systems and is matched to your specialty and workflows.",
      },
      {
        question: "How is virtual staffing priced?",
        answer:
          "Virtual staffing is a flat monthly rate per role, not a per-claim or per-patient fee, so the cost is predictable regardless of volume. Exact scope and rate are confirmed during onboarding.",
      },
      {
        question: "Do virtual staff work inside our EHR?",
        answer:
          "Yes. Zenith staff work inside your EHR and other practice systems under a signed Business Associate Agreement. No protected health information is exported to a separate platform.",
      },
    ],
  },
};
