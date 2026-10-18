import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, faqPageLd, breadcrumbLd } from "@/lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  getAllFaqs,
  getFaqCategories,
  getFaqsByCategory,
  type FaqCategory,
} from "@/lib/faq";

const PATH = "/faq";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Common questions about Chronic Care Management, Medicare billing, HIPAA posture, and working with Zenith Care Solutions.",
  path: PATH,
});

export default function FaqPage() {
  const all = getAllFaqs();
  const categories = getFaqCategories();

  return (
    <>
      <JsonLd
        data={[
          faqPageLd(all.map(({ question, answer }) => ({ question, answer }))),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: PATH },
          ]),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-14 md:pt-32 md:pb-16">
        <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium tracking-[0.14em] text-brand-accent">
          FAQ
        </span>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
          Frequently asked questions.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-body-ink md:text-lg">
          The things practice managers, physicians, and compliance leads ask on
          every discovery call. If yours isn&rsquo;t here, book a 15-min
          call, we&rsquo;ll answer on the spot.
        </p>
      </section>

      {/* ─── Grouped accordion ───────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-16 md:pb-20">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={getFaqsByCategory(category)}
          />
        ))}
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Didn&rsquo;t find your question?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
            A 15-minute call is faster than another search. We&rsquo;ll
            answer specifics for your panel size, EHR, and timeline.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services/chronic-care-management">
                CCM services overview
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function CategorySection({
  category,
  items,
}: {
  category: FaqCategory;
  items: ReturnType<typeof getFaqsByCategory>;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="font-serif text-xl font-semibold tracking-tight text-brand-ink">
        {category}
      </h2>
      <Accordion type="multiple" className="mt-4">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left font-medium text-ink-strong">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-body-ink">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
