/**
 * Denial-code registry, source of truth for the programmatic pages under
 * /services/revenue-cycle-management/denial-codes/[code].
 *
 * SILO: Revenue Cycle. These pages link up to the AR and billing service pages
 * and the RCM hub, sideways to sibling denial codes, and out to RCM posts.
 *
 * Content rules: descriptions paraphrase the public X12 claim adjustment reason
 * codes (CARC), never copy them verbatim. Educational, not billing or legal
 * advice. Payer rules and deadlines vary, so pages point to the payer's own
 * policy. Entries only ship if they pass the load-time checks at the bottom.
 */

export const DENIAL_BASE = "/services/revenue-cycle-management/denial-codes";

export type DenialFaq = { question: string; answer: string };

export type DenialCode = {
  /** URL slug, e.g. "co-16". */
  slug: string;
  /** Display code, e.g. "CO-16". */
  code: string;
  shortTitle: string;
  metaDescription: string;
  summary: string;
  /** True when it is a routine contractual adjustment, not a real denial. */
  routine?: boolean;
  causes: string[];
  fixes: string[];
  prevention: string[];
  /** Slugs of related denial codes in this registry. */
  related: string[];
  faqs: DenialFaq[];
};

export const denialCodes: readonly DenialCode[] = [
  {
    slug: "co-4",
    code: "CO-4",
    shortTitle: "Modifier issue",
    metaDescription:
      "CO-4 denial explained: the procedure code does not match the modifier used or a required modifier is missing. Causes, how to fix and resubmit, prevention.",
    summary:
      "The payer says the procedure code is inconsistent with the modifier on the claim, or a modifier the code needs is missing.",
    causes: [
      "A required modifier was left off the line",
      "A modifier was added that does not apply to that procedure code",
      "Modifier order or placement does not meet the payer's edit",
    ],
    fixes: [
      "Check the original claim line against the chart and the payer's modifier policy",
      "Correct the modifier and submit a corrected claim, not an appeal",
      "If the modifier was right, call the payer and ask which edit fired",
    ],
    prevention: [
      "Run claims through a scrubber with current modifier edits",
      "Keep a payer-specific modifier cheat sheet for your common services",
    ],
    related: ["co-16", "co-11", "co-97"],
    faqs: [
      {
        question: "Is CO-4 an appeal or a corrected claim?",
        answer:
          "Usually a corrected claim. The problem is a coding error on the claim itself, so fix the modifier and resubmit within the payer's filing limit.",
      },
      {
        question: "Does CO-4 mean the service will not be paid?",
        answer:
          "No. It means the claim as submitted could not be paid. Once the modifier is right, the service is often payable.",
      },
    ],
  },
  {
    slug: "co-11",
    code: "CO-11",
    shortTitle: "Diagnosis mismatch",
    metaDescription:
      "CO-11 denial explained: the diagnosis is inconsistent with the procedure billed. Common causes, how to fix the claim or appeal, and how to prevent it.",
    summary:
      "The payer says the diagnosis code on the claim does not support the procedure billed.",
    causes: [
      "The diagnosis pointer on the claim line points to the wrong code",
      "The diagnosis is valid but not one the payer accepts for that service",
      "A coding or documentation gap left out the supporting diagnosis",
    ],
    fixes: [
      "Compare the chart, the diagnosis codes and the line-level pointers",
      "Correct the pointer or add the supported diagnosis, then submit a corrected claim",
      "If the coding is right, appeal with notes showing the medical reason",
    ],
    prevention: [
      "Check payer coverage lists for diagnosis and procedure pairs before billing",
      "Ask providers to document the reason for each service clearly",
    ],
    related: ["co-50", "co-4", "co-16"],
    faqs: [
      {
        question: "Is CO-11 the same as a medical necessity denial?",
        answer:
          "They are related but not the same. CO-11 is about the diagnosis and procedure not matching on the claim. CO-50 is the payer saying the service was not medically necessary.",
      },
      {
        question: "Can a coder fix CO-11 without the provider?",
        answer:
          "Often a pointer error can be corrected from the chart. If the diagnosis itself is missing, the provider may need to clarify the documentation.",
      },
    ],
  },
  {
    slug: "co-16",
    code: "CO-16",
    shortTitle: "Missing information",
    metaDescription:
      "CO-16 denial explained: the claim lacks information or has a submission error. What the remark code tells you, how to correct and resubmit, and prevention.",
    summary:
      "The claim is missing information or has a billing or submission error, so the payer could not process it.",
    causes: [
      "A required field is blank or wrong, such as an ID, date or provider number",
      "Patient demographics do not match the payer's records",
      "A referring or rendering provider detail is missing",
    ],
    fixes: [
      "Read the remark code (RARC) on the remittance; it names what is missing",
      "Correct the claim and resubmit it as a corrected or new claim, not as an appeal",
      "Confirm the fix with the payer if the remark code is unclear",
    ],
    prevention: [
      "Verify patient and insurance data at check-in",
      "Use a claim scrubber that blocks submissions with empty required fields",
    ],
    related: ["co-4", "co-18", "co-109"],
    faqs: [
      {
        question: "Why does CO-16 always come with a second code?",
        answer:
          "CO-16 is broad. The remark code (RARC) on the same line tells you which piece of information is missing, so always read both.",
      },
      {
        question: "Is a CO-16 claim counted as denied?",
        answer:
          "Many payers treat these as rejections to be fixed and resubmitted. Check your payer's rules, because the filing clock keeps running.",
      },
    ],
  },
  {
    slug: "co-18",
    code: "CO-18",
    shortTitle: "Duplicate claim",
    metaDescription:
      "CO-18 denial explained: the payer sees an exact duplicate claim or service. How to check the original claim, what not to resubmit, and how to prevent it.",
    summary:
      "The payer says this claim or service duplicates one it already received.",
    causes: [
      "The same claim was submitted twice, for example after a slow acknowledgement",
      "Staff resubmitted instead of checking the status of the first claim",
      "A genuine repeat service was billed without anything to tell it apart",
    ],
    fixes: [
      "Look up the first claim; it may already be paid or in process",
      "If it was paid, post the payment and do nothing further",
      "For a genuine repeat service, correct the claim with the appropriate modifier and documentation",
    ],
    prevention: [
      "Check claim status before resubmitting",
      "Set a rule for how long to wait before any follow-up on an unacknowledged claim",
    ],
    related: ["co-16", "co-4", "co-109"],
    faqs: [
      {
        question: "Should I resubmit a CO-18 claim?",
        answer:
          "Not until you have checked the original. Most CO-18 denials mean the first claim is already paid or processing.",
      },
      {
        question: "How do I avoid CO-18 when a service really was repeated?",
        answer:
          "Use the modifier your payer requires for a repeat service and make sure the chart supports a second, separate service.",
      },
    ],
  },
  {
    slug: "co-22",
    code: "CO-22",
    shortTitle: "Other payer primary",
    metaDescription:
      "CO-22 denial explained: the care may be covered by another payer under coordination of benefits. How to verify coverage order and rebill the right payer.",
    summary:
      "The payer believes another insurer should pay first under coordination of benefits.",
    causes: [
      "The patient has more than one plan and the order on file is wrong",
      "The patient's other coverage changed and was not updated",
      "Medicare is secondary to an employer plan and the claim went to Medicare first",
    ],
    fixes: [
      "Verify all active coverage and the correct order of payers",
      "Update the registration and send the claim to the primary payer first",
      "Bill the secondary payer with the primary payer's remittance attached",
    ],
    prevention: [
      "Ask every patient about other coverage at each visit",
      "Run an eligibility check that returns coordination of benefits data",
    ],
    related: ["co-27", "co-109", "co-16"],
    faqs: [
      {
        question: "Who decides which payer is primary?",
        answer:
          "Coordination of benefits rules decide it, not the practice. When in doubt, verify with both payers and the patient.",
      },
      {
        question: "Can the practice just bill the patient for CO-22?",
        answer:
          "Not before checking coverage. A CO-22 denial usually means another payer is responsible, and the contractual amounts differ by payer.",
      },
    ],
  },
  {
    slug: "co-27",
    code: "CO-27",
    shortTitle: "Coverage had ended",
    metaDescription:
      "CO-27 denial explained: expenses incurred after coverage terminated. How to check eligibility on the date of service, rebill the right payer and prevent it.",
    summary:
      "The payer says the patient's coverage had ended before the date of service.",
    causes: [
      "Eligibility was not checked for the date of service",
      "The patient changed or lost insurance and did not tell the office",
      "A plan year or enrollment period changed",
    ],
    fixes: [
      "Run an eligibility check for the exact date of service",
      "If the patient had other coverage, bill that payer",
      "If there was no coverage, follow your financial policy for patient balances",
    ],
    prevention: [
      "Verify eligibility before each visit, not just at the first one",
      "Ask patients to report any plan change before they arrive",
    ],
    related: ["co-22", "co-109", "co-197"],
    faqs: [
      {
        question: "How early should eligibility be checked?",
        answer:
          "Before the visit and again on the date of service where the schedule allows. Coverage can change between booking and arrival.",
      },
      {
        question: "Can CO-27 be appealed?",
        answer:
          "Only if the payer's records are wrong. Proof of active coverage on the date of service is what an appeal needs.",
      },
    ],
  },
  {
    slug: "co-29",
    code: "CO-29",
    shortTitle: "Timely filing expired",
    metaDescription:
      "CO-29 denial explained: the time limit for filing has expired. What proof helps an appeal, how filing limits differ by payer, and how to prevent it.",
    summary:
      "The payer says the claim reached it after the filing deadline.",
    causes: [
      "The claim was submitted late",
      "An earlier submission was rejected and never fixed",
      "The practice did not track filing limits for each payer",
    ],
    fixes: [
      "Gather proof of timely filing, such as a clearinghouse acceptance report or earlier payer response",
      "Appeal with that proof, following the payer's appeal process",
      "If no proof exists, ask your billing lead whether any adjustment is allowed under your contract",
    ],
    prevention: [
      "Track filing limits by payer; Medicare generally allows 12 months from the date of service, and other payers vary",
      "Work rejections the same day so claims are not lost",
    ],
    related: ["co-16", "co-18", "co-109"],
    faqs: [
      {
        question: "What is the Medicare timely filing limit?",
        answer:
          "Medicare generally requires claims within 12 months of the date of service. Commercial payers set their own limits, often shorter.",
      },
      {
        question: "Can a CO-29 denial be overturned?",
        answer:
          "Sometimes, with proof the claim was filed on time or that a payer error caused the delay. Without proof, it is hard to win.",
      },
    ],
  },
  {
    slug: "co-45",
    code: "CO-45",
    shortTitle: "Above fee schedule",
    metaDescription:
      "CO-45 explained: the charge exceeds the fee schedule or contracted amount. Why this is usually a normal write-off, not a denial, and when to check it.",
    summary:
      "The billed charge was higher than the payer's allowed amount, so the difference is written off as a contractual adjustment.",
    routine: true,
    causes: [
      "Your billed charge is above the payer's fee schedule or contract rate",
      "The payer paid the allowed amount, which is normal for an in-network claim",
      "A rare cause: the fee schedule or contract rate on file is out of date",
    ],
    fixes: [
      "For most claims, post the adjustment as a contractual write-off and move on",
      "Compare the allowed amount to your contract; if it is lower than agreed, treat it as an underpayment and dispute it",
      "Do not bill the patient for the CO-45 amount when you are in network",
    ],
    prevention: [
      "Keep contract rates loaded in your billing system",
      "Review payments against expected amounts so underpayments surface early",
    ],
    related: ["co-97", "co-50", "co-96"],
    faqs: [
      {
        question: "Is CO-45 a denial?",
        answer:
          "Usually no. It is a routine contractual adjustment on a paid claim. It only becomes a problem if the allowed amount is below your contract.",
      },
      {
        question: "Can the patient be billed the CO-45 amount?",
        answer:
          "Generally not for in-network claims, because the adjustment is a contractual obligation. Check your payer contract and state rules.",
      },
    ],
  },
  {
    slug: "co-50",
    code: "CO-50",
    shortTitle: "Medical necessity",
    metaDescription:
      "CO-50 denial explained: the payer says the service was not medically necessary. How to review the policy, build an appeal with records, and prevent it.",
    summary:
      "The payer decided the service was not medically necessary under its coverage policy.",
    causes: [
      "Documentation does not show why the service was needed",
      "The diagnosis does not meet the payer's coverage policy for that service",
      "The service was done more often than the policy allows",
    ],
    fixes: [
      "Read the payer's coverage policy for the service and compare it to the chart",
      "Appeal with the visit notes, test results and a short letter tying them to the policy",
      "Follow the payer's appeal deadline; Medicare redetermination requests are generally due within 120 days of the notice",
    ],
    prevention: [
      "Check coverage policies for high-cost or frequent services before they are done",
      "Train providers to document the reason, not only the result",
    ],
    related: ["co-11", "co-96", "co-197"],
    faqs: [
      {
        question: "Should every CO-50 denial be appealed?",
        answer:
          "Not automatically. Appeal when the chart supports the service under the payer's policy. If it does not, fix documentation going forward.",
      },
      {
        question: "Who writes the appeal?",
        answer:
          "A billing specialist can prepare it, but the supporting clinical notes and any medical-reason statement come from the provider.",
      },
    ],
  },
  {
    slug: "co-96",
    code: "CO-96",
    shortTitle: "Non-covered charge",
    metaDescription:
      "CO-96 denial explained: the charge is not covered by the plan. How to read the remark code, check the benefit and decide between appeal and write-off.",
    summary:
      "The payer says the service or charge is not a covered benefit under the patient's plan.",
    causes: [
      "The plan excludes the service",
      "The service is covered only under certain conditions that were not met",
      "The wrong plan or benefit was checked at registration",
    ],
    fixes: [
      "Read the remark code and check the patient's actual benefits",
      "If coverage should apply, appeal with the policy language and records",
      "If the service is excluded and you are in network, follow your contract for what the patient can be billed",
    ],
    prevention: [
      "Verify benefits for the specific service before it is done",
      "Where a service may be excluded, discuss cost with the patient first",
    ],
    related: ["co-50", "co-197", "co-45"],
    faqs: [
      {
        question: "Is CO-96 different from CO-50?",
        answer:
          "Yes. CO-96 means the plan does not cover the service at all. CO-50 means the plan covers it in general but the payer found it not medically necessary here.",
      },
      {
        question: "Can the patient be billed for a CO-96 service?",
        answer:
          "It depends on your contract, the payer's rules and whether the patient was told in advance. Check before billing the patient.",
      },
    ],
  },
  {
    slug: "co-97",
    code: "CO-97",
    shortTitle: "Bundled service",
    metaDescription:
      "CO-97 denial explained: the payment is included in the allowance for another service. How bundling edits work, when a modifier helps, and prevention tips.",
    summary:
      "The payer says this service is already included in the payment for another service billed the same day.",
    causes: [
      "A bundling edit treats the two services as one",
      "A separate, distinct service was billed without the modifier that shows it",
      "The services really are meant to be paid together",
    ],
    fixes: [
      "Check the payer's bundling edits for the two codes",
      "If the services were truly separate, submit a corrected claim with the right modifier and notes that support it",
      "If they were not, accept the bundling and adjust off the balance",
    ],
    prevention: [
      "Check bundling edits for common code pairs before billing",
      "Document separate, distinct services clearly so the modifier is supportable",
    ],
    related: ["co-4", "co-45", "co-18"],
    faqs: [
      {
        question: "Can a modifier always override CO-97?",
        answer:
          "No. A modifier helps only when the chart shows the services were truly distinct. Using one to avoid a bundling edit is a compliance risk.",
      },
      {
        question: "Is CO-97 a denial?",
        answer:
          "It is a reduction because the service is considered included in another payment. Whether to challenge it depends on whether the services were separate.",
      },
    ],
  },
  {
    slug: "co-109",
    code: "CO-109",
    shortTitle: "Wrong payer",
    metaDescription:
      "CO-109 denial explained: the claim is not covered by this payer, send it to the correct one. How to find the right payer and resubmit before time runs out.",
    summary:
      "The payer says the claim belongs to a different payer or contractor.",
    causes: [
      "The patient's plan changed to a different payer",
      "A managed care plan is responsible rather than the original program",
      "The claim was sent to the wrong payer ID or contractor",
    ],
    fixes: [
      "Run eligibility to confirm who is responsible for the date of service",
      "Send the claim to the correct payer with their payer ID",
      "Watch the filing clock; resubmitting late can lead to a CO-29 denial",
    ],
    prevention: [
      "Re-verify coverage at each visit, especially for Medicare Advantage patients",
      "Keep payer IDs in your system up to date",
    ],
    related: ["co-22", "co-27", "co-29"],
    faqs: [
      {
        question: "How is CO-109 different from CO-22?",
        answer:
          "CO-109 says the claim should go to another payer or contractor. CO-22 says another payer may be primary under coordination of benefits.",
      },
      {
        question: "Does the original payer forward the claim?",
        answer:
          "Do not count on it. Plan to resubmit to the correct payer yourself.",
      },
    ],
  },
  {
    slug: "co-197",
    code: "CO-197",
    shortTitle: "Authorization missing",
    metaDescription:
      "CO-197 denial explained: precertification, authorization or notification was absent. How to request a retro authorization, appeal, and prevent it up front.",
    summary:
      "The payer denied the claim because a required prior authorization or notification was not obtained.",
    causes: [
      "Authorization was not requested before the service",
      "The authorization was requested but the number did not reach the claim",
      "The authorization had expired or did not cover the service billed",
    ],
    fixes: [
      "Check whether an authorization exists and matches the service and dates",
      "If it exists, correct the claim with the number and resubmit",
      "If not, ask the payer whether a retroactive authorization or an appeal is allowed",
    ],
    prevention: [
      "Keep a list of services that need authorization by payer",
      "Block scheduling for those services until the authorization is on file",
    ],
    related: ["co-50", "co-96", "co-27"],
    faqs: [
      {
        question: "Can a CO-197 denial be reversed after the service?",
        answer:
          "Sometimes. Some payers allow retroactive authorization in limited cases. Many do not, so prevention matters most.",
      },
      {
        question: "Who should track authorizations?",
        answer:
          "A named person on the front-end team. Zenith's care coordinators can handle authorization requests and follow-up inside your EHR.",
      },
    ],
  },
];

