/**
 * Service-line registry — single source of truth for the /services/[service]
 * pages, the services overview, the nav mega-menu, and the sitemap.
 *
 * Two categories:
 *   - "rpm"      → Remote Patient Monitoring (Medicare care-management programs)
 *   - "staffing" → Virtual Staffing & Admin Support (remote medical roles)
 *
 * Content is Zenith's own (care programs, from the internal service-line doc)
 * or original rephrased copy (staffing). Reimbursement figures are 2026
 * Medicare national averages and vary by locality — kept qualified per the
 * project's claims-hygiene rules. No PHI, no fabricated stats.
 */

export type ServiceCategory = "rpm" | "staffing" | "rcm";

export const categoryMeta: Record<
  ServiceCategory,
  { label: string; blurb: string; href: string }
> = {
  rpm: {
    label: "Remote Patient Monitoring",
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
  /** Capability card grid. */
  capabilitiesHeading: string;
  capabilitiesSubtitle: string;
  capabilities: Capability[];
  /** 3-step "how it works" flow. */
  howItWorks: HowStep[];
  /** Care-management extras. */
  qualifies?: string[];
  billing?: BillingCode[];
  billingNote?: string;
  revenue?: { value: string; note: string };
  /** SEO. */
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  faqs: ServiceFaq[];
};

/* -------------------------------------------------------------------------- */
/* Remote Patient Monitoring — Medicare care-management programs              */
/* -------------------------------------------------------------------------- */

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
      "CCM is a Medicare program for patients living with two or more chronic conditions expected to last twelve months or longer. Zenith delivers the monthly coordination calls, care plans, and documentation these patients need — so your practice earns recurring reimbursement without adding staff workload.",
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "PharmD-supervised clinical staff, working inside your EHR.",
    capabilities: [
      { icon: "phone", title: "Monthly care calls", body: "Structured check-ins with each enrolled patient on medications, symptoms, and follow-up." },
      { icon: "clipboard-list", title: "Care plan management", body: "Comprehensive, patient-specific care plans created and kept current in your EHR." },
      { icon: "pill", title: "Medication reconciliation", body: "Review and reconcile medications across every prescriber the patient sees." },
      { icon: "users", title: "Specialist coordination", body: "Close the loop with specialists and outside providers between visits." },
      { icon: "file-signature", title: "Audit-ready documentation", body: "Time logs and notes that meet CMS requirements, inside your system." },
      { icon: "clipboard-check", title: "Eligibility review", body: "We run your panel against documented diagnoses to find who already qualifies." },
    ],
    qualifies: [
      "Two or more chronic conditions expected to last 12+ months",
      "Enrolled in Medicare Part B",
      "Documented patient consent on file",
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
      { title: "Deliver monthly coordination", body: "Our clinical team spends 20+ minutes per patient on calls, care plans, and medication reconciliation — inside your EHR." },
      { title: "You bill, Zenith invoices", body: "Your practice bills CPT 99490 and add-ons; we invoice for the clinical labor. Monthly and predictable." },
    ],
    metaTitle: "Chronic Care Management (CCM) Services",
    metaDescription:
      "Remote Chronic Care Management for U.S. practices. Zenith delivers monthly CCM coordination, care plans, and CPT 99490 documentation inside your EHR. Your practice bills; we deliver.",
    serviceType: "Chronic Care Management",
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
      "Principal Care Management for your highest-risk single-condition patients.",
    lead:
      "PCM is a Medicare program built for patients managed around one serious, high-risk chronic condition — heart failure, advanced CKD, or severe COPD — expected to last at least three months. It's a natural fit for specialty practices where a single condition dominates the clinical picture. Zenith runs the monthly management work so your practice captures the reimbursement.",
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Focused, single-condition management under PharmD oversight.",
    capabilities: [
      { icon: "heart-pulse", title: "Focused condition management", body: "Monthly management centered on the one qualifying high-risk condition." },
      { icon: "clipboard-list", title: "Single-condition care plan", body: "A care plan built around that condition, kept current in your EHR." },
      { icon: "users", title: "Specialist & PCP coordination", body: "Keep the specialist and primary-care team aligned on the plan." },
      { icon: "file-signature", title: "Documentation & time tracking", body: "Full notes and time logs that meet CMS requirements." },
      { icon: "clipboard-check", title: "Eligibility review", body: "We identify which patients fit PCM rather than CCM." },
    ],
    qualifies: [
      "One complex, high-risk chronic condition (not two or more — that's CCM)",
      "Condition expected to last at least 3 months",
      "Enrolled in Medicare Part B",
    ],
    billing: [
      { code: "99424", covers: "First 30 min/month, physician or QHP time", rate: "~$88" },
      { code: "99425", covers: "Each additional 30 minutes, physician/QHP", rate: "~$61" },
      { code: "99426", covers: "First 30 min/month, clinical staff", rate: "~$68" },
      { code: "99427", covers: "Each additional 30 minutes, clinical staff", rate: "~$54" },
    ],
    billingNote:
      "PCM and CCM can't be billed for the same patient in the same month by the same provider — but a specialist can bill PCM for one condition while the patient's PCP separately bills CCM for others.",
    revenue: {
      value: "~$68–$88 / mo",
      note: "Per enrolled patient, depending on who performs the time. Figures are 2026 national averages and vary by locality.",
    },
    howItWorks: [
      { title: "Identify single-condition patients", body: "We find patients managed around one high-risk condition expected to last 3+ months and confirm eligibility." },
      { title: "Deliver focused management", body: "Our team manages that condition each month — care plan, coordination, and documentation — inside your EHR." },
      { title: "You bill, Zenith invoices", body: "Your practice bills CPT 99424–99427; we invoice for the management time." },
    ],
    metaTitle: "Principal Care Management (PCM) Services",
    metaDescription:
      "Remote Principal Care Management for specialty practices. Zenith manages one high-risk condition per patient (CPT 99424–99427) so your practice captures PCM reimbursement. Inside your EHR.",
    serviceType: "Principal Care Management",
    faqs: [
      { question: "What's the difference between PCM and CCM?", answer: "CCM covers patients with two or more chronic conditions; PCM covers patients managed around a single serious, high-risk condition expected to last at least three months. PCM is often the right fit for specialty practices." },
      { question: "Can a specialist bill PCM while the PCP bills CCM?", answer: "Yes. The same patient can have a specialist billing PCM for one condition while their primary-care provider separately bills CCM for other conditions — they just can't both be billed by the same provider in the same month." },
      { question: "Which patients are a fit for PCM?", answer: "Patients with one complex, high-risk condition such as heart failure, advanced CKD, or severe COPD, expected to last at least three months, enrolled in Medicare Part B." },
    ],
  },
  {
    slug: "remote-patient-monitoring",
    category: "rpm",
    code: "RPM",
    name: "Remote Patient Monitoring (RPM)",
    shortDesc: "Turn connected-device data into monthly recurring revenue.",
    title:
      "Remote Patient Monitoring that turns connected devices into recurring revenue.",
    lead:
      "RPM uses connected devices — blood-pressure cuffs, glucometers, pulse oximeters, weight scales — to track a patient's physiological data between visits. Zenith manages the day-to-day monitoring, patient check-ins, and documentation, turning passive device data into a billable, high-value service for your practice.",
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Device data watched, patients engaged, documentation done.",
    capabilities: [
      { icon: "line-chart", title: "Device data review", body: "Review incoming readings for concerning trends and out-of-range values." },
      { icon: "phone", title: "Monthly check-ins", body: "Interactive check-ins with each patient about their readings and symptoms." },
      { icon: "bell", title: "Out-of-range escalation", body: "Flag and escalate concerning readings to your care team promptly." },
      { icon: "monitor", title: "Setup & education", body: "Device setup support and patient education so data actually flows." },
      { icon: "file-signature", title: "Time tracking & documentation", body: "Full monitoring time logs and notes inside your EHR." },
    ],
    qualifies: [
      "At least one acute or chronic condition warranting monitoring (hypertension, diabetes, heart failure, COPD, obesity, post-surgical recovery)",
      "Established relationship with the ordering provider",
      "Written patient consent on file",
    ],
    billing: [
      { code: "99453", covers: "Initial device setup & patient education (once per device)", rate: "~$20" },
      { code: "99454", covers: "Device supply, 16+ days of data in 30 days", rate: "~$52/mo" },
      { code: "99445", covers: "New for 2026 — device supply, 2–15 days of data", rate: "~$52/mo" },
      { code: "99457", covers: "First 20 min/month of monitoring & management", rate: "~$52" },
      { code: "99458", covers: "Each additional 20 minutes", rate: "—" },
      { code: "99470", covers: "New for 2026 — 10–19 minutes of management time", rate: "lower" },
    ],
    revenue: {
      value: "$150–$200+ / mo",
      note: "Per enrolled patient, combining device-supply and management codes. Representative; actual results vary.",
    },
    howItWorks: [
      { title: "Enroll & set up devices", body: "We confirm a monitoring-worthy condition and consent, then support device setup and patient education." },
      { title: "Monitor & check in monthly", body: "We review incoming readings, run monthly check-ins, and escalate out-of-range values to your team." },
      { title: "You bill, Zenith invoices", body: "Your practice bills the RPM device and management codes; we invoice for the monitoring work." },
    ],
    metaTitle: "Remote Patient Monitoring (RPM) Services",
    metaDescription:
      "Remote Patient Monitoring managed end-to-end. Zenith reviews device data, runs monthly check-ins, and documents RPM (CPT 99453–99458) so your practice bills recurring revenue. Inside your EHR.",
    serviceType: "Remote Patient Monitoring",
    faqs: [
      { question: "What devices does RPM use?", answer: "Connected blood-pressure cuffs, glucometers, pulse oximeters, and weight scales are the most common. The device must transmit physiological data and the patient needs at least one condition that warrants monitoring." },
      { question: "How much can a single RPM patient generate?", answer: "A single enrolled patient can generate roughly $150–$200+ per month combining the device-supply and management codes. Figures are 2026 national averages and vary by locality and payer." },
      { question: "Can RPM be billed alongside CCM?", answer: "Yes — RPM and CCM use separate code families and can generally be billed concurrently when clinically distinct work is performed. Confirm current payer-specific rules before combining." },
    ],
  },
  {
    slug: "remote-therapeutic-monitoring",
    category: "rpm",
    code: "RTM",
    name: "Remote Therapeutic Monitoring (RTM)",
    shortDesc: "Monitor therapy adherence and functional status remotely.",
    title:
      "Remote Therapeutic Monitoring for therapy adherence and functional recovery.",
    lead:
      "RTM tracks non-physiological data — respiratory status, musculoskeletal function, pain levels, and therapy adherence — using digital apps or software, not just hardware. It's billable by physicians, NPs, PAs, and also physical, occupational, and speech therapists. Zenith manages the monitoring workflow and patient engagement so this becomes a reliable revenue line.",
    capabilitiesHeading: "What Zenith handles every month",
    capabilitiesSubtitle:
      "Adherence and functional data, watched and acted on.",
    capabilities: [
      { icon: "activity", title: "Adherence & function review", body: "Review therapy-adherence and functional-status data for concerning trends." },
      { icon: "phone", title: "Monthly live check-ins", body: "Interactive check-ins, required for the RTM management codes." },
      { icon: "bell", title: "Trend escalation", body: "Escalate concerning patterns to the treating provider or therapist." },
      { icon: "monitor", title: "Setup & education", body: "Onboard patients onto the app or device so data flows reliably." },
      { icon: "file-signature", title: "Documentation", body: "Full time logs and notes to support the management codes." },
    ],
    qualifies: [
      "Patients needing respiratory or musculoskeletal monitoring, pain management, or therapy-adherence tracking",
      "Use of an FDA-defined medical device or software as a medical device (SaMD)",
      "Documented consent on file",
    ],
    billing: [
      { code: "98975", covers: "Initial setup & patient education", rate: "~$22" },
      { code: "98976", covers: "Respiratory monitoring device supply, 16–30 days", rate: "~$47/mo" },
      { code: "98977", covers: "Musculoskeletal device supply, 16–30 days", rate: "~$40/mo" },
      { code: "98984 / 98985", covers: "New for 2026 — short-window supply, 2–15 days", rate: "—" },
      { code: "98980", covers: "First 20 min/month of treatment management", rate: "—" },
      { code: "98981 / 98979", covers: "Additional / lower-threshold (10–19 min) management", rate: "—" },
    ],
    billingNote:
      "RPM tracks physiological vitals (blood pressure, glucose); RTM tracks therapeutic and functional data (pain, range of motion, adherence) — and can be billed by therapists, not just physicians and mid-levels.",
    revenue: {
      value: "~$90–$150 / mo",
      note: "Per enrolled patient. Figures are 2026 national averages and vary by locality.",
    },
    howItWorks: [
      { title: "Enroll & onboard the patient", body: "We confirm a respiratory, musculoskeletal, or adherence need and consent, then onboard the patient to the app or device." },
      { title: "Monitor adherence & check in", body: "We review therapy-adherence and functional data, run the required monthly live check-ins, and escalate concerning trends." },
      { title: "You bill, Zenith invoices", body: "Your practice or therapist bills the RTM codes; we invoice for the monitoring work." },
    ],
    metaTitle: "Remote Therapeutic Monitoring (RTM) Services",
    metaDescription:
      "Remote Therapeutic Monitoring managed for you. Zenith tracks therapy adherence and functional status (CPT 98975–98981) so physicians and therapists bill RTM reliably. Inside your systems.",
    serviceType: "Remote Therapeutic Monitoring",
    faqs: [
      { question: "What's the difference between RTM and RPM?", answer: "RPM tracks physiological vitals like blood pressure and glucose; RTM tracks therapeutic and functional data such as pain, range of motion, and medication or therapy adherence. RTM can also be billed by physical, occupational, and speech therapists." },
      { question: "Who can bill for RTM?", answer: "Physicians, nurse practitioners, and physician assistants, plus physical, occupational, and speech therapists — which makes RTM a fit for therapy practices RPM doesn't reach." },
      { question: "Can RTM be billed alongside RPM?", answer: "Generally yes, when clinically distinct data is being tracked, because they use separate code families. Confirm current payer-specific rules before combining them." },
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
      "TCM covers the critical thirty days after a patient leaves the hospital, an observation stay, or a skilled nursing facility. Patients without structured post-discharge follow-up are far more likely to be readmitted — and TCM is one of Medicare's highest-paying care-management codes per episode. Zenith handles the time-sensitive outreach and coordination it requires.",
    capabilitiesHeading: "What Zenith handles per episode",
    capabilitiesSubtitle:
      "The time-sensitive post-discharge work, tracked so nothing is missed.",
    capabilities: [
      { icon: "phone-call", title: "2-business-day outreach", body: "The mandatory interactive contact within two business days of discharge." },
      { icon: "pill", title: "Medication reconciliation", body: "Reconcile medications during the service period, as TCM requires." },
      { icon: "users", title: "Community & specialist coordination", body: "Coordinate home health, specialists, and community services." },
      { icon: "calendar-check", title: "Visit-window tracking", body: "Track the 7- or 14-day face-to-face window so billing isn't lost." },
      { icon: "file-signature", title: "Documentation", body: "Document the episode to support the TCM claim." },
    ],
    qualifies: [
      "Recently discharged from an acute hospital, inpatient psychiatric unit, skilled nursing facility, or long-term care hospital",
      "Returning to the community (home, assisted living, etc.)",
    ],
    billing: [
      { code: "99495", covers: "Moderate complexity, face-to-face visit within 14 days", rate: "~$220" },
      { code: "99496", covers: "High complexity, face-to-face visit within 7 days", rate: "~$299" },
    ],
    billingNote:
      "Only one TCM code is billed per patient per 30-day period. The interactive contact within two business days of discharge is mandatory — miss that window and the episode isn't billable at all.",
    revenue: {
      value: "$220–$299 / episode",
      note: "One of Medicare's highest-paying care-management codes. Figures are 2026 national averages and vary by locality.",
    },
    howItWorks: [
      { title: "Catch the discharge", body: "We identify discharge-eligible patients and make the mandatory interactive contact within 2 business days." },
      { title: "Coordinate the 30-day window", body: "We handle medication reconciliation, specialist and community coordination, and track the face-to-face visit window." },
      { title: "You bill, Zenith invoices", body: "Your practice bills CPT 99495 or 99496 for the episode; we invoice for the coordination." },
    ],
    metaTitle: "Transitional Care Management (TCM) Services",
    metaDescription:
      "Transitional Care Management that prevents readmissions and missed billing. Zenith runs the 2-business-day outreach, med reconciliation, and visit tracking for TCM (CPT 99495/99496).",
    serviceType: "Transitional Care Management",
    faqs: [
      { question: "What are the timing requirements for TCM?", answer: "An interactive contact with the patient or caregiver within two business days of discharge is mandatory — miss it and the episode isn't billable. A face-to-face visit must follow within 7 or 14 days depending on complexity, with medication reconciliation during the service period." },
      { question: "How much does TCM reimburse?", answer: "CPT 99495 (moderate complexity) reimburses roughly $220 and 99496 (high complexity) roughly $299 per episode — among the highest per-episode care-management rates. Only one TCM code is billed per patient per 30-day period." },
      { question: "Can TCM overlap with CCM?", answer: "TCM cannot overlap with CCM billing in the same calendar month as the TCM service period. Zenith tracks this so the two programs don't collide." },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Virtual Staffing & Admin Support — remote medical roles                    */
/* -------------------------------------------------------------------------- */

const STAFFING_SERVICES: Service[] = [
  {
    slug: "medical-scribe",
    category: "staffing",
    name: "Medical Scribe",
    shortDesc: "Real-time clinical documentation so providers can focus on patients.",
    title: "Remote Medical Scribes that give your providers their time back.",
    lead:
      "A Zenith medical scribe documents the patient encounter in real time inside your EHR — history, exam, assessment, and plan — so your providers spend visits with patients, not keyboards. Trained on clinical terminology and your templates before day one, under PharmD-led oversight.",
    capabilitiesHeading: "What a Zenith scribe handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "keyboard", title: "Real-time charting", body: "Document the encounter live in your EHR as the visit happens." },
      { icon: "file-text", title: "Encounter notes", body: "Capture history, exam, assessment, and plan to your template." },
      { icon: "clipboard-list", title: "Order entry support", body: "Queue orders, labs, and referrals for provider sign-off." },
      { icon: "folder-open", title: "Chart prep", body: "Prepare the chart before the visit so the provider walks in ready." },
      { icon: "file-signature", title: "After-visit summaries", body: "Draft clear after-visit summaries for patients and records." },
      { icon: "clipboard-check", title: "Template & macro upkeep", body: "Keep your note templates and macros current and consistent." },
    ],
    howItWorks: [
      { title: "Scope the role", body: "We map your specialties, note templates, and provider-coverage needs." },
      { title: "Match & train", body: "We place a trained scribe and onboard them on your EHR and templates before day one." },
      { title: "Document in real time", body: "Your scribe charts encounters live under PharmD-led oversight; your provider reviews and signs." },
    ],
    metaTitle: "Remote Medical Scribe Services",
    metaDescription:
      "Hire a trained remote medical scribe. Zenith scribes document encounters in real time inside your EHR under PharmD oversight — HIPAA-compliant, flat monthly rate, no PHI exported.",
    serviceType: "Medical Scribe Staffing",
    faqs: [
      { question: "Does the scribe work inside our EHR?", answer: "Yes. Zenith scribes work inside the EHR you already use, with role-based access, trained on your templates before day one. No PHI is exported off your systems." },
      { question: "Is scribing live or asynchronous?", answer: "We support both — a scribe can document the encounter in real time during the visit, or work from recorded encounters, depending on your workflow." },
      { question: "How is a medical scribe priced?", answer: "A flat monthly rate per scribe, scaled to the hours and provider coverage you need. No Medicare billing is involved — this is a staffing engagement." },
    ],
  },
  {
    slug: "medical-scheduler",
    category: "staffing",
    name: "Medical Scheduler",
    shortDesc: "Keep the calendar full with proactive scheduling and reminders.",
    title: "Remote Medical Schedulers that keep your calendar full.",
    lead:
      "A Zenith scheduler owns the appointment lifecycle — booking, confirmations, reminders, waitlists, and no-show recovery — so your schedule stays full and your front desk stays focused on the patients in the room.",
    capabilitiesHeading: "What a Zenith scheduler handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "calendar-days", title: "Appointment booking", body: "Book and reschedule across providers and locations in your system." },
      { icon: "bell", title: "Reminders & confirmations", body: "Proactive reminders and confirmations to cut cancellations." },
      { icon: "phone-call", title: "No-show follow-up", body: "Recover no-shows and fill the gaps they leave in the schedule." },
      { icon: "clipboard-list", title: "Waitlist management", body: "Work the waitlist to fill last-minute openings quickly." },
      { icon: "arrow-left-right", title: "Referral scheduling", body: "Schedule incoming referrals and coordinate outbound ones." },
      { icon: "calendar-check", title: "Calendar upkeep", body: "Keep provider calendars accurate, blocked, and conflict-free." },
    ],
    howItWorks: [
      { title: "Scope the role", body: "We map your appointment volume, scheduling tools, and booking rules." },
      { title: "Match & onboard", body: "We place a scheduler with role-based access to your systems under a signed BAA." },
      { title: "Keep the calendar full", body: "Your scheduler books, confirms, reminds, and recovers no-shows inside your system." },
    ],
    metaTitle: "Remote Medical Scheduler Services",
    metaDescription:
      "Hire a remote medical scheduler. Zenith schedulers own booking, reminders, waitlists, and no-show recovery inside your system — HIPAA-compliant, flat monthly rate, PharmD-supervised.",
    serviceType: "Medical Scheduler Staffing",
    faqs: [
      { question: "What systems do schedulers work in?", answer: "Zenith schedulers work inside your existing EHR and scheduling tools with role-based access, the same way in-house staff would. No PHI leaves your systems." },
      { question: "Can a scheduler help reduce no-shows?", answer: "Yes. Proactive confirmations, reminders, and structured no-show follow-up are core parts of the role, along with working the waitlist to fill openings quickly." },
      { question: "How is a scheduler priced?", answer: "A flat monthly rate per scheduler, scaled to your appointment volume and hours. This is a staffing engagement, not a billed Medicare service." },
    ],
  },
  {
    slug: "medical-receptionist",
    category: "staffing",
    name: "Medical Receptionist",
    shortDesc: "A professional first point of contact for every call and message.",
    title: "Remote Medical Receptionists — a professional front desk, offsite.",
    lead:
      "A Zenith virtual receptionist answers calls, triages messages, verifies insurance, and manages your inbox with the warmth and HIPAA discipline of in-house staff — without the overhead of another desk.",
    capabilitiesHeading: "What a Zenith receptionist handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "headset", title: "Inbound call handling", body: "Answer and route calls professionally, in your practice's voice." },
      { icon: "messages-square", title: "Message triage", body: "Triage patient messages and route them by urgency." },
      { icon: "shield-check", title: "Insurance verification", body: "Verify eligibility and benefits before the visit." },
      { icon: "clipboard-list", title: "Intake & forms", body: "Collect intake forms and new-patient information accurately." },
      { icon: "file-text", title: "Portal inbox management", body: "Keep the patient-portal inbox worked and organized." },
      { icon: "calendar-days", title: "Appointment support", body: "Book, confirm, and adjust appointments as calls come in." },
    ],
    howItWorks: [
      { title: "Scope the role", body: "We map your call volume, phone and messaging systems, and front-desk workflows." },
      { title: "Match & onboard", body: "We place a receptionist with role-based access under a signed BAA." },
      { title: "Answer & triage", body: "Your receptionist handles calls, messages, intake, and insurance checks in your practice's voice." },
    ],
    metaTitle: "Remote Medical Receptionist Services",
    metaDescription:
      "Hire a remote medical receptionist. Zenith receptionists answer calls, triage messages, verify insurance, and manage your inbox — HIPAA-compliant, PharmD-supervised, flat monthly rate.",
    serviceType: "Medical Receptionist Staffing",
    faqs: [
      { question: "Will patients know the receptionist is remote?", answer: "The receptionist answers in your practice's name and voice using your phone and messaging systems. The experience is designed to feel like your front desk, because operationally it is." },
      { question: "Is patient information kept secure?", answer: "Yes. Receptionists work inside your systems with role-based access under a signed Business Associate Agreement. No PHI is exported off your platforms." },
      { question: "How is a receptionist priced?", answer: "A flat monthly rate per receptionist, scaled to your call and message volume. This is a staffing engagement, not a billed service." },
    ],
  },
  {
    slug: "patient-care-coordinator",
    category: "staffing",
    name: "Patient Care Coordinator",
    shortDesc: "Owns the clinical admin that clogs your care team.",
    title: "Remote Patient Care Coordinators who take the clinical admin off your team.",
    lead:
      "A Zenith care coordinator runs the pre-visit prep, referrals, prior authorizations, and care-gap outreach that slow your clinical team down — trained on the clinical workflows a practice actually runs, under the same PharmD-led oversight as our care-management programs.",
    capabilitiesHeading: "What does a patient care coordinator do?",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated medical environments.",
    capabilities: [
      { icon: "user-plus", title: "Patient intake", body: "Manage new-patient registration, forms, and demographic data collection." },
      { icon: "clipboard-list", title: "Care plan coordination", body: "Coordinate and track patient care plans across providers and departments." },
      { icon: "messages-square", title: "Referral management", body: "Process, track, and follow up on specialist referrals and authorizations." },
      { icon: "calendar-check", title: "Follow-up scheduling", body: "Schedule and confirm follow-up appointments to ensure care continuity." },
      { icon: "file-text", title: "Patient education", body: "Provide patients with clear information about procedures, medications, and care." },
      { icon: "folder-open", title: "Medical records coordination", body: "Request, organize, and transfer medical records between providers and facilities." },
      { icon: "users", title: "Provider communication", body: "Facilitate communication between providers, specialists, and care-team members." },
      { icon: "arrow-left-right", title: "Care transitions", body: "Support smooth transitions between care settings, including post-discharge follow-up." },
    ],
    howItWorks: [
      { title: "Scope the bottleneck", body: "We map the clinical admin slowing your team — intake, referrals, prior auths, outreach." },
      { title: "Match & onboard", body: "We place a coordinator trained on your clinical workflows, with role-based EHR access." },
      { title: "Run the coordination", body: "Your coordinator handles intake, referrals, follow-ups, and records under PharmD-led oversight." },
    ],
    metaTitle: "Remote Patient Care Coordinator Services",
    metaDescription:
      "Hire a remote patient care coordinator. Zenith coordinators handle intake, referrals, prior auths, records, and care-gap outreach inside your EHR — HIPAA-compliant, PharmD-supervised.",
    serviceType: "Patient Care Coordination",
    faqs: [
      { question: "Is this a clinical or administrative role?", answer: "It's a non-clinical coordination role. Coordinators handle scheduling, forms, referrals, prior authorizations, records, and routine outreach. All clinical decisions stay with your team, which also supervises the coordinator's work." },
      { question: "Does the coordinator access our EHR?", answer: "Yes, with role-based access the same way in-house staff would, and only after a Business Associate Agreement is signed. No PHI is exported off your systems." },
      { question: "Can we combine a coordinator with a care-management program?", answer: "Yes. You can run Patient Care Coordinator staffing alongside CCM, PCM, RPM, RTM, or TCM under one vendor and one BAA." },
    ],
  },
  {
    slug: "virtual-assistant",
    category: "staffing",
    name: "Virtual Assistant",
    shortDesc: "Flexible admin support for the tasks that don't need a clinician.",
    title: "Healthcare Virtual Assistants for the admin that doesn't need a clinician.",
    lead:
      "A Zenith virtual assistant handles the recurring administrative work — data entry, document management, inbox and calendar support, and routine follow-ups — so your team spends its time on patients, not busywork. Scoped to your practice and supervised for quality.",
    capabilitiesHeading: "What a Zenith virtual assistant handles",
    capabilitiesSubtitle:
      "Role-specific medical professionals, trained for regulated environments.",
    capabilities: [
      { icon: "messages-square", title: "Inbox & email management", body: "Keep the practice inbox triaged, answered, and organized." },
      { icon: "calendar-days", title: "Calendar & scheduling", body: "Manage calendars, meetings, and appointment logistics." },
      { icon: "keyboard", title: "Data entry & EHR upkeep", body: "Accurate data entry and record upkeep inside your systems." },
      { icon: "folder-open", title: "Document management", body: "Organize, file, and route documents and records." },
      { icon: "phone-call", title: "Patient follow-ups", body: "Handle routine, non-clinical patient follow-up tasks." },
      { icon: "clipboard-list", title: "Reporting & admin", body: "Compile routine reports and handle recurring admin tasks." },
    ],
    howItWorks: [
      { title: "Scope the work", body: "We define the recurring admin tasks you want off your team's plate." },
      { title: "Match & onboard", body: "We place a virtual assistant with role-based access to the systems they'll work in." },
      { title: "Absorb the admin", body: "Your VA handles inbox, scheduling, data entry, and follow-ups, supervised for quality." },
    ],
    metaTitle: "Healthcare Virtual Assistant Services",
    metaDescription:
      "Hire a healthcare virtual assistant. Zenith VAs handle inbox, scheduling, data entry, documents, and follow-ups inside your systems — HIPAA-compliant, PharmD-supervised, flat monthly rate.",
    serviceType: "Virtual Assistant Staffing",
    faqs: [
      { question: "What can a healthcare virtual assistant do?", answer: "Non-clinical administrative work: inbox and email management, calendar and scheduling, data entry and EHR upkeep, document management, routine patient follow-ups, and recurring reporting. Clinical judgment stays with your team." },
      { question: "Is my data secure with a virtual assistant?", answer: "Yes. VAs work inside your systems with role-based access under a Business Associate Agreement. No PHI is exported off your platforms." },
      { question: "How is a virtual assistant priced?", answer: "A flat monthly rate, scaled to the hours and scope you need. This is a staffing engagement, not a billed Medicare service." },
    ],
  },
];

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Revenue Cycle Management — billing, coding, credentialing, A/R             */
/* -------------------------------------------------------------------------- */

