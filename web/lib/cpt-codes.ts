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

import fs from "node:fs";
import path from "node:path";
import { CPT_RATES } from "./roi";

export const CPT_BASE = "/services/care-management/cpt-codes";

export type CptProgram = "ccm" | "pcm" | "rpm" | "rtm" | "tcm";

/** Program -> the existing /services/<slug> page that parents its codes. */
export const programMeta: Record<
  CptProgram,
  { label: string; serviceSlug: string }
> = {
  ccm: { label: "Chronic Care Management", serviceSlug: "chronic-care-management" },
  pcm: { label: "Principal Care Management", serviceSlug: "principal-care-management" },
  rpm: { label: "Remote Patient Monitoring", serviceSlug: "remote-patient-monitoring" },
  rtm: { label: "Remote Therapeutic Monitoring", serviceSlug: "remote-therapeutic-monitoring" },
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
  /** Sourced statements from CMS publications, shown with a link to the source. */
  cmsFacts?: readonly string[];
  cmsSource?: { label: string; href: string };
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

/** Entries live in content/cpt-codes/<code>.json (edited at /keystatic). A "{ccm:99490}" rate
 *  token expands to the roi.ts rate so CCM figures never drift. */
const DIR = path.join(process.cwd(), "content/cpt-codes");
const rate = (r: string) =>
  r.replace(/\{ccm:(\d+)\}/g, (_, c: string) => {
    const v = CPT_RATES[c as keyof typeof CPT_RATES];
    if (v === undefined) throw new Error(`cpt-codes: no CCM rate for ${c}`);
    return `~$${v}`;
  });

export const cptCodes: readonly CptCodeEntry[] = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const e = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as CptCodeEntry & { order?: number };
    // The file name is the URL, so it is the code.
    return {
      ...e,
      code: f.replace(/\.json$/, ""),
      rate: rate(e.rate),
      // The editor saves an empty source as {label:"",href:""}; the page expects it absent.
      cmsSource: e.cmsSource?.href ? e.cmsSource : undefined,
      order: e.order ?? 1e6,
    };
  })
  .sort((a, b) => a.order - b.order || a.code.localeCompare(b.code));

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
