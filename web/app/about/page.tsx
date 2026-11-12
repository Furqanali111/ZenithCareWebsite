import Link from "next/link";
import type { Metadata } from "next";
import { Eye, Handshake, Target, type LucideIcon } from "lucide-react";
import {
  pageMetadata,
  JsonLd,
  breadcrumbLd,
  webPageLd,
  ORG_ID,
} from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import about from "@/content/about.json";
import {
  categoryMeta,
  servicesByCategory,
  type ServiceCategory,
} from "@/lib/services";

const PATH = "/about";

export const metadata: Metadata = pageMetadata({
  title: "About Our Team and Service Model",
  description:
    "Zenith Care Solutions brings care management, revenue cycle support and virtual staffing to U.S. practices, coordinated within your existing workflow.",
  path: PATH,
});

// Page text lives in content/about.json (edited in /keystatic).
const { pillars: PILLARS, steps: STEPS, why: WHY } = about;

const CATEGORY_ORDER: ServiceCategory[] = ["rpm", "rcm", "staffing"];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path: PATH,
            name: "About Zenith Care Solutions",
            description: "About Zenith Care Solutions and how the team works with U.S. physician practices.",
            type: "AboutPage",
            about: ORG_ID,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: PATH },
          ]),
        ]}
      />

      {/* 1. Hero */}
      <PageHero
        title={
          <>
            Your patients need you.
            <span className="block">Your practice needs a team.</span>
          </>
        }
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
      >
        <p>{about.heroLead}</p>
      </PageHero>

      {/* 2. Who we are + team message */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal className="max-w-3xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              {about.whoHeading}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-body-ink md:text-lg">
              {about.whoBody}
            </p>
          </Reveal>

          <Reveal className="mt-14 grid gap-6 md:grid-cols-3">
            <Statement icon={Target} label="Our mission">
              {about.mission}
            </Statement>
            <Statement icon={Eye} label="Our vision">
              {about.vision}
            </Statement>
            <Statement icon={Handshake} label="Our promise">
              {about.promise}
            </Statement>
          </Reveal>

          <Reveal className="mt-16 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-14">
            <div>
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                {about.beliefHeading}
              </h3>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-body-ink">
                {about.beliefParagraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-6 font-serif text-base font-semibold text-brand-ink">
                The Zenith Care Solutions Team
              </p>
            </div>

            <figure className="spotlight-edge flex flex-col justify-center rounded-2xl border border-border bg-card p-8 md:p-10">
              <blockquote className="font-serif text-xl font-semibold leading-snug tracking-tight text-brand-ink md:text-2xl">
                <p>{`\u201c${about.quote}\u201d`}</p>
              </blockquote>
              <figcaption className="mt-6 text-sm text-body-ink">
                The Zenith Care Solutions Team
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Company message */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal className="grid gap-10 rounded-2xl border border-border bg-card p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-14 md:p-12">
            <div>
              <p className="text-sm font-semibold text-brand-accent">
                A message from Zenith
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                {about.messageHeading}
              </h2>
              <p className="mt-8 font-serif text-base font-semibold text-brand-ink">
                The Zenith Care Solutions Team
              </p>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-body-ink md:text-lg">
              {about.messageParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. The practice challenge */}
      <section className="section-rhythm">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-14">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            {about.challengeHeading}
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-body-ink md:text-lg">
            {about.challengeParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Four pillars */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-[90rem] px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            {about.pillarsHeading}
          </h2>
          <Reveal className="mt-10 grid gap-6 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="spotlight-edge rounded-xl border border-border bg-card p-6 md:p-8"
              >
                <p className="text-sm font-semibold text-brand-accent">
                  {p.name}
                </p>
                <p className="mt-3 font-serif text-xl font-semibold tracking-tight text-brand-ink md:text-2xl">
                  {p.line}
                </p>
                <p className="mt-3 text-base leading-relaxed text-body-ink">
                  {p.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 5. What we do */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            {about.servicesHeading}
          </h2>
          <Reveal className="mt-10 grid gap-6 lg:grid-cols-3">
            {CATEGORY_ORDER.map((cat) => {
              const meta = categoryMeta[cat];
              return (
                <div
                  key={cat}
                  className="spotlight-edge flex flex-col rounded-xl border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="font-serif text-xl font-semibold tracking-tight text-brand-ink md:text-2xl">
                    <Link href={meta.href} className="hover:underline">
                      {meta.label}
                    </Link>
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-body-ink">
                    {meta.blurb}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {servicesByCategory(cat).map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-body-ink transition-colors hover:border-[color:var(--color-teal-600)] hover:text-brand-accent"
                        >
                          {s.code ?? s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* 6. How we work */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-[90rem] px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            {about.stepsHeading}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink md:text-lg">
            {about.stepsLead}
          </p>
          <Reveal>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="spotlight-edge rounded-xl border border-border bg-card p-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold tracking-tight text-brand-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-body-ink">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 7. Why Zenith */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-[90rem] px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            {about.whyHeading}
          </h2>
          <Reveal className="mt-10 grid gap-x-14 gap-y-10 md:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.title}>
                <h3 className="font-serif text-xl font-semibold tracking-tight text-brand-ink">
                  {w.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-body-ink">
                  {w.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 8. Trust and safeguards */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              {about.trustHeading}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-body-ink md:text-lg">
              {about.trustBody}
            </p>
            <ul className="mt-6 max-w-3xl space-y-3 text-base text-body-ink">
              {about.trustBullets.map((b) => (
                <BulletedListItem key={b}>{b}</BulletedListItem>
              ))}
            </ul>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-base">
              <Link
                href="/hipaa-compliance"
                className="font-medium text-brand-accent hover:underline"
              >
                How we approach HIPAA compliance
              </Link>
              <Link
                href="/hipaa-statement"
                className="font-medium text-brand-accent hover:underline"
              >
                Read the HIPAA statement
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Company information: identity facts a bank or payment provider checks */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Company information
          </h2>
          <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-card text-base text-body-ink">
            {[
              ["Legal name", site.legalName],
              ["Entity", `${site.formation.state} limited liability company`],
              ...(site.ein ? [["EIN", site.ein]] : []),
              ["Mailing address", site.mailingAddress],
              ["Email", site.email],
              ...(site.phone ? [["Phone", site.phone]] : []),
              ["Hours", site.hours],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[12rem_1fr]">
                <dt className="font-semibold text-brand-ink">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            The mailing address is a mail-forwarding address, not a physical
            office.
          </p>
        </div>
      </section>

      {/* 9. Call to action */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            {about.ctaHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
            {about.ctaBody}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Statement({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="spotlight-edge group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 transition-[transform,box-shadow,border-color,background-color] duration-300 hover:border-[color:var(--color-teal-500)]/50 hover:shadow-lg md:p-9">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-[color:var(--color-teal-500)]"
      />
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[color:var(--color-brand-50)] text-brand-accent dark:bg-white/10">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-6 text-base font-semibold text-brand-accent">{label}</p>
      <p className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight text-brand-ink">
        {children}
      </p>
    </div>
  );
}
