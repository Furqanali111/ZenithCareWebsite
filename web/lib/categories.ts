import type { ServiceCategory } from "./services";
import type { ServiceFaq } from "./services";
import type { FeatureRow } from "@/components/feature-rows";

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
    title: "Medicare care-management programs, delivered by clinical staff.",
    lead:
      "Five Medicare programs reimburse your practice for coordinating, monitoring, and transitioning patient care: CCM, PCM, RPM, RTM, and TCM. Zenith runs the monthly coordination labor inside your EHR, and your practice bills the CPT codes.",
    features: [
      {
        heading: "Care that happens between the visits",
        body: [
          "Most of what keeps a chronic patient stable happens outside the exam room: the monthly check-in, the medication reconciliation, the care plan kept current. Zenith's clinical team does that work inside your EHR so it actually gets done, and documented to the standard the codes require.",
        ],
        image: "/categories/care-ccm.webp",
        alt: "Clinician on a monthly chronic-care check-in call at a workstation",
      },
      {
        heading: "Device data, reviewed, not ignored",
        body: [
          "Remote monitoring only pays off when someone actually watches the readings. Our team reviews the blood-pressure, glucose, and weight data coming off connected devices, flags what your clinicians need to see, and logs the time the codes require.",
        ],
        image: "/categories/care-rpm.webp",
        alt: "Clinician reviewing remote patient monitoring device data on screen",
      },
      {
        heading: "The 30 days after a discharge, handled",
        body: [
          "Transitional care is a short, high-value window with strict documentation rules. Zenith runs the post-discharge outreach, medication review, and follow-up scheduling so the hand-off is clean and the visit is billable.",
        ],
        image: "/categories/care-tcm.webp",
        alt: "Clinician coordinating a post-discharge transition of care",
      },
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
      "Medical billing, coding, credentialing and AR follow-up services for U.S. physician practices. Inside your PM system, more claims collected.",
    title: "Revenue cycle support that gets more of what you earn collected.",
    lead:
      "Medical billing, coding, provider credentialing, and accounts-receivable follow-up, handled inside your practice-management system, so more of what you earn is coded right, billed clean, and collected.",
    features: [
      {
        heading: "Clean claims, out the door faster",
        body: [
          "A claim that goes out right the first time tends to get paid the first time. Zenith prepares and submits claims inside your practice-management system and reviews every remittance, so fewer claims stall and fewer dollars slip through.",
        ],
        image: "/categories/rcm-billing.webp",
        alt: "Billing specialist preparing medical claims at a desk",
      },
      {
        heading: "Coding that holds up to an audit",
        body: [
          "Under-coding leaves money on the table; over-coding invites a clawback. Our coders work ICD-10, CPT, and E/M with a compliance review built in, so the codes match the documentation in the chart.",
        ],
        image: "/categories/rcm-coding.webp",
        alt: "Medical coder reviewing documentation and code sets",
      },
      {
        heading: "Chase the money you are already owed",
        body: [
          "Unpaid, denied, and underpaid claims do not resolve themselves. Zenith works your accounts-receivable queue, appeals denials, and follows up with payers until aging claims are collected or properly accounted for.",
        ],
        image: "/categories/rcm-ar.webp",
        alt: "Accounts-receivable specialist following up on outstanding claims",
      },
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
    metaTitle: "Virtual Medical Staffing Services",
    metaDescription:
      "Remote medical scribes, schedulers, receptionists, coordinators and virtual assistants for U.S. physician practices. Inside your systems under a BAA.",
    title: "Remote medical staff who absorb the admin that slows your team down.",
    lead:
      "Trained remote medical professionals, scribes, schedulers, receptionists, patient care coordinators, and virtual assistants, who take the clinical admin off your in-house team, inside your systems, under a signed BAA, at a flat monthly rate.",
    features: [
      {
        heading: "Delegate the admin, keep the focus on patients",
        body: [
          "Every outpatient practice carries hours of daily operational work that does not need to sit with your on-site team. Hand scheduling, phones, referrals, prior authorizations, and inbox management to trained remote staff, and let your clinicians stay with patients.",
        ],
        image: "/categories/staffing-assistant.webp",
        alt: "Remote medical assistant handling practice administrative work",
      },
      {
        heading: "Documentation handled while you stay present",
        body: [
          "A remote scribe captures the encounter as it happens, so you are not typing through the visit or finishing notes late at night. You keep your attention on the patient; the chart still gets written.",
        ],
        image: "/categories/staffing-scribe.webp",
        alt: "Remote medical scribe documenting a patient encounter",
      },
      {
        heading: "A front desk that never goes to voicemail",
        body: [
          "Missed calls are missed appointments and missed revenue. Zenith's remote receptionists and schedulers answer, book, confirm, and triage inside your systems, so patients reach a person and your calendar stays full.",
        ],
        image: "/categories/staffing-reception.webp",
        alt: "Remote medical receptionist answering practice calls",
      },
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
