import { Marquee } from "@/components/marquee";
import { ServiceBento } from "@/components/service-bento";
import { BentoGrid } from "@/components/bento-grid";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { ScrollSteps } from "@/components/scroll-steps";
import { OrbitVisual } from "@/components/orbit-visual";
import { cptCodes, cptPath } from "@/lib/cpt-codes";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  UserCog,
} from "lucide-react";
import {
  pageMetadata,
  JsonLd,
  serviceLd,
  serviceId,
  faqPageLd,
  faqId,
  webPageLd,
} from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { getAllPosts } from "@/content/posts";
import home from "@/content/home.json";
import {
  ANCHOR_MONTHLY,
  ANCHOR_PATIENTS,
  CPT_RATES,
  formatUsd,
} from "@/lib/roi";

/**
 * Homepage-only derived figure. Represents a typical panel where ~20% of
 * enrolled patients bill Complex CCM (CPT 99487) instead of the base code
 *, a realistic mix for internal-medicine and geriatric practices. Keeps
 * the single-source-of-truth rule by deriving from CPT_RATES; the dev
 * self-check in lib/roi.ts guards the base rate drift.
 */
const COMPLEX_MIX_FRACTION = 0.2;
const COMPLEX_MIX_MONTHLY =
  Math.round(ANCHOR_PATIENTS * (1 - COMPLEX_MIX_FRACTION)) * CPT_RATES["99490"] +
  Math.round(ANCHOR_PATIENTS * COMPLEX_MIX_FRACTION) * CPT_RATES["99487"];

// Who We Serve audience cards, linking to the specialty hub pages.
// Labels and hrefs mirror nav.whoWeServe in lib/site.ts; keep in sync.
const WHO_WE_SERVE = [
  {
    label: "Primary Care",
    href: "/who-we-serve/primary-care",
    icon: <Stethoscope className="size-5" aria-hidden="true" />,
    pain: home.whoPains.primaryCare,
  },
  {
    label: "Internal Medicine",
    href: "/who-we-serve/internal-medicine",
    icon: <HeartPulse className="size-5" aria-hidden="true" />,
    pain: home.whoPains.internalMedicine,
  },
  {
    label: "Geriatrics",
    href: "/who-we-serve/geriatrics",
    icon: <UserCog className="size-5" aria-hidden="true" />,
    pain: home.whoPains.geriatrics,
  },
];

// Steps, differentiators and FAQ text live in content/home.json (edited in /keystatic).
const HOME_STEPS = home.steps.map((step, i) => ({
  number: String(i + 1).padStart(2, "0"),
  ...step,
}));

const WHY_ZENITH = home.why;

// Homepage FAQ items, also fed to FAQPage JSON-LD.
const HOME_FAQ = home.faqs;

