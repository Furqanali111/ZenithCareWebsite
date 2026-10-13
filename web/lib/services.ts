/**
 * Service-line registry, single source of truth for the /services/[service]
 * pages, the services overview, the nav mega-menu, and the sitemap.
 *
 * Three categories:
 *   - "rpm"      → Care Management (Medicare care-management programs: CCM, PCM, RPM, RTM, TCM)
 *   - "rcm"      → Revenue Cycle Management (billing, coding, credentialing, A/R)
 *   - "staffing" → Virtual Staffing & Admin Support (remote medical roles)
 *
 * Narrative copy is Zenith's own, from the approved Service Page Copy document.
 * Each service carries its own four-item trust strip (so billing/coding/
 * credentialing pages no longer show CCM's CPT codes). Reimbursement figures
 * are 2026 Medicare national averages and vary by locality, kept qualified per
 * the project's claims-hygiene rules. No PHI, no fabricated stats.
 */

export type ServiceCategory = "rpm" | "staffing" | "rcm";

export const categoryMeta: Record<
  ServiceCategory,
  { label: string; blurb: string; href: string }
> = {
  rpm: {
    label: "Care Management",
    blurb: "Medicare care-management programs: CCM, PCM, RPM, RTM & TCM",
    href: "/services#remote-patient-monitoring",
  },
  staffing: {
    label: "Virtual Staffing & Admin Support",
    blurb: "Scribes, schedulers, receptionists, coordinators & assistants",
    href: "/services#virtual-staffing",
  },
  rcm: {
    label: "Revenue Cycle Management",
    blurb: "Medical billing, coding, credentialing & A/R follow-up",
    href: "/services#revenue-cycle-management",
  },
};

/** Lucide icon keys used by the capability cards (mapped in feature-grid.tsx). */
export type IconKey =
  | "phone"
  | "phone-call"
  | "clipboard-list"
  | "clipboard-check"
  | "pill"
  | "users"
  | "file-signature"
  | "heart-pulse"
  | "activity"
  | "line-chart"
  | "bell"
  | "monitor"
  | "calendar-check"
  | "calendar-days"
  | "user-plus"
  | "file-text"
  | "folder-open"
  | "messages-square"
  | "shield-check"
  | "headset"
  | "keyboard"
  | "arrow-left-right";

export type Capability = { icon: IconKey; title: string; body: string };
export type HowStep = { title: string; body: string };
export type BillingCode = { code: string; covers: string; rate: string };
export type ServiceFaq = { question: string; answer: string };

export type Service = {
  slug: string;
  category: ServiceCategory;
  /** short code shown in the full name, e.g. "CCM" (care programs only). */
  code?: string;
  /** Full menu + page name, e.g. "Chronic Care Management (CCM)". */
  name: string;
  /** One-line description for the mega-menu and overview cards. */
  shortDesc: string;
  /** Hero. */
  title: string;
  lead: string;
  /** Per-service trust strip (4 labels) shown under the hero. */
  trust: string[];
  /** Capability card grid. */
  capabilitiesHeading: string;
  capabilitiesSubtitle: string;
  capabilities: Capability[];
  /** 3-step "how it works" flow. */
  howItWorks: HowStep[];
  /** Care-management extras. */
  billing?: BillingCode[];
  billingNote?: string;
  revenue?: { value: string; note: string };
  /** SEO. */
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  /** Per-service contact prefills: footer email subject + WhatsApp message. */
  emailSubject: string;
  whatsappMessage: string;
  /** Who We Serve: which practices can offer this, and who can be billed. */
  eligiblePractices: string;
  billablePatients: string;
  faqs: ServiceFaq[];
};

/* -------------------------------------------------------------------------- */
/* Care Management, Medicare care-management programs (CCM/PCM/RPM/RTM/TCM)    */
/* -------------------------------------------------------------------------- */

// Shared Who-We-Serve eligibility for the RCM and staffing categories: every
// service in each category uses the same practice list and billing note.
const RCM_ELIGIBLE_PRACTICES =
  "Any practice, any specialty. Includes, without limitation, Family Medicine, Internal Medicine, Geriatrics, Cardiology, Endocrinology, Pulmonology, Nephrology, Neurology, Orthopedics, Physical Therapy, Pain Management, OB-GYN, Dermatology, Behavioral Health and Psychiatry, Urgent Care, Pediatrics, multi-specialty groups, and FQHCs.";
const RCM_BILLABLE =
  "Not a patient-enrolled program. Revenue-cycle work applies to your existing claims across all payers (Medicare, Medicaid, and commercial insurance), not to specific enrolled patients.";
const STAFFING_ELIGIBLE_PRACTICES =
  "Any practice, any specialty. These roles support the day-to-day operations every outpatient practice has, regardless of the conditions it treats. Includes, without limitation, Family Medicine, Internal Medicine, Geriatrics, Cardiology, Endocrinology, Pulmonology, Nephrology, Neurology, Orthopedics, Physical Therapy, Pain Management, OB-GYN, Dermatology, Behavioral Health and Psychiatry, Urgent Care, Pediatrics, multi-specialty groups, and FQHCs.";
const STAFFING_BILLABLE =
  "Not applicable. Virtual staffing is operational and administrative support for the practice itself, not a billable patient-care program.";

