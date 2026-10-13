/**
 * Client-side best-effort scan for strings that resemble protected health
 * information (PHI). This is NOT a security control, it's a usability guard
 * that catches a provider pasting patient details into our contact form and
 * blocks the submit before anything reaches Formspree.
 *
 * The regex set mirrors WebSiteDoc/05-data-schema.md §5. False positives are
 * acceptable (we tell the sender to edit); false negatives are inevitable
 * (patient names without the word "Patient", etc.). The real defence is the
 * disclaimer displayed above every form.
 */

export type PhiHit = {
  pattern: "ssn" | "mrn" | "dob" | "patient_name";
  match: string;
};

// Compiled once per module load; cheap on every submit.
//
// The DOB pattern requires a nearby trigger word (dob, d.o.b, born, birth…)
// so a provider mentioning a project date like "onboard by 03/15/2027"
// doesn't get blocked as a patient date of birth.
const PATTERNS: { kind: PhiHit["pattern"]; re: RegExp }[] = [
  { kind: "ssn", re: /\b\d{3}-\d{2}-\d{4}\b/ },
  { kind: "mrn", re: /\bMRN[:\s#-]*\w+/i },
  {
    kind: "dob",
    re: /\b(?:dob|d\.o\.b|born|birth(?:date|day)?)\b[^\n]{0,20}\d{1,2}\/\d{1,2}\/\d{4}\b/i,
  },
  // Matches "Patient Smith" / "patient Smith" (word "patient" either case,
  // followed by a Capitalized name). The negative lookahead excludes common
  // B2B phrases that follow "Patient" (Care, Coordinator, Portal, Experience)
  // so a lead mentioning the service name or asking a portal/experience
  // question isn't blocked as PHI.
  {
    kind: "patient_name",
    re: /\b[Pp]atient\s+(?![Cc]are\b|[Cc]oordinator\b|[Pp]ortal\b|[Ee]xperience\b)[A-Z][a-z]+/,
  },
];

/** Returns the first PHI-shaped hit in `text`, or null. */
export function findPhi(text: string): PhiHit | null {
  for (const { kind, re } of PATTERNS) {
    const m = text.match(re);
    if (m) return { pattern: kind, match: m[0] };
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Dev-only self-check, server-only so HMR doesn't double-log.               */
/* -------------------------------------------------------------------------- */
if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
  const must = (text: string, kind: PhiHit["pattern"]) => {
    const hit = findPhi(text);
    if (!hit || hit.pattern !== kind) {
      throw new Error(`validate: expected ${kind} hit in "${text}", got ${JSON.stringify(hit)}`);
    }
  };
  const must_not = (text: string) => {
    const hit = findPhi(text);
    if (hit) throw new Error(`validate: unexpected ${hit.pattern} hit in "${text}"`);
  };
  must("Here is 123-45-6789 for you", "ssn");
  must("MRN: 445566", "mrn");
  must("DOB 03/14/1952 please", "dob");
  must("born 03/14/1952", "dob");
  must("Patient Smith has diabetes", "patient_name");
  must("the patient Johnson is overdue", "patient_name");
  must_not("Please call me at 555-1234");
  must_not("I have 2 patients ready");
  // Our own service name and common B2B phrases must not be flagged as PHI.
  must_not("We'd like Patient Care Coordinator staffing");
  must_not("interested in your Patient Coordinator service");
  must_not("Does this integrate with our Patient Portal?");
  must_not("we want to improve Patient Experience");
  // Project / timeline dates must NOT be flagged as DOB.
  must_not("We'd like to onboard by 03/15/2027");
  must_not("Last audit was 12/31/2024");
}