export function getDenial(slug: string): DenialCode | undefined {
  return denialCodes.find((d) => d.slug === slug);
}

export const denialPath = (slug: string) => `${DENIAL_BASE}/${slug}`;

/* Load-time validation: fail the build on a thin or broken entry. */
if (typeof window === "undefined") {
  const errors: string[] = [];
  const seen = new Set<string>();
  const slugs = new Set(denialCodes.map((d) => d.slug));
  for (const d of denialCodes) {
    const t = `denial ${d.slug}`;
    if (seen.has(d.slug)) errors.push(`${t}: duplicate`);
    seen.add(d.slug);
    if (d.causes.length < 3) errors.push(`${t}: needs 3+ causes`);
    if (d.fixes.length < 3) errors.push(`${t}: needs 3+ fixes`);
    if (d.prevention.length < 2) errors.push(`${t}: needs 2+ prevention`);
    if (d.faqs.length < 2) errors.push(`${t}: needs 2+ faqs`);
    const title = `${d.code} Denial: ${d.shortTitle} | Zenith Care Solutions`;
    if (title.length > 60) errors.push(`${t}: title ${title.length} > 60`);
    const n = d.metaDescription.length;
    if (n < 140 || n > 160) errors.push(`${t}: description ${n} not in 140-160`);
    for (const r of d.related)
      if (!slugs.has(r)) errors.push(`${t}: related unknown ${r}`);
  }
  if (errors.length) throw new Error(`denial-codes:\n${errors.join("\n")}`);
}