export const metadata: Metadata = pageMetadata({
  title: "Outsourced CCM, Billing & Staffing",
  description:
    "CCM, RPM, medical billing, coding, and virtual staffing for U.S. physician practices. HIPAA Business Associate. Your practice stays the billing provider.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={serviceLd({
          name: "Zenith Care Solutions: care management, billing, and virtual staffing",
          description:
            "Zenith Care Solutions provides remote care management, revenue cycle management, and virtual medical staffing for U.S. physician practices.",
          path: "/",
          serviceType: "Healthcare Practice Support",
        })}
      />
      <JsonLd
        data={[
          webPageLd({
            path: "/",
            name: "Zenith Care Solutions",
            description:
              "CCM, RPM, medical billing, coding, and virtual staffing for U.S. physician practices.",
            breadcrumb: false,
            about: serviceId("/"),
            mainEntity: faqId("/"),
          }),
          faqPageLd(HOME_FAQ, "/"),
        ]}
      />

      {/* ─── Hero: dark editorial ledger-split ────────────────────────── */}
      <HomeHero />

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />
      <Marquee
        label="CPT code guides"
        items={cptCodes.slice(0, 14).map((c) => ({ label: `CPT ${c.code}`, href: cptPath(c.code) }))}
      />

      {/* ─── Service lines (three categories) ────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal>
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                {home.servicesHeading}
              </h2>
              <ScrollRevealText
                className="mt-5 text-xl leading-relaxed text-body-ink md:text-2xl"
                text={home.servicesLead}
              />
            </header>
          </Reveal>

          <ServiceBento />
        </div>
      </section>

      {/* ─── Who We Serve ──────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-[90rem] px-6">
            <Reveal>
              <header className="max-w-2xl">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  {home.whoHeading}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-body-ink">
                  {home.whoLead}
                </p>
              </header>
            </Reveal>

            <BentoGrid
              className="mt-12"
              tiles={WHO_WE_SERVE.map((item, i) => (
                <Reveal key={item.href} delay={i * 0.08} className="h-full">
                  <Link
                    href={item.href}
                    className="spotlight group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-7 transition-[border-color] duration-300 hover:border-[color:var(--color-teal-500)]/40 md:p-8"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      {item.icon}
                    </span>
                    <h3
                      className={`mt-5 font-serif font-semibold text-brand-ink group-hover:text-brand-accent ${i === 0 ? "text-2xl" : "text-xl"}`}
                    >
                      {item.label}
                    </h3>
                    <p className={`mt-3 flex-1 leading-relaxed text-body-ink ${i === 0 ? "max-w-md text-base" : "text-sm"}`}>
                      {item.pain}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
                      Learn more
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            />
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[90rem] px-6">
          <ScrollSteps
            heading={home.stepsHeading}
            steps={HOME_STEPS}
          />
        </div>
      </section>

      {/* ─── Revenue math navy band, complex-mix ceiling vs the hero's base floor ─ */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-[90rem] px-6">
          <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] px-8 py-14 text-brand-ink md:px-14 md:py-20 dark:border-white/10 dark:bg-[color:var(--color-brand-800)] dark:text-[color:var(--color-surface-0)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[color:var(--color-teal-500)]/18 blur-3xl"
            />
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
              <div>
                <p className="text-sm text-body-ink dark:text-[color:var(--color-surface-0)]/70">
                  For practices running care management programs:
                </p>
                <span className="mt-3 inline-block text-xs font-medium tracking-[0.14em] text-brand-accent">
                  With Complex-CCM mix
                </span>
                <p className="mt-5 font-serif text-6xl font-semibold tracking-tight leading-none md:text-7xl">
                  {formatUsd(COMPLEX_MIX_MONTHLY)}
                </p>
                <p className="mt-3 text-base text-body-ink dark:text-[color:var(--color-surface-0)]/80">
                  per month, same {ANCHOR_PATIENTS}-patient panel with a 1-in-5
                  Complex-CCM share.
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Base-only revenue is{" "}
                  <span className="tabular-nums">{formatUsd(ANCHOR_MONTHLY)}</span>{" "}
                  (shown above). Shifting ~20% of patients to CPT 99487 lifts the figure
                  by roughly 20%. Internal-medicine and geriatric panels
                  typically index higher; primary-care lower.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground dark:text-[color:var(--color-surface-0)]/70">
                  Plug in your panel size and expected enrollment rate, the
                  calculator does the math client-side and shows a typical range.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-6 text-sm"
                >
                  <Link href="/roi-calculator">
                    Estimate your panel size
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Why Zenith ────────────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                {home.whyHeading}
              </h2>
            </Reveal>
            <ol className="mt-10 space-y-9">
              {WHY_ZENITH.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <li className="flex gap-5">
                    <span className="pt-1 font-serif text-sm tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-brand-ink">{item.title}</h3>
                      <p className="mt-2 max-w-md text-base leading-relaxed text-body-ink">{item.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <OrbitVisual />
        </div>
      </section>

      {/* ─── About strip ─────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-[90rem] px-6">
            <Reveal className="max-w-3xl">
              <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                {home.aboutHeading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                {home.aboutBody}
              </p>
            </Reveal>
            <p className="mt-10 text-sm">
              <Link href="/about" className="text-brand-accent hover:underline">
                About Zenith
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Resources preview ──────────────────────────────────────── */}
      <ResourcesPreview />

      {/* ─── FAQ ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <header className="text-center">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  {home.faqHeading}
                </h2>
              </header>
            </Reveal>

            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="mt-10">
                {HOME_FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-serif text-base font-semibold text-brand-ink">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-body-ink">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link href="/faq">See the full FAQ</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Final CTA band ──────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal>
          <div className="rounded-2xl border border-border/70 bg-card px-8 py-14 text-center md:px-14 md:py-20">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              {home.ctaHeading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              {home.ctaBody}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm"
              >
                <Link href="/roi-calculator">Estimate your ROI first</Link>
              </Button>
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Resources preview, shows latest 3 blog posts.                             */
/* -------------------------------------------------------------------------- */

function ResourcesPreview() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section className="section-rhythm">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal>
          <header className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              From the blog.
            </h2>
            <Link
              href="/resources"
              className="hidden items-center gap-1.5 text-sm font-medium text-brand-accent hover:underline sm:inline-flex"
            >
              All articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </header>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.08} className="h-full">
              <Link
                href={`/resources/${post.slug}`}
                className="spotlight-edge group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[var(--shadow-lift)]"
              >
                <h3 className="font-serif text-lg font-semibold leading-snug text-brand-ink group-hover:text-brand-accent">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body-ink line-clamp-3">
                  {post.description}
                </p>
                <span className="mt-4 text-xs text-muted-foreground">
                  {post.category}, {post.readingMinutes} min read
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center sm:hidden">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent hover:underline"
            >
              All articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
