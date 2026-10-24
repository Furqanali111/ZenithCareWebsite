import faqJson from "@/content/faq.json";

/**
 * Shape of a single FAQ entry, mirrored from WebSiteDoc/Requirements/05-data-schema.md §3
 * and content/faq.json. Kept narrow on purpose, add fields only when a
 * component actually needs them.
 */
export type FaqCategory =
  | "Basics"
  | "Billing"
  | "Compliance"
  | "Working With Us"
  | "Pricing";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  relatedPostSlugs?: string[];
};

type FaqFile = { items: FaqItem[] };

const file = faqJson as FaqFile;

/* -------------------------------------------------------------------------- */
/* Load-time validation. Read-only (duplicate id / empty field detection),   */
/* throws loudly in BOTH dev and prod. Failing a build is better than         */
/* shipping a bad FAQPage JSON-LD that Google rejects wholesale.              */
/* -------------------------------------------------------------------------- */
function validate(entries: FaqItem[]): FaqItem[] {
  const seen = new Set<string>();
  for (const it of entries) {
    if (!it.id || typeof it.id !== "string") {
      throw new Error(`faq: missing id on entry ${JSON.stringify(it)}`);
    }
    if (seen.has(it.id)) {
      throw new Error(`faq: duplicate id "${it.id}"`);
    }
    if (!it.question?.length) {
      throw new Error(`faq: empty question on id "${it.id}"`);
    }
    if (!it.answer?.length) {
      throw new Error(`faq: empty answer on id "${it.id}"`);
    }
    seen.add(it.id);
  }
  return entries;
}

const ITEMS: readonly FaqItem[] = Object.freeze(validate(file.items ?? []));

/** All FAQ items, in file order. Safe to call during SSG. */
export function getAllFaqs(): readonly FaqItem[] {
  return ITEMS;
}

/** FAQ items filtered to a single category. */
export function getFaqsByCategory(category: FaqCategory): readonly FaqItem[] {
  return ITEMS.filter((it) => it.category === category);
}

/** One item by id, or undefined. */
export function getFaqById(id: string): FaqItem | undefined {
  return ITEMS.find((it) => it.id === id);
}

/** The distinct categories present in the corpus, in first-seen order. */
export function getFaqCategories(): readonly FaqCategory[] {
  const out: FaqCategory[] = [];
  for (const it of ITEMS) if (!out.includes(it.category)) out.push(it.category);
  return out;
}