const RCM_SERVICES: Service[] = [
  {
    slug: "medical-billing",
    category: "rcm",
    name: "Medical Billing",
    shortDesc: "Clean claims out the door and paid, with fewer days in A/R.",
    title: "Remote Medical Billing that gets your claims paid, faster.",
    lead:
      "A Zenith medical biller prepares, scrubs, and submits your claims, posts payments, and works denials inside your practice-management system — so more of what you earn actually lands, with fewer days in accounts receivable. Your practice stays the billing provider; Zenith does the billing labor.",
    capabilitiesHeading: "What a Zenith biller handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "file-text", title: "Claim preparation & submission", body: "Prepare, scrub, and submit clean claims to payers from your PM system." },
      { icon: "keyboard", title: "Charge entry", body: "Accurate charge entry so claims go out complete the first time." },
      { icon: "clipboard-check", title: "Payment posting", body: "Post ERAs and EOBs and reconcile against expected reimbursement." },
      { icon: "bell", title: "Denial management", body: "Work, correct, and resubmit denied claims before they age out." },
      { icon: "shield-check", title: "Eligibility & benefits", body: "Verify eligibility and benefits to prevent front-end denials." },
      { icon: "file-signature", title: "Patient statements", body: "Generate and manage patient statements and balance follow-up." },
    ],
    howItWorks: [
      { title: "Scope the work", body: "We map your specialties, payers, and practice-management system." },
      { title: "Match & onboard", body: "We place a biller with role-based access under a signed BAA." },
      { title: "Bill & reconcile", body: "Your biller submits clean claims, posts payments, and works denials inside your system." },
    ],
    metaTitle: "Remote Medical Billing Services",
    metaDescription:
      "Remote medical billing for U.S. practices. Zenith billers submit clean claims, post payments, and work denials inside your PM system — HIPAA-compliant, PharmD-supervised, flat monthly rate.",
    serviceType: "Medical Billing",
    faqs: [
      { question: "Does Zenith bill Medicare directly?", answer: "No. Your practice remains the billing provider and submits claims under its own credentials; Zenith performs the billing labor on your behalf inside your practice-management system. Zenith does not bill Medicare or patients in its own name." },
      { question: "What systems do billers work in?", answer: "Zenith billers work inside the practice-management and clearinghouse tools you already use, with role-based access under a Business Associate Agreement. No data is exported off your systems." },
      { question: "How is medical billing priced?", answer: "A flat monthly rate per biller, scaled to your claim volume. This is a staffing engagement, not a percentage-of-collections arrangement." },
    ],
  },
  {
    slug: "medical-coding",
    category: "rcm",
    name: "Medical Coding",
    shortDesc: "Accurate CPT/ICD-10 coding that protects revenue and compliance.",
    title: "Remote Medical Coding that protects your revenue and your audit trail.",
    lead:
      "A Zenith coder assigns accurate CPT, ICD-10, and HCPCS codes from your documentation, flags gaps before claims go out, and keeps your coding audit-ready — so you capture the revenue you earned without taking on compliance risk.",
    capabilitiesHeading: "What a Zenith coder handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "clipboard-list", title: "CPT / ICD-10 coding", body: "Assign accurate CPT, ICD-10, and HCPCS codes from your documentation." },
      { icon: "file-text", title: "Documentation review", body: "Review notes for the specificity each code requires." },
      { icon: "clipboard-check", title: "Code auditing", body: "Audit coding for accuracy and consistency before claims go out." },
      { icon: "shield-check", title: "Compliance checks", body: "Keep coding aligned with current guidelines and audit-ready." },
      { icon: "keyboard", title: "Modifier accuracy", body: "Apply modifiers correctly to prevent avoidable denials." },
      { icon: "messages-square", title: "Query management", body: "Query providers to resolve documentation gaps." },
    ],
    howItWorks: [
      { title: "Scope the work", body: "We map your specialties, documentation style, and coding systems." },
      { title: "Match & onboard", body: "We place a coder with role-based access to your EHR under a signed BAA." },
      { title: "Code & audit", body: "Your coder assigns and audits codes from your documentation, flagging gaps before submission." },
    ],
    metaTitle: "Remote Medical Coding Services",
    metaDescription:
      "Remote medical coding for U.S. practices. Zenith coders assign accurate CPT/ICD-10/HCPCS codes and keep coding audit-ready inside your EHR — HIPAA-compliant, PharmD-supervised, flat monthly rate.",
    serviceType: "Medical Coding",
    faqs: [
      { question: "Which specialties can you code for?", answer: "Zenith codes across the primary-care, internal-medicine, and specialty workflows common to our clients, matching coders to your specialty mix during onboarding." },
      { question: "How does accurate coding reduce denials?", answer: "Correct codes, modifiers, and documentation-backed specificity prevent the front-end errors that cause the majority of avoidable denials, so more claims pay on first submission." },
      { question: "How is medical coding priced?", answer: "A flat monthly rate per coder, scaled to your volume. This is a staffing engagement inside your systems." },
    ],
  },
  {
    slug: "provider-credentialing",
    category: "rcm",
    name: "Provider Credentialing",
    shortDesc: "Get and stay enrolled with payers, without the paperwork drag.",
    title: "Remote Provider Credentialing that gets you enrolled and keeps you current.",
    lead:
      "A Zenith credentialing specialist handles payer enrollment, CAQH, re-credentialing, and tracking — so your providers get in-network faster and never lapse, without your staff chasing applications and deadlines.",
    capabilitiesHeading: "What a Zenith credentialing specialist handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "file-signature", title: "Payer enrollment", body: "Prepare and submit commercial and government payer enrollment applications." },
      { icon: "folder-open", title: "CAQH management", body: "Build and maintain CAQH profiles and attestations." },
      { icon: "calendar-check", title: "Re-credentialing tracking", body: "Track expirables and re-credentialing dates so nothing lapses." },
      { icon: "shield-check", title: "Primary source verification", body: "Coordinate license, DEA, and primary-source verification." },
      { icon: "phone-call", title: "Application follow-up", body: "Follow up with payers to move applications to approval." },
      { icon: "clipboard-list", title: "Roster maintenance", body: "Keep provider rosters and payer records accurate and current." },
    ],
    howItWorks: [
      { title: "Scope the work", body: "We map your providers, payers, and current enrollment status." },
      { title: "Match & onboard", body: "We place a credentialing specialist with access to your records under a signed BAA." },
      { title: "Enroll & maintain", body: "Your specialist submits applications, follows up to approval, and tracks re-credentialing so nothing lapses." },
    ],
    metaTitle: "Remote Provider Credentialing Services",
    metaDescription:
      "Remote provider credentialing for U.S. practices. Zenith handles payer enrollment, CAQH, and re-credentialing so your providers get in-network faster and stay current — HIPAA-compliant, flat monthly rate.",
    serviceType: "Provider Credentialing",
    faqs: [
      { question: "How long does payer enrollment take?", answer: "Enrollment timelines are set by each payer and typically run 60 to 120 days. Zenith prepares complete applications and follows up persistently to avoid the delays caused by errors or missing information." },
      { question: "Do you manage CAQH and re-credentialing?", answer: "Yes. We build and maintain CAQH profiles, keep attestations current, and track re-credentialing and expirable dates so enrollments never lapse." },
      { question: "How is credentialing priced?", answer: "A flat monthly rate scaled to your provider count and payer mix. This is a staffing engagement, not a per-application fee." },
    ],
  },
  {
    slug: "accounts-receivable",
    category: "rcm",
    name: "Accounts Receivable (AR)",
    shortDesc: "Work down aging A/R and recover what's owed.",
    title: "Remote A/R Follow-Up that recovers the revenue stuck in aging claims.",
    lead:
      "A Zenith A/R specialist works your aging report — following up on unpaid and underpaid claims, appealing denials, and resolving patient balances — so money that's already owed to your practice actually comes in instead of aging out.",
    capabilitiesHeading: "What a Zenith A/R specialist handles",
    capabilitiesSubtitle:
      "Role-specific revenue-cycle professionals, inside your systems.",
    capabilities: [
      { icon: "line-chart", title: "Aging report follow-up", body: "Work the aging report by bucket to resolve claims before they age out." },
      { icon: "bell", title: "Denial appeals", body: "Appeal denials with the documentation payers require." },
      { icon: "clipboard-check", title: "Underpayment recovery", body: "Identify and recover underpaid claims against contracted rates." },
      { icon: "phone-call", title: "Insurance follow-up", body: "Call and follow up with payers on outstanding claims." },
      { icon: "messages-square", title: "Patient balance resolution", body: "Resolve patient balances with clear, timely outreach." },
      { icon: "clipboard-list", title: "A/R reporting", body: "Report on A/R status and trends so you always know where you stand." },
    ],
    howItWorks: [
      { title: "Scope the backlog", body: "We review your aging report and practice-management system." },
      { title: "Match & onboard", body: "We place an A/R specialist with role-based access under a signed BAA." },
      { title: "Work & recover", body: "Your specialist follows up on claims, appeals denials, and resolves balances to bring the money in." },
    ],
    metaTitle: "Remote A/R Follow-Up Services",
    metaDescription:
      "Remote accounts-receivable follow-up for U.S. practices. Zenith A/R specialists work aging claims, appeal denials, and recover underpayments inside your PM system — HIPAA-compliant, flat monthly rate.",
    serviceType: "Accounts Receivable Management",
    faqs: [
      { question: "Which claims does A/R follow-up cover?", answer: "We work your full aging report — unpaid, denied, and underpaid claims across payers — prioritizing by bucket and dollar value so the most recoverable revenue is worked first." },
      { question: "How far back can you work aged claims?", answer: "We work claims within each payer's timely-filing and appeal windows; during onboarding we review your aging report to target what is still recoverable." },
      { question: "How is A/R follow-up priced?", answer: "A flat monthly rate per specialist, scaled to your A/R volume. This is a staffing engagement, not a percentage-of-recovery fee." },
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

/* Load-time validation — fails the build on a bad registry (matches the
   posts.ts pattern). */
if (typeof window === "undefined") {
  const seen = new Set<string>();
  for (const s of services) {
    if (!s.slug) throw new Error(`services: missing slug on ${s.name}`);
    if (seen.has(s.slug)) throw new Error(`services: duplicate slug "${s.slug}"`);
    if (!s.capabilities.length)
      throw new Error(`services: no capabilities on ${s.slug}`);
    if (s.howItWorks.length !== 3)
      throw new Error(`services: "${s.slug}" needs exactly 3 how-it-works steps`);
    if (s.category === "rpm" && !s.billing?.length)
      throw new Error(`services: RPM service "${s.slug}" has no billing codes`);
    seen.add(s.slug);
  }
}
