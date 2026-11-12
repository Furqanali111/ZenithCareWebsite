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

import fs from "node:fs";
import path from "node:path";

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
  /** What the official X12 reason-code text says, paraphrased, plus usage rules. */
  remit?: string;
  extraSources?: readonly { label: string; href: string }[];
  /** True when it is a routine contractual adjustment, not a real denial. */
  routine?: boolean;
  causes: string[];
  fixes: string[];
  prevention: string[];
  /** Slugs of related denial codes in this registry. */
  related: string[];
  faqs: DenialFaq[];
};

/** Entries live in content/denial-codes/<slug>.json (edited at /keystatic). */
const DIR = path.join(process.cwd(), "content/denial-codes");
const num = (s: string) => Number(s.replace(/\D/g, ""));

export const denialCodes: readonly DenialCode[] = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({
    ...(JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as DenialCode),
    // The file name is the URL, so it is the slug.
    slug: f.replace(/\.json$/, ""),
  }))
  .sort((a, b) => num(a.slug) - num(b.slug));

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
