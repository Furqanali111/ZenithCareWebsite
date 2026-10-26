/**
 * CPT code registry, source of truth for the programmatic pages under
 * /services/care-management/cpt-codes/[code] and the sitemap / llms.txt entries.
 *
 * SILO: these pages live inside the Care Management silo. They link up to their
 * program page (/services/<slug>) and the hub, sideways only to codes in the
 * same silo, and out to posts tagged for that program. See the code page.
 *
 * Content rules (claims hygiene): descriptions are paraphrased, never verbatim
 * AMA text. Rates are 2026 Medicare national averages and vary by locality. CCM
 * rates read from roi.ts so they never drift. Entries are educational, not
 * billing advice. Zenith does not bill Medicare.
 *
 * A code only ships if it passes the load-time checks at the bottom, so a thin
 * "{code} swapped into boilerplate" page cannot reach production.
 */

import { CPT_RATES } from "./roi";

export const CPT_BASE = "/services/care-management/cpt-codes";

export type CptProgram = "ccm" | "pcm" | "rpm" | "tcm";

/** Program -> the existing /services/<slug> page that parents its codes. */
export const programMeta: Record<
  CptProgram,
  { label: string; serviceSlug: string }
> = {
  ccm: { label: "Chronic Care Management", serviceSlug: "chronic-care-management" },
  pcm: { label: "Principal Care Management", serviceSlug: "principal-care-management" },
  rpm: { label: "Remote Patient Monitoring", serviceSlug: "remote-patient-monitoring" },
  tcm: { label: "Transitional Care Management", serviceSlug: "transitional-care-management" },
};

export type CptFaq = { question: string; answer: string };

export type CptCodeEntry = {
  code: string;
  program: CptProgram;
  /** Short title, appended to "CPT <code>: " in the <title>. */
  shortTitle: string;
  metaDescription: string;
  summary: string;
  time: string;
  performer: string;
  frequency: string;
  rate: string;
  requirements: string[];
  pitfalls: string[];
  /** Codes in this registry commonly reported alongside this one. */
  pairsWith: string[];
  conflicts?: string;
  faqs: CptFaq[];
};

const ccm = (c: keyof typeof CPT_RATES) => `~$${CPT_RATES[c]}`;

const CCM_ELIGIBILITY =
  "Two or more chronic conditions expected to last at least 12 months or until death, with significant risk of decline";

