import Link from "next/link";
import type { Metadata } from "next";
import { Eye, Handshake, Target, type LucideIcon } from "lucide-react";
import { pageMetadata, JsonLd, personLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";
import { FounderMonogram } from "@/components/founder-monogram";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { founder, founders } from "@/lib/site";
import {
  categoryMeta,
  servicesByCategory,
  type ServiceCategory,
} from "@/lib/services";

const PATH = "/about";

// Personal LinkedIn URL, distinct from the Zenith company page.
// Deliberately empty until the real slug is confirmed; the Person JSON-LD
// `sameAs` and the LinkedIn CTA both suppress themselves when blank, same
// pattern as the WhatsApp / Calendly guards. Dangling-reference per
// WebSiteDoc/13-deferred-items.md.
const FOUNDER_LINKEDIN = "";

export const metadata: Metadata = pageMetadata({
  title: "About Our Team and Service Model",
  description:
    "Zenith Care Solutions brings care management, revenue cycle support and virtual staffing to U.S. practices, coordinated within your existing workflow.",
  path: PATH,
});

const PILLARS = [
  {
    name: "Clinical understanding",
    line: "People who understand the work of care.",
    detail: "Care coordination supported by trained healthcare professionals.",
  },
  {
    name: "Practice control",
    line: "Your workflow. Your oversight.",
    detail: "Support designed around the practice's systems and agreed responsibilities.",
  },
  {
    name: "Connected operations",
    line: "Care, revenue and staffing with shared priorities.",
    detail: "Support across three service lines through one relationship.",
  },
  {
    name: "Clear responsibility",
    line: "Know who owns the next step.",
    detail: "A commitment to clear roles and practical communication.",
  },
];

const STEPS = [
  {
    title: "Discover your priorities",
    body: "We start with a conversation about where your team needs support and which workflows matter most.",
  },
  {
    title: "Agree scope and access",
    body: "We write down what we will do, what your team keeps, and the system access each role needs. A signed BAA comes before any access to patient information.",
  },
  {
    title: "Carry out the work",
    body: "Our team works within your EHR or care-management platform, to the scope you agreed.",
  },
  {
    title: "Review together",
    body: "We review progress with you and adjust, so you always know what is done and what needs attention.",
  },
];

const WHY = [
  {
    title: "Who does the work",
    body: "Trained team members assigned to defined roles, so you know who is responsible for each task.",
  },
  {
    title: "Where it is recorded",
    body: "Inside your EHR or care-management platform, where your team already looks.",
  },
  {
    title: "How you review it",
    body: "Reporting that fits your practice, with a cadence we agree with you at the start.",
  },
  {
    title: "Who answers your questions",
    body: "A point of contact agreed up front, with a clear route for raising issues.",
  },
];

const CATEGORY_ORDER: ServiceCategory[] = ["rpm", "rcm", "staffing"];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          personLd({
            name: founder.name,
            jobTitle: "Founder, Zenith Care Solutions",
            path: PATH,
            bio:
              "Software engineer with five years of experience delivering projects to multiple customers. Founder of Zenith Care Solutions.",
            sameAs: FOUNDER_LINKEDIN ? [FOUNDER_LINKEDIN] : undefined,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: PATH },
          ]),
        ]}
      />

      {/* 1. Hero */}
      <PageHero
        eyebrow="About Zenith"
        title={
          <>
            Your patients need you.
            <span className="block">Your practice needs a team.</span>
          </>
        }
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
      >
        <p>
          Care management, revenue cycle support and virtual staffing,
          coordinated within your practice&rsquo;s existing workflow.
        </p>
      </PageHero>

      {/* 2. Who we are + team message */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Who we are
            </h2>
            <p className="mt-6 text-base leading-relaxed text-body-ink md:text-lg">
              Zenith Care Solutions supports U.S. healthcare practices with the
              clinical coordination and operational work behind patient care.
              We bring care management, revenue cycle support and virtual
              staffing into one service relationship, with work carried out
              within the practice&rsquo;s systems. Your practice retains
              clinical oversight and its billing relationship while our team
              supports the work around them.
            </p>
          </Reveal>

          <Reveal className="mt-14 grid gap-6 md:grid-cols-3">
            <Statement icon={Target} label="Our mission">
              To help practices make more room for patient care through
              coordinated clinical and operational support.
            </Statement>
            <Statement icon={Eye} label="Our vision">
              A future in which every practice can access the support it needs
              to serve patients and run well.
            </Statement>
            <Statement icon={Handshake} label="Our promise">
              Support that fits your practice. Responsibilities your team
              understands.
            </Statement>
          </Reveal>

          <Reveal className="mt-16 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-start md:gap-14">
            <div>
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                The work behind care deserves care, too.
              </h3>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-body-ink">
                <p>
                  Every follow-up, every claim and every handoff is part of how
                  a practice serves its patients. We believe these
                  responsibilities deserve clear ownership and consistent
                  attention.
                </p>
                <p>
                  At Zenith Care Solutions, we bring care management, revenue
                  cycle support and virtual staffing together around the needs
                  of your practice. Our role is to support the work between
                  visits and behind the scenes, within the systems your team
                  uses.
                </p>
                <p>
                  Your practice retains clinical oversight and the billing
                  relationship. Our commitment is to listen before we
                  recommend, make responsibilities clear and keep
                  communication practical. Whether you need help with a care
                  program, revenue operations or a remote role, the goal is the
                  same: support that fits the way your practice works.
                </p>
                <p>
                  We want your team to know who is doing the work, what needs
                  attention and how to move forward together.
                </p>
              </div>
              <p className="mt-6 font-serif text-base font-semibold text-brand-ink">
                The Zenith Care Solutions Team
              </p>
            </div>

            <figure className="rounded-2xl border border-border bg-card p-8 md:p-10">
              <blockquote className="font-serif text-xl font-semibold leading-snug tracking-tight text-brand-ink md:text-2xl">
                <p>
                  &ldquo;The work behind care deserves the same attention as
                  the care itself.&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-6 text-sm text-body-ink">
                The Zenith Care Solutions Team
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Founders: short intros and a joint message */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Meet the founders
          </h2>
          <Reveal className="mt-10 grid gap-6 md:grid-cols-2">
            {founders.map((f) => (
              <div
                key={f.name}
                className="flex items-start gap-5 rounded-xl border border-border bg-card p-6 md:p-8"
              >
                <FounderMonogram initials={f.initials} name={f.name} size="sm" />
                <div>
                  <h3 className="font-serif text-xl font-semibold tracking-tight text-brand-ink">
                    {f.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brand-accent">
                    {f.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-body-ink">
                    {f.intro}
                  </p>
                  {f.quote ? (
                    <blockquote className="mt-4 text-base italic leading-relaxed text-body-ink">
                      <p>&ldquo;{f.quote}&rdquo;</p>
                    </blockquote>
                  ) : null}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-12">
            <h3 className="max-w-3xl font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              We built Zenith so your team can get back to patients.
            </h3>
            <div className="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-body-ink md:text-lg">
              <p>
                Practices carry more work around patient care than they have
                people to do it. Follow-ups slip, claims wait and phones go
                unanswered, while the people who should be with patients are
                buried in coordination and paperwork.
              </p>
              <p>
                Zenith exists to take that weight off your team. Care
                management, revenue cycle support and virtual staffing are
                different kinds of work, but we hold them to one standard:
                clear ownership, work done inside your systems, and a practice
                that always knows where things stand.
              </p>
              <p>
                We will never ask you to give up control. Your practice keeps
                clinical oversight and its billing relationship. Our job is to
                do the work reliably, explain it plainly and make it easy for
                you to see what is done and what needs attention.
              </p>
              <p>
                If follow-ups, claims or staffing are stretching your team,
                talk to us. We will tell you honestly whether Zenith is the
                right fit.
              </p>
            </div>
            <p className="mt-8 flex flex-wrap gap-x-8 gap-y-1 font-serif text-base font-semibold text-brand-ink">
              {founders.map((f) => (
                <span key={f.name}>
                  {f.name}, {f.title}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. The practice challenge */}
      <section className="section-rhythm">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-14">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            The work around patient care adds up.
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-body-ink md:text-lg">
            <p>
              Between visits, patients need follow-up. Behind the scenes,
              claims need submitting, payers need chasing, and calls, schedules
              and records need someone&rsquo;s attention.
            </p>
            <p>
              Each task is small. Together they compete with the time your team
              has for patients, and when ownership is unclear, things wait.
              Who is following up, who owns this claim, who is covering the
              phones?
            </p>
          </div>
        </div>
      </section>

      {/* 4. Four pillars */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            What guides our work
          </h2>
          <Reveal className="mt-10 grid gap-6 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-border bg-card p-6 md:p-8"
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
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            What we do
          </h2>
          <Reveal className="mt-10 grid gap-6 lg:grid-cols-3">
            {CATEGORY_ORDER.map((cat) => {
              const meta = categoryMeta[cat];
              return (
                <div
                  key={cat}
                  className="flex flex-col rounded-xl border border-border bg-card p-6 md:p-8"
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
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            How we work
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink md:text-lg">
            Four steps, agreed with you before the work begins.
          </p>
          <Reveal>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="rounded-xl border border-border bg-card p-6"
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
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Why practices work with Zenith
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
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Trust and safeguards
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-body-ink md:text-lg">
              Zenith signs a Business Associate Agreement (BAA) before access to
              patient information, and staff work within the practice&rsquo;s
              EHR or care-management platform.
            </p>
            <ul className="mt-6 max-w-3xl space-y-3 text-base text-body-ink">
              <BulletedListItem>
                Your practice retains clinical oversight and its billing
                relationship.
              </BulletedListItem>
              <BulletedListItem>
                Access, scope and responsibilities are agreed with you before
                the work starts.
              </BulletedListItem>
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

      {/* 9. Call to action */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Let&rsquo;s talk about the work your practice needs covered.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
            Tell us where your team needs support. We&rsquo;ll discuss the
            scope, responsibilities and fit.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Book a 15-minute call</Link>
            </Button>
            {FOUNDER_LINKEDIN ? (
              <Button asChild size="lg" variant="outline">
                <a
                  href={FOUNDER_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Furqan on LinkedIn
                </a>
              </Button>
            ) : null}
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-teal-500)]/50 hover:shadow-lg md:p-9">
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
