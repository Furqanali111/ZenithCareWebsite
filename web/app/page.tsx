import Link from "next/link";
import type { Metadata } from "next";
import {
  Activity,
  ArrowRight,
  Database,
  HeartPulse,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Users,
  UserCog,
} from "lucide-react";
import { pageMetadata, JsonLd, serviceLd, faqPageLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FounderMonogram } from "@/components/founder-monogram";
import { HeroEyebrow } from "@/components/hero-eyebrow";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { TrustStrip } from "@/components/trust-strip";
import { categoryMeta } from "@/lib/services";
import { founder } from "@/lib/site";
import { getAllPosts } from "@/content/posts";
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
    pain: "High patient volumes, limited staff, and Medicare programs your panel qualifies for but no one has time to run.",
  },
  {
    label: "Internal Medicine",
    href: "/who-we-serve/internal-medicine",
    icon: <HeartPulse className="size-5" aria-hidden="true" />,
    pain: "Complex chronic patients who need monthly coordination to stay out of the ER.",
  },
  {
    label: "Geriatrics",
    href: "/who-we-serve/geriatrics",
    icon: <UserCog className="size-5" aria-hidden="true" />,
    pain: "Patients with five or more conditions, polypharmacy, and post-discharge risk.",
  },
];

// Why Zenith differentiators.
const WHY_ZENITH = [
  {
    icon: <Users className="size-5" aria-hidden="true" />,
    title: "Staff, not software",
    body: "We provide trained clinical and administrative professionals, not a platform. No new system to learn.",
  },
  {
    icon: <Database className="size-5" aria-hidden="true" />,
    title: "Inside your EHR",
    body: "All documentation lives in your system. No PHI exported, no data migration.",
  },
  {
    icon: <Receipt className="size-5" aria-hidden="true" />,
    title: "You bill, we invoice",
    body: "Your practice bills Medicare and payers. Zenith invoices you monthly for the labor.",
  },
  {
    icon: <ShieldCheck className="size-5" aria-hidden="true" />,
    title: "One BAA, one partner",
    body: "A single Business Associate Agreement covers every service line. One vendor, one relationship.",
  },
];

// Homepage FAQ items, also fed to FAQPage JSON-LD.
const HOME_FAQ = [
  {
    question: "What services does Zenith provide?",
    answer:
      "Zenith Care Solutions provides three service lines: care management (CCM, PCM, RPM, RTM, TCM), revenue cycle management (billing, coding, credentialing, AR follow-up), and virtual staffing (scribes, schedulers, receptionists, coordinators). All work is done inside your EHR under a signed BAA.",
  },
  {
    question: "Does Zenith bill Medicare or my patients?",
    answer:
      "No. Your practice remains the billing provider and bills Medicare or commercial payers under its own credentials. Zenith invoices your practice for the clinical and administrative labor at a flat monthly rate.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Typically two to four weeks, depending on the scope. We set up inside your EHR and practice management system, sign a BAA, and confirm workflows before going live.",
  },
  {
    question: "What EHR systems do you work with?",
    answer:
      "We work inside most major EHR and practice management systems. Specific compatibility is confirmed during the discovery call.",
  },
];

// The three service lines for the home preview, linking to each category hub.
const HOME_CATEGORIES = [
  { meta: categoryMeta.rpm, icon: <Activity className="size-5" aria-hidden="true" /> },
  { meta: categoryMeta.rcm, icon: <Receipt className="size-5" aria-hidden="true" /> },
  { meta: categoryMeta.staffing, icon: <Users className="size-5" aria-hidden="true" /> },
];