export const cptCodes: readonly CptCodeEntry[] = [
  /* ------------------------------- CCM ---------------------------------- */
  {
    code: "99490",
    program: "ccm",
    shortTitle: "CCM, first 20 minutes",
    metaDescription:
      "CPT 99490 explained: the base monthly CCM code. Time threshold, documentation, consent, who can perform it, the 2026 rate and common audit gaps.",
    summary:
      "The base monthly Chronic Care Management code. It pays for the first 20 minutes of clinical staff time spent coordinating care for a patient with two or more chronic conditions, under the billing practitioner's direction.",
    time: "20 minutes of clinical staff time per calendar month",
    performer: "Clinical staff under the billing practitioner's direction",
    frequency: "Once per patient per calendar month, by one practitioner",
    rate: ccm("99490"),
    requirements: [
      CCM_ELIGIBILITY,
      "Documented patient consent (verbal or written) covering cost sharing and the right to stop",
      "A comprehensive care plan in the record, shared with the patient or caregiver",
      "A time log showing minutes, who performed them and what was done",
      "24/7 access to the care team and continuity with a designated team member",
    ],
    pitfalls: [
      "Billing before the 20-minute threshold is reached; minutes do not roll into next month",
      "Missing or undated consent, the most common audit gap",
      "Two practitioners billing CCM for the same patient in the same month",
      "Counting time that was already part of a separately billed visit",
    ],
    pairsWith: ["99439"],
    conflicts:
      "Not reported in the same month as 99487 or 99491 by the same practitioner for the same patient.",
    faqs: [
      {
        question: "What is the minimum time to bill CPT 99490?",
        answer:
          "Twenty minutes of qualifying clinical staff time in the calendar month. Anything under that is not reportable and does not carry over.",
      },
      {
        question: "Can the same patient be billed 99490 by two practices?",
        answer:
          "No. Only one practitioner can bill CCM for a patient in a given month, so confirm no other practice is already billing before you enroll.",
      },
      {
        question: "Does Zenith bill 99490 to Medicare?",
        answer:
          "No. Your practice bills the code. Zenith supplies the clinical staff time and invoices your practice for the labor.",
      },
    ],
  },
  {
    code: "99439",
    program: "ccm",
    shortTitle: "CCM add-on, extra 20 min",
    metaDescription:
      "CPT 99439 explained: the CCM add-on for each extra 20 minutes of clinical staff time. Monthly limit, documentation, 2026 rate and pairing rules.",
    summary:
      "An add-on code reported with 99490 for each additional 20 minutes of clinical staff time in the same month. It lifts revenue on patients who need more than the base amount of coordination.",
    time: "Each additional 20 minutes beyond the first 20",
    performer: "Clinical staff under the billing practitioner's direction",
    frequency: "Add-on to 99490; CMS caps the number of units per month",
    rate: ccm("99439"),
    requirements: [
      "99490 already met for the same patient and month",
      "A running time log that shows the minutes beyond the first 20",
      "The same consent and care plan that support 99490",
      "Notes showing the extra time was real care coordination, not duplicate effort",
    ],
    pitfalls: [
      "Reporting 99439 without 99490 on the claim",
      "Exceeding the monthly unit cap",
      "Adding time with no note describing what the staff member did",
    ],
    pairsWith: ["99490"],
    faqs: [
      {
        question: "Can 99439 be billed on its own?",
        answer:
          "No. It is an add-on and is only reported together with 99490 for the same patient and month.",
      },
      {
        question: "How many units of 99439 can a practice bill per month?",
        answer:
          "CMS limits the number of units per patient per month. Check the current Physician Fee Schedule before relying on any unit count.",
      },
    ],
  },
  {
    code: "99487",
    program: "ccm",
    shortTitle: "Complex CCM, first 60 min",
    metaDescription:
      "CPT 99487 explained: complex CCM for patients needing 60 minutes of clinical staff time and moderate to high decision-making. Rules, rate and audit gaps.",
    summary:
      "Complex CCM covers a higher-intensity month: at least 60 minutes of clinical staff time, moderate or high complexity medical decision-making, and a care plan that is established or substantially revised.",
    time: "60 minutes of clinical staff time per calendar month",
    performer: "Clinical staff under the billing practitioner's direction",
    frequency: "Once per patient per calendar month, by one practitioner",
    rate: ccm("99487"),
    requirements: [
      CCM_ELIGIBILITY,
      "Moderate or high complexity medical decision-making documented by the practitioner",
      "Establishment or substantial revision of the comprehensive care plan that month",
      "Documented consent and a time log reaching 60 minutes",
    ],
    pitfalls: [
      "Using 99487 when the care plan was not actually revised that month",
      "No documented decision-making level to support the code",
      "Billing 99487 and 99490 together for the same patient and month",
    ],
    pairsWith: ["99489"],
    conflicts: "Used instead of 99490 for the same patient and month, not alongside it.",
    faqs: [
      {
        question: "When should a practice use 99487 instead of 99490?",
        answer:
          "When the month needed at least 60 minutes of staff time and the practitioner's decision-making and care plan changes were moderate to high complexity. Otherwise the base code applies.",
      },
      {
        question: "Does the complex code pay more than the base code?",
        answer:
          "Yes, roughly double the base rate nationally. Actual amounts vary by locality and payer.",
      },
    ],
  },
  {
    code: "99489",
    program: "ccm",
    shortTitle: "Complex CCM add-on",
    metaDescription:
      "CPT 99489 explained: the add-on to complex CCM for each additional 30 minutes of clinical staff time. Pairing rules, documentation and 2026 rate.",
    summary:
      "An add-on reported with 99487 for each additional 30 minutes of clinical staff time beyond the first 60 in a month.",
    time: "Each additional 30 minutes beyond the first 60",
    performer: "Clinical staff under the billing practitioner's direction",
    frequency: "Add-on to 99487 only",
    rate: ccm("99489"),
    requirements: [
      "99487 supported for the same patient and month",
      "Time log showing minutes beyond the first 60, in 30-minute blocks",
      "Care plan and consent documentation already supporting 99487",
    ],
    pitfalls: [
      "Reporting 99489 with 99490 instead of 99487",
      "Rounding up to a full 30-minute block that was not reached",
    ],
    pairsWith: ["99487"],
    faqs: [
      {
        question: "Is 99489 billed per 20 minutes like 99439?",
        answer:
          "No. 99489 counts in 30-minute blocks beyond the first 60 minutes, and only with 99487.",
      },
      {
        question: "Can I bill 99489 on a month with 99490?",
        answer:
          "No. 99489 only attaches to 99487. A month billed with the base code uses 99439 for extra time instead.",
      },
    ],
  },
  {
    code: "99491",
    program: "ccm",
    shortTitle: "CCM by the physician",
    metaDescription:
      "CPT 99491 explained: CCM time personally performed by a physician or qualified practitioner. Time threshold, rules, pairing with 99437 and 2026 rate.",
    summary:
      "CCM reported when the physician or other qualified practitioner personally spends at least 30 minutes in the month on care management, instead of clinical staff time.",
    time: "30 minutes personally performed by the practitioner per month",
    performer: "The physician or other qualified practitioner personally",
    frequency: "Once per patient per calendar month",
    rate: ccm("99491"),
    requirements: [
      CCM_ELIGIBILITY,
      "Practitioner time only; clinical staff minutes do not count toward this code",
      "Documented consent and a comprehensive care plan",
      "A time log attributing the 30 minutes to the practitioner",
    ],
    pitfalls: [
      "Counting staff time toward the practitioner's 30 minutes",
      "Billing 99491 and 99490 for the same patient in the same month",
    ],
    pairsWith: ["99437"],
    conflicts: "Not reported in the same month as 99490 or 99487 by the same practitioner.",
    faqs: [
      {
        question: "Why do most practices bill 99490 rather than 99491?",
        answer:
          "99490 uses clinical staff time, which scales without taking practitioner hours. 99491 requires the practitioner's own time, so it suits low-volume cases.",
      },
      {
        question: "Can staff minutes count toward 99491?",
        answer:
          "No. Only the physician's or qualified practitioner's own time counts for this code.",
      },
    ],
  },
  {
    code: "99437",
    program: "ccm",
    shortTitle: "CCM add-on by physician",
    metaDescription:
      "CPT 99437 explained: the add-on to 99491 for each additional 30 minutes of physician time in CCM. Pairing rules, documentation and 2026 rate.",
    summary:
      "An add-on reported with 99491 for each additional 30 minutes the practitioner personally spends on care management that month.",
    time: "Each additional 30 minutes of practitioner time",
    performer: "The physician or other qualified practitioner personally",
    frequency: "Add-on to 99491 only",
    rate: ccm("99437"),
    requirements: [
      "99491 supported for the same patient and month",
      "Practitioner time log showing minutes beyond the first 30",
      "Consent and care plan documentation in place",
    ],
    pitfalls: [
      "Reporting 99437 with 99490 or 99487",
      "Adding staff minutes to the practitioner's total",
    ],
    pairsWith: ["99491"],
    faqs: [
      {
        question: "Can 99437 be billed without 99491?",
        answer: "No. It is an add-on to 99491 and cannot stand alone.",
      },
      {
        question: "Do staff minutes count toward 99437?",
        answer: "No. Only the practitioner's own time counts.",
      },
    ],
  },

  /* ------------------------------- PCM ---------------------------------- */
  {
    code: "99424",
    program: "pcm",
    shortTitle: "PCM by physician, 30 min",
    metaDescription:
      "CPT 99424 explained: Principal Care Management for one serious condition, with 30 minutes of physician time. Eligibility, documentation and 2026 rate.",
    summary:
      "Monthly management of one serious, high-risk condition when the physician or qualified practitioner personally spends at least 30 minutes in the month.",
    time: "30 minutes of practitioner time per calendar month",
    performer: "The physician or other qualified practitioner personally",
    frequency: "Once per patient per month",
    rate: "~$88",
    requirements: [
      "One complex chronic condition expected to last at least 3 months, with significant risk of hospitalization, decline or death",
      "A disease-specific care plan developed, monitored or revised",
      "An initiating visit for new patients, or patients not seen within the past year, to explain PCM and get consent",
      "Documented consent and a practitioner time log",
    ],
    pitfalls: [
      "Using PCM for a patient with several conditions that fit CCM better",
      "Billing PCM and CCM for the same patient, month and practitioner",
    ],
    pairsWith: ["99425"],
    conflicts:
      "Not reported with CCM for the same patient and month by the same practitioner, and not in the same month as the staff-time PCM codes 99426 and 99427.",
    faqs: [
      {
        question: "How is PCM different from CCM?",
        answer:
          "CCM is for two or more chronic conditions. PCM is for one complex, high-risk condition that needs focused management.",
      },
      {
        question: "Can a specialist bill PCM while the PCP bills CCM?",
        answer:
          "Yes, different practitioners can bill each for different needs, as long as the rules for each code are met and documented.",
      },
    ],
  },
  {
    code: "99425",
    program: "pcm",
    shortTitle: "PCM add-on by physician",
    metaDescription:
      "CPT 99425 explained: the PCM add-on for each additional 30 minutes of physician time. When it applies, documentation and the 2026 national rate.",
    summary:
      "An add-on reported with 99424 for each additional 30 minutes of practitioner time on the single qualifying condition.",
    time: "Each additional 30 minutes of practitioner time",
    performer: "The physician or other qualified practitioner personally",
    frequency: "Add-on to 99424; monthly unit limits apply",
    rate: "~$61",
    requirements: [
      "99424 supported for the same patient and month",
      "Time log showing minutes beyond the first 30",
      "Care plan and consent already on file",
    ],
    pitfalls: [
      "Reporting 99425 with the clinical staff code 99426",
      "Exceeding the monthly add-on limit",
    ],
    pairsWith: ["99424"],
    faqs: [
      {
        question: "Does 99425 attach to 99426?",
        answer: "No. 99425 goes with 99424. The staff-time add-on is 99427.",
      },
      {
        question: "Is there a monthly limit on 99425?",
        answer: "Monthly unit limits apply. Confirm the current count in the Physician Fee Schedule.",
      },
    ],
  },
  {
    code: "99426",
    program: "pcm",
    shortTitle: "PCM by staff, 30 min",
    metaDescription:
      "CPT 99426 explained: Principal Care Management with 30 minutes of clinical staff time. Eligibility, documentation, 2026 rate and billing rules.",
    summary:
      "Monthly management of one serious condition delivered by clinical staff under the practitioner's direction, starting at 30 minutes.",
    time: "30 minutes of clinical staff time per calendar month",
    performer: "Clinical staff under the billing practitioner's direction",
    frequency: "Once per patient per month",
    rate: "~$68",
    requirements: [
      "One complex chronic condition expected to last at least 3 months, with significant risk of decline",
      "A disease-specific care plan on file",
      "An initiating visit for new patients, or patients not seen within the past year, to explain PCM and get consent",
      "Documented consent and a staff time log reaching 30 minutes",
    ],
    pitfalls: [
      "Reporting fewer than 30 minutes",
      "Billing 99426 alongside CCM for the same patient and month",
    ],
    pairsWith: ["99427"],
    conflicts:
      "Not reported with CCM for the same patient and month by the same practitioner, and not in the same month as the physician-time PCM codes 99424 and 99425.",
    faqs: [
      {
        question: "What is the minimum time for CPT 99426?",
        answer: "Thirty minutes of clinical staff time in the calendar month. Under 30 minutes is not reportable.",
      },
      {
        question: "Who performs the time for 99426?",
        answer:
          "Clinical staff under the practitioner's direction. This is the code Zenith's staff time supports, with your practice as the billing provider.",
      },
    ],
  },
  {
    code: "99427",
    program: "pcm",
    shortTitle: "PCM add-on by staff",
    metaDescription:
      "CPT 99427 explained: the PCM add-on for each extra 30 minutes of clinical staff time. Monthly limit, documentation and the 2026 national rate.",
    summary:
      "An add-on reported with 99426 for each additional 30 minutes of clinical staff time on the qualifying condition.",
    time: "Each additional 30 minutes of clinical staff time",
    performer: "Clinical staff under the billing practitioner's direction",
    frequency: "Add-on to 99426; up to twice per month",
    rate: "~$54",
    requirements: [
      "99426 supported for the same patient and month",
      "Time log showing staff minutes in 30-minute blocks beyond the first 30",
      "Care plan and consent already on file",
    ],
    pitfalls: [
      "Reporting a block that was only partly completed",
      "Using 99427 with the physician-time code 99424",
    ],
    pairsWith: ["99426"],
    faqs: [
      {
        question: "How many times can 99427 be billed per month?",
        answer: "Up to twice per month with 99426. Always check the current fee schedule for changes.",
      },
      {
        question: "Can 99427 be billed without 99426?",
        answer: "No. It is an add-on and requires 99426 for the same patient and month.",
      },
    ],
  },

  /* ------------------------------- RPM ---------------------------------- */
  {
    code: "99453",
    program: "rpm",
    shortTitle: "RPM device setup",
    metaDescription:
      "CPT 99453 explained: the one-time RPM setup and patient education code. What counts, documentation, how often it can be billed and the 2026 rate.",
    summary:
      "The one-time RPM code for setting up the monitoring device and teaching the patient how to use it.",
    time: "Setup and education, no monthly minute threshold",
    performer: "Clinical staff or the practitioner",
    frequency: "Typically once per episode of care; confirm with your MAC",
    rate: "~$20",
    requirements: [
      "A practitioner order for remote monitoring and an established relationship with the patient",
      "Documented patient consent",
      "Record that the device was set up and the patient was taught to use it",
      "A device that meets the FDA definition of a medical device",
    ],
    pitfalls: [
      "Billing setup again for a patient already within an episode of care",
      "Billing without a documented order or consent",
    ],
    pairsWith: ["99454", "99457"],
    faqs: [
      {
        question: "Can 99453 be billed every month?",
        answer: "No. It is a setup code, usually reported once per episode of care, not monthly.",
      },
      {
        question: "Does the patient need to be in the office for 99453?",
        answer:
          "Setup and education can happen in person or remotely, but both must be documented in the record.",
      },
    ],
  },
  {
    code: "99454",
    program: "rpm",
    shortTitle: "RPM device supply",
    metaDescription:
      "CPT 99454 explained: the RPM device supply code and its 16-day data rule, plus the newer 2 to 15 day option. Documentation, limits and 2026 rate.",
    summary:
      "The monthly RPM device-supply code. It requires that the device transmitted readings on at least 16 days in a 30-day period.",
    time: "At least 16 days of transmitted readings in 30 days",
    performer: "Device supplied and data transmitted; no staff time threshold",
    frequency: "Once per 30-day period per patient",
    rate: "~$52 per month",
    requirements: [
      "A device that automatically transmits or records readings",
      "A data log showing the days with readings",
      "Consent and a practitioner order already on file",
    ],
    pitfalls: [
      "Billing with fewer than 16 data days when no alternative code applies",
      "Billing two devices without checking the current supply rules",
    ],
    pairsWith: ["99453", "99457"],
    conflicts: "Not reported together with the newer 2 to 15 day supply code 99445 for the same period.",
    faqs: [
      {
        question: "What if a patient has fewer than 16 days of readings?",
        answer:
          "A newer 2026 code, 99445, covers 2 to 15 days of data. Your billing lead should confirm which code applies for each patient.",
      },
      {
        question: "Does Zenith supply the devices?",
        answer:
          "Device arrangements vary by practice. Zenith staff review the readings; we confirm the device setup with you during scoping.",
      },
    ],
  },
  {
    code: "99457",
    program: "rpm",
    shortTitle: "RPM management, 20 min",
    metaDescription:
      "CPT 99457 explained: RPM treatment management with 20 minutes of live interactive contact. Documentation, who can perform it and the 2026 rate.",
    summary:
      "Monthly RPM management time: at least 20 minutes of review of readings and care management, including live two-way contact with the patient or caregiver.",
    time: "20 minutes per calendar month with interactive communication",
    performer: "Clinical staff under direction, or the practitioner",
    frequency: "Once per patient per month for the base unit",
    rate: "~$52",
    requirements: [
      "At least one real-time two-way contact with the patient or caregiver in the month",
      "A time log showing management minutes",
      "A note linking the readings to the actions taken",
    ],
    pitfalls: [
      "Counting only automated alerts, with no live contact",
      "Logging time without recording what changed in the plan",
    ],
    pairsWith: ["99458", "99454"],
    conflicts: "Not reported in the same month as the shorter-time code 99470.",
    faqs: [
      {
        question: "Does a text message count as interactive communication?",
        answer:
          "The contact must be real-time and two-way. Confirm what your MAC accepts before relying on messages.",
      },
      {
        question: "Can clinical staff perform the 99457 time?",
        answer:
          "Yes, clinical staff under the practitioner's direction can, which is how Zenith staff support RPM programs.",
      },
    ],
  },
  {
    code: "99458",
    program: "rpm",
    shortTitle: "RPM add-on, extra 20 min",
    metaDescription:
      "CPT 99458 explained: the RPM add-on for each additional 20 minutes of management time. Pairing with 99457, documentation and billing limits.",
    summary:
      "An add-on reported with 99457 for each additional 20 minutes of management time in the same month.",
    time: "Each additional 20 minutes beyond the first 20",
    performer: "Clinical staff under direction, or the practitioner",
    frequency: "Add-on to 99457; monthly limits apply",
    rate: "Varies by locality",
    requirements: [
      "99457 supported for the same patient and month",
      "Time log showing minutes beyond the first 20",
      "Notes showing the added time was interactive management",
    ],
    pitfalls: [
      "Reporting 99458 without 99457",
      "Rounding up an incomplete 20-minute block",
    ],
    pairsWith: ["99457"],
    faqs: [
      {
        question: "Is 99458 a separate stand-alone service?",
        answer: "No. It only attaches to 99457 for the same patient and month.",
      },
      {
        question: "What changed for short management time in 2026?",
        answer:
          "A newer code, 99470, covers the first 10 minutes and cannot be billed with 99457. Check current rules to see which code fits each patient's month.",
      },
    ],
  },

  /* ------------------------------- TCM ---------------------------------- */
  {
    code: "99495",
    program: "tcm",
    shortTitle: "TCM, 14-day visit",
    metaDescription:
      "CPT 99495 explained: Transitional Care Management with moderate complexity and a visit within 14 days of discharge. Deadlines, rules and 2026 rate.",
    summary:
      "Covers the 30 days after a hospital or facility discharge when decision-making is at least moderate and the face-to-face visit happens within 14 days.",
    time: "Contact within 2 business days; visit within 14 days",
    performer: "Practitioner for the visit; clinical staff for outreach",
    frequency: "Once per patient in the 30 days after discharge",
    rate: "~$220",
    requirements: [
      "Interactive contact with the patient or caregiver within 2 business days of discharge",
      "A face-to-face visit within 14 calendar days",
      "Moderate or higher complexity decision-making documented",
      "Medication reconciliation on or before the visit date",
      "Review of the discharge information and needed follow-up",
    ],
    pitfalls: [
      "Missing the 2-business-day contact, which makes the episode non-billable",
      "Visit scheduled after day 14",
      "Two practitioners billing TCM for the same discharge",
    ],
    pairsWith: ["99496"],
    conflicts: "Only one TCM code is reported per patient per 30-day period.",
    faqs: [
      {
        question: "What happens if the 2-business-day call is missed?",
        answer:
          "Documented attempts matter, but a missed required contact generally makes the episode unbillable. Dedicated outreach staff and tracking reduce the risk.",
      },
      {
        question: "Which discharges qualify for TCM?",
        answer:
          "Discharges from an acute hospital, rehab, skilled nursing or similar facility to the community setting. Eligibility is confirmed per patient and payer.",
      },
    ],
  },
  {
    code: "99496",
    program: "tcm",
    shortTitle: "TCM, 7-day visit",
    metaDescription:
      "CPT 99496 explained: Transitional Care Management with high complexity and a visit within 7 days of discharge. Deadlines, rules and 2026 rate.",
    summary:
      "The higher TCM code: high-complexity decision-making and a face-to-face visit within 7 days of discharge.",
    time: "Contact within 2 business days; visit within 7 days",
    performer: "Practitioner for the visit; clinical staff for outreach",
    frequency: "Once per patient in the 30 days after discharge",
    rate: "~$299",
    requirements: [
      "Interactive contact within 2 business days of discharge",
      "A face-to-face visit within 7 calendar days",
      "High complexity decision-making documented",
      "Medication reconciliation on or before the visit date",
    ],
    pitfalls: [
      "Using 99496 when the visit actually happened on day 8 to 14",
      "Weak documentation of high-complexity decision-making",
    ],
    pairsWith: ["99495"],
    conflicts: "Only one TCM code is reported per patient per 30-day period.",
    faqs: [
      {
        question: "Which TCM code applies if the visit is on day 10?",
        answer:
          "99496 requires a visit within 7 days. A day 10 visit fits 99495, provided the other requirements are met.",
      },
      {
        question: "Is 99496 paid more than 99495?",
        answer:
          "Yes. It reflects higher complexity and a tighter timeline, with a higher national rate. Actual amounts vary by locality.",
      },
    ],
  },
];

