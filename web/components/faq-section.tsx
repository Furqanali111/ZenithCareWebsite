import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd, faqPageLd } from "@/lib/seo";
import { FaqAnswer } from "@/components/faq-answer";

export type FaqEntry = { question: string; answer: string };

/**
 * On-page FAQ block + matching FAQPage JSON-LD, for service / landing pages.
 *
 * Why it exists: direct question→answer pairs are the single highest-signal
 * format for AI answer engines (Perplexity, ChatGPT search, Google AI
 * Overviews) and for long-tail search intent. Each service page carries its
 * OWN service-specific questions, distinct from the general /faq corpus, so
 * no two URLs emit the same FAQPage (per Google's duplicate-FAQ guidance).
 *
 * Note on rich results: since 2023 Google shows FAQ rich snippets only for
 * authoritative gov/health domains. The markup is still valid, is not
 * penalised, and is consumed by AI engines, which is the point here.
 *
 * Reuses the house Accordion (keyboard-accessible Radix) and the shared
 * faqPageLd factory. Questions should be real user questions; answers must
 * be drawn from content already on the page, never fabricate claims.
 */
export function FaqSection({
  heading = "Frequently asked questions",
  id = "faq",
  items,
  idPrefix,
  tone = "default",
}: {
  heading?: string;
  id?: string;
  items: FaqEntry[];
  /** Stable prefix for AccordionItem values; defaults to the section id. */
  idPrefix?: string;
  /** Background tone: "default" for bg-background, "surface" for bg-surface-tint. */
  tone?: "default" | "surface";
}) {
  if (items.length === 0) return null;
  const prefix = idPrefix ?? id;

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={`border-t border-border/60 ${tone === "surface" ? "bg-surface-tint" : "bg-background"}`}
    >
      <div className="section-rhythm">
        <div className="mx-auto max-w-3xl px-6">
          <JsonLd data={faqPageLd(items)} />
          <h2
            id={`${id}-heading`}
            className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl"
          >
            {heading}
          </h2>
          <Accordion type="multiple" className="mt-8">
            {items.map((item, i) => (
              <AccordionItem key={item.question} value={`${prefix}-${i}`}>
                <AccordionTrigger className="text-left font-medium text-ink-strong">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-body-ink">
                  <FaqAnswer text={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