export const metadata: Metadata = pageMetadata({
  title: "Care Management, Billing & Staffing",
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
      <JsonLd data={faqPageLd(HOME_FAQ)} />

      {/* ─── Hero: dark editorial ledger-split ────────────────────────── */}
      <HomeHero />

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />

      {/* ─── Service lines (three categories) ────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                Three service lines. One operational partner.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Everything a practice needs to capture unbilled revenue and
                recover staff hours, under one BAA. Take one line or all three.
              </p>
            </header>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOME_CATEGORIES.map(({ meta, icon }, i) => (
              <Reveal key={meta.href} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  href={meta.href}
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    {icon}
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-brand-ink group-hover:text-brand-accent">
                    {meta.label}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
                    {meta.blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
                    Explore
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who We Serve ──────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <header className="max-w-2xl">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  Support for the practices we serve.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-body-ink">
                  Every specialty has its own patient mix and operational
                  bottleneck. We tailor scope accordingly.
                </p>
              </header>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {WHO_WE_SERVE.map((item, i) => (
                <Reveal key={item.href} delay={(i % 3) * 0.08} className="h-full">
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      {item.icon}
                    </span>
                    <h3 className="mt-5 font-serif text-xl font-semibold text-brand-ink group-hover:text-brand-accent">
                      {item.label}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
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
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <header className="max-w-2xl">
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  Three steps. Your practice stays the billing provider.
                </h2>
              </header>
            </Reveal>

            <Reveal delay={0.1}>
              <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              <HowStep
                number="01"
                title="Identify & enroll"
                body="We find patients in your panel with two or more chronic conditions on Medicare Part B, confirm eligibility, and obtain documented consent."
              />
              <HowStep
                number="02"
                title="Deliver monthly care coordination"
                body="Each month our clinical team spends 20+ minutes per patient on calls, medication reconciliation, specialist follow-up, and care-plan documentation, inside your EHR."
              />
              <HowStep
                number="03"
                title="You bill, we invoice"
                body="Your practice bills Medicare for CPT 99490 and relevant add-ons (99439 / 99487 / 99489). Zenith invoices you for the clinical labor. Monthly, predictable."
              />
              </ol>
            </Reveal>
          </div>
      </section>

      {/* ─── Revenue math navy band, complex-mix ceiling vs the hero's base floor ─ */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-7xl px-6">
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
                  <span className="font-mono">{formatUsd(ANCHOR_MONTHLY)}</span>{" "}
                  (shown above). Shifting ~20% of patients to{" "}
                  <span className="font-mono">CPT 99487</span> lifts the figure
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
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                Why Zenith.
              </h2>
            </header>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {WHY_ZENITH.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <div className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-10 flex-none items-center justify-center rounded-xl bg-[color:var(--color-brand-50)] text-brand-accent dark:bg-white/10">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-brand-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-body-ink">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Founder credibility strip ───────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
              <FounderMonogram initials={founder.initials} name={founder.name} />
              <div>
                <HeroEyebrow>The founder</HeroEyebrow>
                <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                  Zenith is run by a trained pharmacist, not a call center.
                </h2>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-body-ink">
                  Founder <strong className="font-medium text-ink-strong">{founder.name}</strong>{" "}
                  brings a clinical oncology and bone-marrow-transplant background
                  to every workflow Zenith delivers. Your practice gets care
                  coordination from staff who understand the medications, the
                  comorbidities, and the compliance posture.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span>Clinical Pharmacist</span>
                  <span aria-hidden="true">·</span>
                  <span>Oncology / BMT</span>
                  <span aria-hidden="true">·</span>
                  <Link
                    href="/about"
                    className="text-brand-accent hover:underline"
                  >
                    Read the full story →
                  </Link>
                </div>
              </div>
            </Reveal>
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
                  Frequently asked questions.
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
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
          <div className="rounded-2xl border border-border/70 bg-card px-8 py-14 text-center md:px-14 md:py-20">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Ready to find out if we are a fit?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              Fifteen minutes. We confirm your eligible patient count or scope
              the role, walk through the numbers, and tell you honestly whether
              Zenith is the right partner.
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

function HowStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex flex-col">
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-gold-500)]/35 bg-[color:var(--color-gold-100)]/35 font-mono text-sm font-medium text-[color:var(--color-gold-500)] dark:bg-[color:var(--color-gold-500)]/10">
        {number}
      </span>
      <h3 className="mt-5 font-serif text-xl font-semibold text-brand-ink">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-body-ink">
        {body}
      </p>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Resources preview, shows latest 3 blog posts.                             */
/* -------------------------------------------------------------------------- */

function ResourcesPreview() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section className="section-rhythm">
      <div className="mx-auto max-w-7xl px-6">
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
                className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-brand-accent">
                  {post.category}
                </span>
                <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-brand-ink group-hover:text-brand-accent">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body-ink line-clamp-3">
                  {post.description}
                </p>
                <span className="mt-4 text-xs text-muted-foreground">
                  {post.readingMinutes} min read
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