export function getCpt(code: string): CptCodeEntry | undefined {
  return cptCodes.find((c) => c.code === code);
}

export function cptByProgram(program: CptProgram): CptCodeEntry[] {
  return cptCodes.filter((c) => c.program === program);
}

export const cptPath = (code: string) => `${CPT_BASE}/${code}`;

/* Load-time validation: fail the build on a thin or broken entry. All problems
   are collected so one build run lists every fix. */
if (typeof window === "undefined") {
  const errors: string[] = [];
  const seen = new Set<string>();
  const codes = new Set(cptCodes.map((c) => c.code));
  for (const c of cptCodes) {
    const t = `cpt ${c.code}`;
    if (seen.has(c.code)) errors.push(`${t}: duplicate`);
    seen.add(c.code);
    if (!programMeta[c.program]) errors.push(`${t}: unknown program`);
    if (c.requirements.length < 3) errors.push(`${t}: needs 3+ requirements`);
    if (c.pitfalls.length < 2) errors.push(`${t}: needs 2+ pitfalls`);
    if (c.faqs.length < 2) errors.push(`${t}: needs 2+ faqs`);
    // "CPT 99490: " + title + " | Zenith Care Solutions" must fit ~60 chars.
    const title = `CPT ${c.code}: ${c.shortTitle} | Zenith Care Solutions`;
    if (title.length > 60) errors.push(`${t}: title ${title.length} > 60`);
    const d = c.metaDescription.length;
    if (d < 140 || d > 160) errors.push(`${t}: description ${d} not in 140-160`);
    for (const p of c.pairsWith)
      if (!codes.has(p)) errors.push(`${t}: pairsWith unknown ${p}`);
  }
  if (errors.length) throw new Error(`cpt-codes:\n${errors.join("\n")}`);
}