const RPM_SERVICES: Service[] = [
  {
    slug: "chronic-care-management",
    category: "rpm",
    code: "CCM",
    name: "Chronic Care Management (CCM)",
    shortDesc: "Recurring monthly coordination for patients with 2+ chronic conditions.",
    title:
      "Chronic Care Management that turns your highest-need patients into recurring revenue.",
    lead:
      "CCM is a Medicare program for patients living with two or more chronic conditions expected to last twelve months or longer. Zenith delivers the monthly coordination calls, care plans, and documentation these patients need, so your practice earns recurring reimbursement without adding staff workload.",
    trust: [
      "Clinical oversight on every account",
      "HIPAA Business Associate",
      "Documentation inside your EHR",
      "CPT 99490 / 99439 / 99487 / 99491",
    ],
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Trained clinical staff, working inside your EHR.",
    capabilities: [
      { icon: "phone", title: "Monthly care calls", body: "Structured check-ins with each enrolled patient on medications, symptoms, and follow-up." },
      { icon: "clipboard-list", title: "Care plan management", body: "Comprehensive, patient-specific care plans created and kept current in your EHR." },
      { icon: "pill", title: "Medication reconciliation", body: "Review and reconcile medications across every prescriber the patient sees." },
      { icon: "users", title: "Specialist coordination", body: "Close the loop with specialists and outside providers between visits." },
      { icon: "file-signature", title: "Audit-ready documentation", body: "Time logs and notes that meet CMS requirements, inside your system." },
      { icon: "clipboard-check", title: "Eligibility review", body: "We run your panel against documented diagnoses to find who already qualifies." },
    ],
    billing: [
      { code: "99490", covers: "First 20 min/month of clinical staff time", rate: "~$62" },
      { code: "99439", covers: "Each additional 20 minutes", rate: "~$47" },
      { code: "99487 / 99489", covers: "Complex CCM, 60+ min, high decision-making", rate: "higher" },
      { code: "99491 / 99437", covers: "Time personally performed by the physician", rate: "higher" },
    ],
    revenue: {
      value: "$13,200 / mo",
      note: "Representative: a 200-patient panel billing the base code alone. Actual results vary by locality and payer.",
    },
    howItWorks: [
      { title: "Find & enroll eligible patients", body: "We run your panel for patients with 2+ chronic conditions, confirm Medicare Part B, and obtain documented consent." },
      { title: "Deliver monthly coordination", body: "Our clinical team spends 20+ minutes per patient on calls, care plans, and medication reconciliation, inside your EHR." },
      { title: "You bill, Zenith invoices", body: "Your practice bills CPT 99490 and add-ons; we invoice for the clinical labor. Monthly and predictable." },
    ],
    metaTitle: "Chronic Care Management (CCM) Services",
    metaDescription:
      "Remote Chronic Care Management for U.S. practices. Zenith delivers monthly CCM coordination, care plans, and CPT 99490 documentation inside your EHR. Your practice bills; we deliver.",
    serviceType: "Chronic Care Management",
    emailSubject: "CCM Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about CCM.",
    eligiblePractices:
      "Family Medicine, Internal Medicine, Geriatric Medicine, and General Practice.",
    billablePatients:
      "Medicare Part B patients with two or more chronic conditions expected to last 12 months or longer (for example hypertension, diabetes, COPD, chronic kidney disease, depression, or arthritis). The patient must provide documented consent.",
    faqs: [
      { question: "Who bills Medicare for CCM, my practice or Zenith?", answer: "Your practice remains the billing provider and bills Medicare for every CPT code. Zenith works as subcontracted clinical staff under your supervision and invoices your practice for the care-coordination labor. Zenith does not bill Medicare or patients." },
      { question: "Which patients qualify for Chronic Care Management?", answer: "Patients with two or more chronic conditions expected to last at least twelve months, enrolled in Medicare Part B, with documented consent and a care plan on file. A large share of most primary-care, internal-medicine, and geriatric panels qualifies." },
      { question: "Does CCM add work for my staff?", answer: "No. Zenith's clinical team does the monthly outreach, documentation, and time tracking inside your EHR, so your in-house staff stays focused on visits." },
    ],
  },
  {
    slug: "principal-care-management",
    category: "rpm",
    code: "PCM",
    name: "Principal Care Management (PCM)",
    shortDesc: "Focused monthly management for one serious, high-risk condition.",
    title:
      "Principal Care Management for the patient whose one condition needs close watching.",
    lead:
      "Some of your highest-risk patients do not have a long problem list. They have one serious condition, often managed with a specialist, that can send them to the hospital if it slips. Zenith clinical staff deliver monthly PCM outreach inside your EHR, so that one condition gets steady attention between visits. Your practice stays the billing provider.",
    trust: [
      "Clinical oversight on every account",
      "HIPAA Business Associate",
      "Documentation inside your EHR",
      "CPT 99424 / 99425 / 99426 / 99427",
    ],
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Focused, single-condition management with clinical oversight.",
    capabilities: [
      { icon: "clipboard-check", title: "Eligibility screening", body: "We find patients with one qualifying high-risk condition and confirm coverage." },
      { icon: "clipboard-list", title: "Condition-focused care plan", body: "A plan built around the single condition, with goals your provider signs." },
      { icon: "phone", title: "Monthly outreach", body: "Calls and messages that check symptoms, readings and understanding." },
      { icon: "users", title: "Specialist coordination", body: "We keep the specialist, the pharmacy and your office on the same page." },
      { icon: "pill", title: "Medication support", body: "Reconciliation and adherence follow-up for the drugs tied to that condition." },
      { icon: "file-signature", title: "Time logs and notes", body: "Audit-ready documentation in your EHR every month." },
    ],
    billing: [
      { code: "99424", covers: "First 30 min/month, physician or QHP time", rate: "~$88" },
      { code: "99425", covers: "Each additional 30 minutes, physician/QHP", rate: "~$61" },
      { code: "99426", covers: "First 30 min/month, clinical staff", rate: "~$68" },
      { code: "99427", covers: "Each additional 30 minutes, clinical staff", rate: "~$54" },
    ],
    billingNote:
      "PCM and CCM can't be billed for the same patient in the same month by the same provider, but a specialist can bill PCM for one condition while the patient's PCP separately bills CCM for others.",
    revenue: {
      value: "~$68-$88 / mo",
      note: "Per enrolled patient, depending on who performs the time. Figures are 2026 national averages and vary by locality.",
    },
    howItWorks: [
      { title: "Find the right patients", body: "We review your panel for patients with one serious condition who are not being managed under another monthly program." },
      { title: "Deliver monthly management", body: "Clinical staff spend the required time each month on that condition and document it." },
      { title: "You bill, Zenith invoices", body: "Your practice bills the PCM codes. Zenith invoices you for the clinical labor." },
    ],
    metaTitle: "Remote Principal Care Management (PCM)",
    metaDescription:
      "Remote Principal Care Management for U.S. practices. Monthly care management for patients with one serious, high-risk condition. HIPAA Business Associate, inside your EHR.",
    serviceType: "Principal Care Management",
    emailSubject: "PCM Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about Principal Care Management.",
    eligiblePractices:
      "Cardiology, Endocrinology, Pulmonology, Nephrology, Neurology, and other specialty practices managing one dominant condition; also usable by Primary Care and Internal Medicine for a single high-risk condition.",
    billablePatients:
      "Medicare Part B patients with one complex, high-risk chronic condition expected to last at least 3 months. It cannot be billed for the same patient, in the same month, alongside CCM by the same provider.",
    faqs: [
      { question: "How is PCM different from CCM?", answer: "CCM is built for patients with two or more chronic conditions. PCM is built for patients with one complex, high-risk condition." },
      { question: "Can a patient be in PCM and another program in the same month?", answer: "It depends on the codes and the billing provider. Your billing lead checks combinations against current CMS rules before any claim goes out." },
      { question: "Who bills for PCM?", answer: "Your practice bills. Zenith supplies the clinical labor and invoices you." },
    ],
  },
  {
    slug: "remote-patient-monitoring",
    category: "rpm",
    code: "RPM",
    name: "Remote Patient Monitoring (RPM)",
    shortDesc: "Turn connected-device data into monthly recurring revenue.",
    title:
      "Remote Patient Monitoring that turns home readings into timely care.",
    lead:
      "Blood pressure cuffs and glucose meters only help if someone watches the numbers. Zenith staff onboard patients to their devices, review readings, and call when something drifts, so your provider hears about problems days before the next visit. Your practice stays the billing provider.",
    trust: [
      "Clinician-reviewed device data",
      "HIPAA Business Associate",
      "Readings flow into your EHR",
      "CPT 99453 / 99454 / 99457 / 99458",
    ],
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Device data watched, patients engaged, documentation done.",
    capabilities: [
      { icon: "clipboard-check", title: "Patient selection", body: "Identify patients whose conditions benefit from home monitoring." },
      { icon: "monitor", title: "Device onboarding", body: "Walk each patient through setup, connection and first readings." },
      { icon: "line-chart", title: "Daily data review", body: "Check incoming readings against thresholds your provider sets." },
      { icon: "bell", title: "Out-of-range follow-up", body: "Call patients when readings cross the line and escalate per protocol." },
      { icon: "phone", title: "Monthly interactive time", body: "Documented live contact with patients about their readings." },
      { icon: "file-signature", title: "Billing-ready records", body: "Reading counts and time logs organized for the month." },
    ],
    billing: [
      { code: "99453", covers: "Initial device setup & patient education (once per device)", rate: "~$20" },
      { code: "99454", covers: "Device supply, 16+ days of data in 30 days", rate: "~$52/mo" },
      { code: "99445", covers: "New for 2026: device supply, 2-15 days of data", rate: "~$52/mo" },
      { code: "99457", covers: "First 20 min/month of monitoring & management", rate: "~$52" },
      { code: "99458", covers: "Each additional 20 minutes", rate: "varies" },
      { code: "99470", covers: "New for 2026: 10-19 minutes of management time", rate: "lower" },
    ],
    revenue: {
      value: "$150-$200+ / mo",
      note: "Per enrolled patient, combining device-supply and management codes. Representative; actual results vary.",
    },
    howItWorks: [
      { title: "Set the thresholds", body: "Your provider orders monitoring and sets the alert limits for each patient." },
      { title: "Onboard and monitor", body: "We set up the patient, confirm readings arrive, and review them on a regular schedule." },
      { title: "Escalate and document", body: "Concerning readings go to your clinician fast, and every contact is logged for billing." },
    ],
    metaTitle: "Remote Patient Monitoring (RPM) Services",
    metaDescription:
      "Remote Patient Monitoring for U.S. practices. Device setup, daily data review and patient outreach handled by clinical staff inside your EHR. HIPAA-compliant.",
    serviceType: "Remote Patient Monitoring",
    emailSubject: "RPM Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about Remote Patient Monitoring.",
    eligiblePractices:
      "Cardiology, Endocrinology, Pulmonology, Nephrology, Primary Care, and Internal Medicine, any practice using connected devices such as blood-pressure cuffs, glucometers, pulse oximeters, and weight scales.",
    billablePatients:
      "Medicare Part B patients with at least one acute or chronic condition warranting monitoring, an established provider relationship, and written consent on file.",
    faqs: [
      { question: "Does Zenith supply the devices?", answer: "Device arrangements vary by practice. We confirm whether you use your own vendor or an existing platform during scoping." },
      { question: "What readings are required to bill?", answer: "RPM billing depends on a minimum number of days with transmitted readings in the month, plus documented interactive time. Your billing lead confirms the current rules." },
      { question: "Who responds to urgent readings?", answer: "Our staff follow your escalation protocol and reach your clinician. Emergencies are directed to emergency services." },
    ],
  },
  {
    slug: "remote-therapeutic-monitoring",
    category: "rpm",
    code: "RTM",
    name: "Remote Therapeutic Monitoring (RTM)",
    shortDesc: "Monitor therapy adherence and functional status remotely.",
    title:
      "Remote Therapeutic Monitoring for patients whose recovery happens at home.",
    lead:
      "Therapy plans, respiratory care and pain programs succeed or fail between appointments. RTM tracks whether patients are doing the work and how they are responding, such as therapy adherence, pain levels and function. Zenith staff collect and review that data, then reach out when progress stalls. Your practice stays the billing provider.",
    trust: [
      "Clinician-reviewed workflows",
      "HIPAA Business Associate",
      "Data reviewed inside your EHR",
      "CPT 98975 / 98977 / 98980 / 98981",
    ],
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Adherence and functional data, watched and acted on.",
    capabilities: [
      { icon: "clipboard-check", title: "Patient enrollment", body: "Identify and onboard patients suited to therapeutic monitoring." },
      { icon: "activity", title: "Adherence tracking", body: "Watch exercise, medication or therapy-use data from the monitoring tool." },
      { icon: "line-chart", title: "Symptom and pain trends", body: "Review patient-reported pain, function and response over time." },
      { icon: "phone", title: "Treatment-management contact", body: "Documented live contact to keep patients on plan." },
      { icon: "bell", title: "Provider alerts", body: "Flag stalled progress or worsening symptoms to your clinician." },
      { icon: "file-signature", title: "Monthly documentation", body: "Clear logs of data days and management time." },
    ],
    billing: [
      { code: "98975", covers: "Initial setup & patient education", rate: "~$22" },
      { code: "98976", covers: "Respiratory monitoring device supply, 16-30 days", rate: "~$47/mo" },
      { code: "98977", covers: "Musculoskeletal device supply, 16-30 days", rate: "~$40/mo" },
      { code: "98984 / 98985", covers: "New for 2026: short-window supply, 2-15 days", rate: "varies" },
      { code: "98980", covers: "First 20 min/month of treatment management", rate: "varies" },
      { code: "98981 / 98979", covers: "Additional / lower-threshold (10-19 min) management", rate: "varies" },
    ],
    billingNote:
      "RPM tracks physiological vitals (blood pressure, glucose); RTM tracks therapeutic and functional data (pain, range of motion, adherence), and can be billed by therapists, not just physicians and mid-levels.",
    revenue: {
      value: "~$90-$150 / mo",
      note: "Per enrolled patient. Figures are 2026 national averages and vary by locality.",
    },
    howItWorks: [
      { title: "Define what to track", body: "Your clinician chooses the therapy goals and the data to monitor." },
      { title: "Monitor and engage", body: "Staff review data and contact patients who fall behind." },
      { title: "Report and bill", body: "You receive organized monthly records, bill the codes, and Zenith invoices for the labor." },
    ],
    metaTitle: "Remote Therapeutic Monitoring (RTM) Services",
    metaDescription:
      "Remote Therapeutic Monitoring for U.S. practices. Track therapy adherence, pain and function between visits with clinical staff working inside your EHR.",
    serviceType: "Remote Therapeutic Monitoring",
    emailSubject: "RTM Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about Remote Therapeutic Monitoring.",
    eligiblePractices:
      "Orthopedics, Physical Therapy / PM&R, Pain Management, and Pulmonology. Also billable by physical, occupational, and speech therapists, not just physicians.",
    billablePatients:
      "Patients needing respiratory or musculoskeletal monitoring, pain management, or therapy-adherence tracking, using an FDA-defined device or software as a medical device, with documented consent.",
    faqs: [
      { question: "How is RTM different from RPM?", answer: "RPM tracks physiologic readings like blood pressure. RTM tracks non-physiologic data such as therapy adherence, pain and function." },
      { question: "Which patients are a fit?", answer: "Typically musculoskeletal, respiratory and pain patients on a defined treatment plan. Your clinician decides who is appropriate." },
      { question: "What tools do patients need?", answer: "A device or app suited to the plan. We confirm the setup with you during scoping." },
    ],
  },
  {
    slug: "transitional-care-management",
    category: "rpm",
    code: "TCM",
    name: "Transitional Care Management (TCM)",
    shortDesc: "Close the gap in the critical 30 days after hospital discharge.",
    title: "Transitional Care Management that closes the gap after discharge.",
    lead:
      "The days after a hospital stay are when patients are most likely to be readmitted. TCM has strict deadlines, and missing them means missing both the care and the claim. Zenith staff make the post-discharge contact on time, reconcile medications and get the follow-up visit booked. Your practice stays the billing provider.",
    trust: [
      "Clinical medication reconciliation",
      "HIPAA Business Associate",
      "Documentation inside your EHR",
      "CPT 99495 / 99496",
    ],
    capabilitiesHeading: "What Zenith handles per episode",
    capabilitiesSubtitle:
      "The time-sensitive post-discharge work, tracked so nothing is missed.",
    capabilities: [
      { icon: "clipboard-check", title: "Discharge tracking", body: "Find out when your patients are admitted and discharged." },
      { icon: "phone-call", title: "Two-business-day contact", body: "Reach the patient or caregiver within the required window." },
      { icon: "pill", title: "Medication reconciliation", body: "Compare discharge medicines with the current list and flag differences." },
      { icon: "folder-open", title: "Discharge record review", body: "Gather and organize the summary for your provider." },
      { icon: "calendar-check", title: "Follow-up visit scheduling", body: "Book the face-to-face visit within the required timeframe." },
      { icon: "users", title: "Community referrals", body: "Arrange home health, equipment and support services." },
    ],
    billing: [
      { code: "99495", covers: "Moderate complexity, face-to-face visit within 14 days", rate: "~$220" },
      { code: "99496", covers: "High complexity, face-to-face visit within 7 days", rate: "~$299" },
    ],
    billingNote:
      "Only one TCM code is billed per patient per 30-day period. The interactive contact within two business days of discharge is mandatory: miss that window and the episode isn't billable at all.",
    revenue: {
      value: "$220-$299 / episode",
      note: "One of Medicare's highest-paying care-management codes. Figures are 2026 national averages and vary by locality.",
    },
    howItWorks: [
      { title: "Catch the discharge", body: "We monitor admission and discharge notices and open a TCM case." },
      { title: "Contact, reconcile, schedule", body: "Required outreach and medication work happen inside the deadline." },
      { title: "Document and bill", body: "Your practice bills TCM after the visit. Zenith invoices for the labor." },
    ],
    metaTitle: "Transitional Care Management (TCM) Services",
    metaDescription:
      "Remote Transitional Care Management for U.S. practices. Timely post-discharge outreach, medication reconciliation and visit scheduling handled by clinical staff inside your EHR.",
    serviceType: "Transitional Care Management",
    emailSubject: "TCM Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about Transitional Care Management.",
    eligiblePractices:
      "Hospitalist and Hospital Medicine groups, Cardiology, Primary Care, and Internal Medicine, any practice managing patients immediately after hospital discharge.",
    billablePatients:
      "Patients recently discharged from an acute care hospital, inpatient psychiatric unit, skilled nursing facility, or long-term care hospital, returning to the community. Requires contact within 2 business days of discharge and a face-to-face visit within 7 to 14 days depending on complexity.",
    faqs: [
      { question: "What are the TCM deadlines?", answer: "Interactive contact is due within two business days of discharge. The face-to-face visit is due within 7 or 14 days depending on complexity." },
      { question: "Does TCM replace CCM?", answer: "They can serve the same patient at different times, but billing overlap rules apply. Your billing lead confirms combinations before claims." },
      { question: "How do you learn about discharges?", answer: "Through your hospital feeds, notifications and patient contact. We map your sources during setup." },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Revenue Cycle Management, billing, coding, credentialing, A/R             */
/* -------------------------------------------------------------------------- */

const RCM_SERVICES: Service[] = [
  {
    slug: "medical-billing",
    category: "rcm",
    name: "Medical Billing",
    shortDesc: "Clean claims out the door and paid, with fewer days in A/R.",
    title: "Medical billing that gets your claims paid, faster.",
    lead:
      "A Zenith biller prepares, scrubs and submits your claims, posts payments and works denials inside your practice-management system. More of what you earn lands, with fewer days sitting in accounts receivable. Your practice stays the billing provider; Zenith does the billing labor.",
    trust: [
      "HIPAA Business Associate",
      "BAA signed before access",
      "Role-based access in your system",
      "Flat monthly rate",
    ],
    capabilitiesHeading: "What a Zenith biller handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "file-text", title: "Claim preparation and submission", body: "Scrub and submit clean claims from your system." },
      { icon: "keyboard", title: "Charge entry", body: "Accurate charges so claims go out complete the first time." },
      { icon: "clipboard-check", title: "Payment posting", body: "Post ERAs and EOBs and reconcile against expected payment." },
      { icon: "bell", title: "Denial management", body: "Work, correct and resubmit denied claims before they age out." },
      { icon: "shield-check", title: "Eligibility and benefits", body: "Verify coverage to prevent front-end denials." },
      { icon: "file-signature", title: "Patient statements", body: "Generate statements and follow up on balances." },
    ],
    howItWorks: [
      { title: "Scope the work", body: "We map your specialties, payers and practice-management system." },
      { title: "Match and onboard", body: "We place a biller with role-based access under a signed BAA." },
      { title: "Bill and reconcile", body: "Your biller submits claims, posts payments and works denials in your system." },
    ],
    metaTitle: "Remote Medical Billing Services",
    metaDescription:
      "Remote medical billing for U.S. practices. Zenith billers submit clean claims, post payments and work denials inside your practice-management system. HIPAA-compliant, flat monthly rate.",
    serviceType: "Medical Billing",
    emailSubject: "Medical Billing Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Medical Billing service.",
    eligiblePractices: RCM_ELIGIBLE_PRACTICES,
    billablePatients: RCM_BILLABLE,
    faqs: [
      { question: "Does Zenith bill Medicare directly?", answer: "No. Your practice stays the billing provider. Zenith staff prepare and submit claims from your system under your accounts." },
      { question: "What systems do billers work in?", answer: "Your existing practice-management and EHR platform. We confirm compatibility when scoping." },
      { question: "How is medical billing priced?", answer: "A flat monthly rate based on scope, shared in your scoping call." },
    ],
  },
  {
    slug: "medical-coding",
    category: "rcm",
    name: "Medical Coding",
    shortDesc: "Accurate CPT/ICD-10 coding that protects revenue and compliance.",
    title: "Medical coding that matches what you documented and what you can defend.",
    lead:
      "Under-coding leaves money behind, and over-coding invites audits. Zenith coders read the chart, assign the codes the documentation supports and flag gaps back to your provider before the claim goes out. The result is cleaner claims and fewer coding denials. Your practice stays the billing provider.",
    trust: [
      "Pharmacist-supervised review",
      "HIPAA Business Associate",
      "Coding done inside your EHR",
      "ICD-10-CM / CPT / HCPCS",
    ],
    capabilitiesHeading: "What a Zenith coder handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "clipboard-list", title: "Diagnosis coding", body: "Assign ICD-10-CM codes to the level of specificity the chart supports." },
      { icon: "file-text", title: "Procedure and E/M coding", body: "Select CPT and level-of-service codes from the documentation." },
      { icon: "messages-square", title: "Documentation queries", body: "Ask providers to clarify unclear or incomplete notes." },
      { icon: "shield-check", title: "Risk-adjustment capture", body: "Make sure documented chronic conditions are coded accurately." },
      { icon: "clipboard-check", title: "Coding audits", body: "Review samples for accuracy and report patterns." },
      { icon: "keyboard", title: "Code updates", body: "Apply annual code set changes to your workflow." },
    ],
    howItWorks: [
      { title: "Define your specialty and volume", body: "We learn your visit types, templates and payers." },
      { title: "Code from the chart", body: "Coders work in your EHR and send queries through your agreed channel." },
      { title: "Review and improve", body: "You receive accuracy feedback and common documentation gaps." },
    ],
    metaTitle: "Remote Medical Coding Services",
    metaDescription:
      "Remote medical coding for U.S. practices. Accurate ICD-10, CPT and E/M coding from charts inside your EHR, with compliance review. HIPAA-compliant.",
    serviceType: "Medical Coding",
    emailSubject: "Medical Coding Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Medical Coding service.",
    eligiblePractices: RCM_ELIGIBLE_PRACTICES,
    billablePatients: RCM_BILLABLE,
    faqs: [
      { question: "Will coders change my documentation?", answer: "No. Coders assign codes from what is documented and send queries when something is unclear. Providers make any chart changes." },
      { question: "Do you code for specific specialties?", answer: "We scope by specialty, with focus on primary care, internal medicine and geriatrics." },
      { question: "How is accuracy measured?", answer: "Through periodic audit samples shared with your team." },
    ],
  },
  {
    slug: "provider-credentialing",
    category: "rcm",
    name: "Provider Credentialing",
    shortDesc: "Get and stay enrolled with payers, without the paperwork drag.",
    title: "Credentialing that gets your providers enrolled and keeps them that way.",
    lead:
      "A provider who is not enrolled cannot bill, and every week of delay is revenue you cannot recover. Zenith handles the paperwork, the follow-up calls and the deadlines for new providers, new locations and renewals, so approvals do not stall in someone's inbox. Your practice stays in control of every application.",
    trust: [
      "HIPAA Business Associate",
      "Sensitive provider data handled under a BAA",
      "Single point of contact per file",
      "Medicare, Medicaid and commercial payers",
    ],
    capabilitiesHeading: "What a Zenith credentialing specialist handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "file-signature", title: "Payer enrollment applications", body: "Prepare and submit applications to Medicare, Medicaid and commercial plans." },
      { icon: "folder-open", title: "CAQH profile management", body: "Build and keep the profile complete, attested and current." },
      { icon: "calendar-check", title: "License and document tracking", body: "Monitor expirations for licenses, DEA, malpractice and board certifications." },
      { icon: "phone-call", title: "Application follow-up", body: "Chase payers on a set schedule until a decision arrives." },
      { icon: "clipboard-check", title: "Revalidation and recredentialing", body: "Track due dates so enrollment never lapses." },
      { icon: "arrow-left-right", title: "Group and location changes", body: "Handle additions, terminations and address updates." },
    ],
    howItWorks: [
      { title: "Collect and verify", body: "We gather provider documents and check them against payer requirements." },
      { title: "Submit and follow up", body: "Applications go out and each file is followed until approved." },
      { title: "Maintain", body: "We track renewals and updates so your enrollment stays active." },
    ],
    metaTitle: "Provider Credentialing and Payer Enrollment",
    metaDescription:
      "Remote provider credentialing and payer enrollment for U.S. practices. Applications, CAQH upkeep and revalidation tracked from start to approval. HIPAA-compliant.",
    serviceType: "Provider Credentialing",
    emailSubject: "Credentialing Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about Provider Credentialing.",
    eligiblePractices: RCM_ELIGIBLE_PRACTICES,
    billablePatients: RCM_BILLABLE,
    faqs: [
      { question: "How long does credentialing take?", answer: "Timelines vary widely by payer and application quality. We give a realistic range per payer during scoping and do not promise a fixed date." },
      { question: "Do you need our login credentials?", answer: "We work through delegated access where payers allow it, so your providers keep ownership of their accounts." },
      { question: "Can you help with a provider who is already enrolled?", answer: "Yes. Many practices start with a cleanup of expiring documents and upcoming revalidations." },
    ],
  },
  {
    slug: "accounts-receivable",
    category: "rcm",
    name: "Accounts Receivable (AR)",
    shortDesc: "Work down aging A/R and recover what's owed.",
    title: "Accounts receivable follow-up that recovers the money still owed to you.",
    lead:
      "Claims that sit unpaid for 60, 90 or 120 days rarely resolve themselves. Zenith staff work your aging report from oldest to newest, call payers, correct and appeal denials, and tell you why money is stuck. You see fewer old claims and a clearer picture of where revenue leaks.",
    trust: [
      "HIPAA Business Associate",
      "Works inside your billing system",
      "Weekly aging reports",
      "Flat monthly rate",
    ],
    capabilitiesHeading: "What a Zenith A/R specialist handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "line-chart", title: "Aging report review", body: "Prioritize claims by age, balance and likelihood of payment." },
      { icon: "phone-call", title: "Payer follow-up", body: "Call and use payer portals to get status and next steps." },
      { icon: "bell", title: "Denial appeals", body: "Prepare corrected claims and appeals within payer deadlines." },
      { icon: "clipboard-check", title: "Underpayment checks", body: "Compare payments with contracted rates and flag shortfalls." },
      { icon: "messages-square", title: "Patient balance follow-up", body: "Handle statements and balance outreach with respect." },
      { icon: "clipboard-list", title: "Root-cause reporting", body: "Show which denial reasons and payers repeat." },
    ],
    howItWorks: [
      { title: "Baseline your AR", body: "We review your aging report and set priorities with you." },
      { title: "Work the claims", body: "Staff follow up, correct and appeal on a steady schedule." },
      { title: "Report and prevent", body: "You receive progress reports and fixes for repeat denial causes." },
    ],
    metaTitle: "Accounts Receivable (AR) Follow-Up Services",
    metaDescription:
      "Remote accounts receivable follow-up for U.S. practices. Work aged claims, appeals and unpaid balances to recover revenue. HIPAA-compliant and flat monthly rate.",
    serviceType: "Accounts Receivable Management",
    emailSubject: "AR Follow-Up Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Accounts Receivable follow-up service.",
    eligiblePractices: RCM_ELIGIBLE_PRACTICES,
    billablePatients: RCM_BILLABLE,
    faqs: [
      { question: "Is this the same as medical billing?", answer: "Billing covers submitting claims and posting payments. AR follow-up focuses on collecting claims that are already late or denied. Many practices use both." },
      { question: "Do you work old claims?", answer: "Yes, within each payer's timely-filing and appeal limits. We tell you early which claims are still recoverable." },
      { question: "How do you report progress?", answer: "With regular aging summaries and a list of denial causes, shared on the schedule agreed during setup." },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Virtual Staffing & Admin Support, remote medical roles                    */
/* -------------------------------------------------------------------------- */

const STAFFING_SERVICES: Service[] = [
  {
    slug: "medical-scribe",
    category: "staffing",
    name: "Medical Scribe",
    shortDesc: "Real-time clinical documentation so providers can focus on patients.",
    title: "A medical scribe so your providers can stop charting at night.",
    lead:
      "Documentation is the work that follows providers home. A Zenith scribe drafts the visit note in your EHR from the encounter, in your templates and your style, and the provider reviews and signs. Your clinicians spend more time with patients and less time catching up on charts.",
    trust: [
      "HIPAA Business Associate",
      "Trained in medical terminology",
      "Works in your EHR and templates",
      "Provider reviews and signs every note",
    ],
    capabilitiesHeading: "What a Zenith scribe handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "keyboard", title: "Visit note drafting", body: "Capture history, exam and plan in your template." },
      { icon: "folder-open", title: "Chart preparation", body: "Pull prior notes, labs and medication lists before the visit." },
      { icon: "clipboard-list", title: "Order and referral staging", body: "Queue orders for the provider to approve." },
      { icon: "file-signature", title: "Patient instructions", body: "Prepare after-visit summaries from the provider's plan." },
      { icon: "clipboard-check", title: "Template and preference learning", body: "Match each provider's phrasing and workflow." },
      { icon: "calendar-check", title: "Same-day completion", body: "Drafts ready for review without a backlog." },
    ],
    howItWorks: [
      { title: "Learn your style", body: "We review your templates and note preferences for each provider." },
      { title: "Scribe the encounter", body: "The scribe documents in real time or from recorded workflow, as your policy allows." },
      { title: "Review and sign", body: "The provider edits, approves and signs. The record is the provider's." },
    ],
    metaTitle: "Remote Medical Scribe Services",
    metaDescription:
      "Remote medical scribes for U.S. practices. Real-time or same-day note drafting inside your EHR so providers finish charts sooner. HIPAA-compliant.",
    serviceType: "Medical Scribe Staffing",
    emailSubject: "Medical Scribe Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Medical Scribe service.",
    eligiblePractices: STAFFING_ELIGIBLE_PRACTICES,
    billablePatients: STAFFING_BILLABLE,
    faqs: [
      { question: "Does the scribe make clinical decisions?", answer: "No. Scribes document what the provider says and does. All clinical judgment and the final note stay with the provider." },
      { question: "Can scribes work live in the room?", answer: "Remote scribes can join by approved audio or video where your policy and patient consent allow it." },
      { question: "Do patients need to consent?", answer: "Your practice should follow its own consent policy and applicable state rules. We can help you draft patient notices." },
    ],
  },
  {
    slug: "medical-scheduler",
    category: "staffing",
    name: "Medical Scheduler",
    shortDesc: "Keep the calendar full with proactive scheduling and reminders.",
    title: "A medical scheduler who keeps every provider's day full and organized.",
    lead:
      "An empty slot is lost revenue, and an overbooked day is a lost afternoon. A Zenith scheduler books the right visit type with the right provider, sends reminders, fills cancellations and works your waitlist, so the schedule runs the way you designed it.",
    trust: [
      "HIPAA Business Associate",
      "Works inside your scheduling system",
      "Follows your visit-type rules",
      "Dedicated schedulers, not rotating agents",
    ],
    capabilitiesHeading: "What a Zenith scheduler handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "calendar-days", title: "New and follow-up booking", body: "Book the correct visit type and length for each patient." },
      { icon: "bell", title: "Appointment reminders", body: "Confirm visits by call, text or portal per your policy." },
      { icon: "phone-call", title: "No-show recovery", body: "Reach out to reschedule missed visits promptly." },
      { icon: "arrow-left-right", title: "Cancellation fills", body: "Offer open slots to waitlisted patients." },
      { icon: "calendar-check", title: "Recall scheduling", body: "Bring back patients due for chronic care and preventive visits." },
      { icon: "clipboard-list", title: "Calendar maintenance", body: "Keep provider templates, holds and blocks accurate." },
    ],
    howItWorks: [
      { title: "Set your rules", body: "We document visit types, durations, provider preferences and booking limits." },
      { title: "Schedule and confirm", body: "The scheduler books, reminds and manages changes daily." },
      { title: "Review the calendar", body: "You receive utilization and no-show reports to refine the template." },
    ],
    metaTitle: "Remote Medical Scheduler Services",
    metaDescription:
      "Remote medical schedulers for U.S. practices. Fill the calendar, reduce no-shows and manage cancellations inside your system. HIPAA-compliant.",
    serviceType: "Medical Scheduler Staffing",
    emailSubject: "Medical Scheduler Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Medical Scheduler service.",
    eligiblePractices: STAFFING_ELIGIBLE_PRACTICES,
    billablePatients: STAFFING_BILLABLE,
    faqs: [
      { question: "Will the scheduler take calls?", answer: "Scheduling calls can be included. Full front-desk call handling is covered by our Medical Receptionist service." },
      { question: "Can the scheduler triage symptoms?", answer: "No. Clinical questions go to your clinical staff by the process you define." },
      { question: "Which scheduling systems do you use?", answer: "Your existing practice-management or EHR scheduling module. We confirm compatibility when scoping." },
    ],
  },
  {
    slug: "medical-receptionist",
    category: "staffing",
    name: "Medical Receptionist",
    shortDesc: "A professional first point of contact for every call and message.",
    title: "A medical receptionist who answers every call like part of your team.",
    lead:
      "The phone is your practice's first impression. A Zenith receptionist answers in your practice's name, greets patients warmly, routes the call to the right person and records clear messages, so patients are not left on hold and your in-house team is not constantly interrupted.",
    trust: [
      "HIPAA Business Associate",
      "Answers in your practice's name",
      "Follows your call-routing rules",
      "Clear escalation for urgent calls",
    ],
    capabilitiesHeading: "What a Zenith receptionist handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "headset", title: "Inbound call handling", body: "Greet, identify the reason and direct each call." },
      { icon: "messages-square", title: "Message taking", body: "Record accurate messages and deliver them through your approved channel." },
      { icon: "user-plus", title: "Patient intake", body: "Collect demographics and insurance details for new patients." },
      { icon: "shield-check", title: "Insurance card capture", body: "Gather and upload coverage information." },
      { icon: "folder-open", title: "Refill and records requests", body: "Log requests and route them to the right team." },
      { icon: "bell", title: "Urgent-call escalation", body: "Send emergencies and urgent clinical concerns to your clinician right away." },
    ],
    howItWorks: [
      { title: "Build the call script", body: "We document your greetings, hours, routing and escalation rules." },
      { title: "Answer and route", body: "The receptionist handles calls during your agreed hours." },
      { title: "Report", body: "You receive call logs and summaries of common patient questions." },
    ],
    metaTitle: "Remote Medical Receptionist Services",
    metaDescription:
      "Remote medical receptionists for U.S. practices. Answer calls, route messages and handle patient intake with a professional front-desk voice. HIPAA-compliant.",
    serviceType: "Medical Receptionist Staffing",
    emailSubject: "Medical Receptionist Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Medical Receptionist service.",
    eligiblePractices: STAFFING_ELIGIBLE_PRACTICES,
    billablePatients: STAFFING_BILLABLE,
    faqs: [
      { question: "What happens with an urgent clinical call?", answer: "The receptionist follows your escalation script, tells emergency callers to contact emergency services and notifies your clinician." },
      { question: "Can the receptionist book appointments?", answer: "Yes, where you grant scheduling access. Heavy scheduling workloads are better served by our Medical Scheduler." },
      { question: "Which hours are covered?", answer: "Hours are set during scoping and depend on staffing and your time zone." },
    ],
  },
  {
    slug: "patient-care-coordinator",
    category: "staffing",
    name: "Patient Care Coordinator",
    shortDesc: "Owns the clinical admin that clogs your care team.",
    title: "A patient care coordinator who clears the admin that clogs your clinical team.",
    lead:
      "Nurses and medical assistants lose hours every day to referrals, prior authorizations and inbox messages. A Zenith care coordinator takes that work remotely, inside your EHR, so your in-house team stays focused on patients. Staffing is a flat monthly rate.",
    trust: [
      "Trained clinical staff",
      "HIPAA Business Associate",
      "Works inside your EHR",
      "Flat monthly rate",
    ],
    capabilitiesHeading: "What does a patient care coordinator do?",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated medical environments.",
    capabilities: [
      { icon: "folder-open", title: "Pre-visit chart review", body: "Prepare each chart with open gaps, results and records before the visit." },
      { icon: "phone-call", title: "No-show follow-up", body: "Reach patients who missed a visit and rebook." },
      { icon: "arrow-left-right", title: "Referral tracking", body: "Send referrals, confirm scheduling and chase consult notes." },
      { icon: "file-signature", title: "Prior authorizations", body: "Prepare and follow up on authorization requests." },
      { icon: "shield-check", title: "Insurance verification", body: "Confirm coverage before the visit." },
      { icon: "messages-square", title: "Portal inbox triage & care-gap outreach", body: "Sort messages by urgency and contact patients due for care." },
    ],
    howItWorks: [
      { title: "Map your workflows", body: "We list the tasks to hand off and the rules for each." },
      { title: "Place your coordinator", body: "A coordinator joins your EHR with role-based access under a BAA." },
      { title: "Track and adjust", body: "You review task completion and widen or narrow the scope." },
    ],
    metaTitle: "Remote Patient Care Coordinator Staffing",
    metaDescription:
      "Remote patient care coordinators for U.S. practices. Pre-visit prep, referrals, prior authorizations and inbox triage at a flat monthly rate, inside your EHR.",
    serviceType: "Patient Care Coordination",
    emailSubject: "Patient Care Coordinator Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Patient Care Coordinator service.",
    eligiblePractices: STAFFING_ELIGIBLE_PRACTICES,
    billablePatients: STAFFING_BILLABLE,
    faqs: [
      { question: "How is this different from CCM?", answer: "CCM is a billable monthly clinical program for chronic patients. A care coordinator handles daily administrative and outreach work for the whole practice." },
      { question: "Can the coordinator give clinical advice?", answer: "No. Clinical questions go to your licensed staff by the process you set." },
      { question: "How is it priced?", answer: "A flat monthly rate based on scope, shared during the intro call." },
    ],
  },
  {
    slug: "virtual-assistant",
    category: "staffing",
    name: "Virtual Assistant",
    shortDesc: "Flexible admin support for the tasks that don't need a clinician.",
    title: "A virtual assistant for the office tasks that never end.",
    lead:
      "Every practice has a pile of tasks that are important but not clinical: records requests, forms, data entry, vendor emails and reports. A Zenith virtual assistant takes that pile off your team's desk, working under a BAA with the access you choose to give.",
    trust: [
      "HIPAA Business Associate",
      "BAA signed before any access",
      "Access limited to what the task needs",
      "Flat monthly rate",
    ],
    capabilitiesHeading: "What a Zenith virtual assistant handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "messages-square", title: "Inbox and email management", body: "Sort, draft replies and flag items for the team." },
      { icon: "keyboard", title: "Data entry and chart cleanup", body: "Keep demographics, insurance and document records accurate." },
      { icon: "folder-open", title: "Records requests", body: "Send, track and file incoming and outgoing medical records." },
      { icon: "file-text", title: "Forms and paperwork", body: "Complete and route standard forms for review and signature." },
      { icon: "clipboard-list", title: "Reports and spreadsheets", body: "Build recurring reports and track lists." },
      { icon: "arrow-left-right", title: "Research and vendor tasks", body: "Compare options and follow up with vendors." },
    ],
    howItWorks: [
      { title: "List the tasks", body: "We write down what you want handed off and how you like it done." },
      { title: "Grant limited access", body: "Your assistant gets only the system access the tasks need." },
      { title: "Review weekly", body: "You check completed work and adjust the task list." },
    ],
    metaTitle: "Medical Virtual Assistant Services",
    metaDescription:
      "Remote virtual assistants for U.S. medical practices. Inbox management, data entry, records requests and office tasks at a flat monthly rate. HIPAA-compliant.",
    serviceType: "Virtual Assistant Staffing",
    emailSubject: "Virtual Assistant Inquiry",
    whatsappMessage: "Hi Zenith, I'd like to learn about your Virtual Assistant service.",
    eligiblePractices: STAFFING_ELIGIBLE_PRACTICES,
    billablePatients: STAFFING_BILLABLE,
    faqs: [
      { question: "Can the virtual assistant see patient information?", answer: "Only if you grant it for a task, and only under a signed BAA. Many tasks need no patient data at all." },
      { question: "How is this different from a care coordinator?", answer: "A coordinator focuses on patient-facing workflows like referrals and authorizations. A virtual assistant covers general office and administrative work." },
      { question: "Is there a minimum commitment?", answer: "Terms are shared during the intro call." },
    ],
  },
];

/* -------------------------------------------------------------------------- */

export const services: readonly Service[] = [
  ...RPM_SERVICES,
  ...RCM_SERVICES,
  ...STAFFING_SERVICES,
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): readonly string[] {
  return services.map((s) => s.slug);
}

export function servicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category);
}

/* Load-time validation, fails the build on a bad registry (matches the
   posts.ts pattern). */
if (typeof window === "undefined") {
  const seen = new Set<string>();
  for (const s of services) {
    if (!s.slug) throw new Error(`services: missing slug on ${s.name}`);
    if (seen.has(s.slug)) throw new Error(`services: duplicate slug "${s.slug}"`);
    if (!s.capabilities.length)
      throw new Error(`services: no capabilities on ${s.slug}`);
    if (s.trust.length !== 4)
      throw new Error(`services: "${s.slug}" needs exactly 4 trust items`);
    if (s.howItWorks.length !== 3)
      throw new Error(`services: "${s.slug}" needs exactly 3 how-it-works steps`);
    if (s.category === "rpm" && !s.billing?.length)
      throw new Error(`services: RPM service "${s.slug}" has no billing codes`);
    seen.add(s.slug);
  }
}
