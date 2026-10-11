import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata, JsonLd, serviceLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";
import { HeroEyebrow } from "@/components/hero-eyebrow";
import { TrustStrip } from "@/components/trust-strip";
import { FaqSection, type FaqEntry } from "@/components/faq-section";

const PATH = "/services/patient-care-coordinator";
const NAME = "Patient Care Coordinator Services";
const DESCRIPTION =
  "Remote patient care coordinators for U.S. physician practices: pre-visit prep, referrals, prior authorizations, and inbox triage. HIPAA-compliant, inside your EHR.";

export const metadata: Metadata = pageMetadata({
  title: NAME,
  description: DESCRIPTION,
  path: PATH,
});

export default function PatientCareCoordinatorPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceLd({
            name: NAME,
            description: DESCRIPTION,
            path: PATH,
            serviceType: "Patient Care Coordination",
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: PATH },
            { name: "Patient Care Coordinator", path: PATH },
          ]),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-dotgrid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="max-w-3xl">
            <HeroEyebrow>Services</HeroEyebrow>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
              A remote care coordinator who takes the clinical admin off your front desk.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-body-ink md:text-lg">
              Dedicated staff who prep charts before visits, chase referrals and
              authorizations, triage the patient inbox, and keep your schedule
              full — so your MAs and physicians stay focused on the room.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm"
              >
                <Link href="/services/chronic-care-management">
                  See CCM services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust strip ─────────────────────────────────────────────── */}
      <TrustStrip tone="surface" />

      {/* ─── What a coordinator covers ───────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-5xl px-6">
          <header className="max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              What a Zenith coordinator does, in a typical week.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-body-ink">
              Scope is sized to your practice — most clients start with one
              coordinator for a provider or small pod and scale from there.
              Every workflow lives inside your EHR, with clinical escalation
              paths back to your team.
            </p>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <WorkflowCard
              label="Before the visit"
              items={[
                "Pre-visit chart prep: last-visit summary, open gaps, labs due",
                "Appointment reminders and no-show follow-up",
                "Insurance eligibility and prior-authorization checks",
                "New-patient intake forms and records requests",
              ]}
            />
            <WorkflowCard
              label="During and after"
              items={[
                "Referral placement with closed-loop follow-up",
                "Patient portal and inbox triage, routed by urgency",
                "Rx refill coordination with the clinical team",
                "Care-gap and screening outreach by panel",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── Division of labor ───────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="section-rhythm">
          <div className="mx-auto max-w-5xl px-6">
            <header className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                Where the coordinator ends and your clinicians begin.
              </h2>
            </header>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <LaborColumn
                label="Zenith coordinator"
                items={[
                  "Non-clinical admin tasks — scheduling, forms, portal messages, referrals",
                  "Insurance verification, prior-auth submission, status follow-up",
                  "Pre-visit chart review and summary notes drafted for the provider",
                  "Routine patient outreach for care gaps, labs, and recall lists",
                ]}
              />
              <LaborColumn
                label="Your clinical team"
                items={[
                  "All clinical decisions and anything requiring medical judgment",
                  "Final sign-off on prior-auth clinical narratives and appeals",
                  "Direct patient care, exam-room workflow, and triage of urgent symptoms",
                  "Supervision and quality review of the coordinator's work",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Zenith for this role ────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-14">
            <div>
              <HeroEyebrow>Why Zenith</HeroEyebrow>
              <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
                A coordinator who understands clinical context.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Most remote-admin providers staff this role with general virtual
                assistants. Zenith trains coordinators on the clinical workflows
                a primary-care or specialty practice actually runs — pre-visit
                planning, referral loops, prior-authorization patterns, portal
                triage — under the same PharmD-led oversight that supervises
                our CCM program.
              </p>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Pricing is a flat monthly rate per coordinator, scaled to the
                hours and panel size you need. No PHI leaves your systems.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-surface-tint p-6 md:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-accent">
                Good fit if your practice
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-body-ink">
                <BulletedListItem>
                  Loses visits to no-shows because reminders and prep aren&rsquo;t
                  consistent.
                </BulletedListItem>
                <BulletedListItem>
                  Has prior authorizations and referrals piling up without
                  closed-loop follow-up.
                </BulletedListItem>
                <BulletedListItem>
                  Runs on MAs who are too stretched to work the portal inbox or
                  care-gap lists.
                </BulletedListItem>
                <BulletedListItem>
                  Wants to pair this with a Chronic Care Management program,
                  under one vendor and one BAA.
                </BulletedListItem>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIPAA callout ───────────────────────────────────────────── */}
      <section className="section-rhythm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-border/70 bg-card p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_auto] md:items-center">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                  HIPAA Business Associate from day one.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink">
                  Coordinators work inside your EHR and portal with role-based
                  access the same way your in-house staff would. BAA signed
                  before access is provisioned. No PHI exported.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm"
              >
                <Link href="/hipaa-compliance">
                  Read our HIPAA posture
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ (service-specific; emits FAQPage JSON-LD) ───────────── */}
      <FaqSection
        heading="Patient Care Coordinator: common questions"
        idPrefix="pcc-faq"
        items={PCC_FAQS}
      />

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-background">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Fifteen minutes to scope the role.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              Tell us where the admin bottleneck is. We&rsquo;ll sketch the
              coordinator&rsquo;s week, confirm pricing, and tell you honestly
              whether Zenith is a fit.
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
                <Link href="/services/chronic-care-management">
                  Compare with CCM
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function WorkflowCard({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-6 md:p-8">
      <h3 className="font-serif text-xl font-semibold text-brand-ink">
        {label}
      </h3>
      <ul className="mt-5 space-y-3 text-base leading-relaxed text-body-ink">
        {items.map((item) => (
          <BulletedListItem key={item}>{item}</BulletedListItem>
        ))}
      </ul>
    </div>
  );
}

function LaborColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h3 className="font-serif text-xl font-semibold text-brand-ink">
        {label}
      </h3>
      <ul className="mt-5 space-y-3 text-base leading-relaxed text-body-ink">
        {items.map((item) => (
          <BulletedListItem key={item}>{item}</BulletedListItem>
        ))}
      </ul>
    </div>
  );
}

/* Service-specific FAQs. Answers derive from the workflow cards, division-of-
   labor table, pricing note, and HIPAA callout already on this page. */
const PCC_FAQS: FaqEntry[] = [
  {
    question: "What does a remote patient care coordinator do?",
    answer:
      "Pre-visit chart prep, appointment reminders and no-show follow-up, insurance eligibility and prior-authorization checks, referral placement with closed-loop follow-up, patient portal and inbox triage, prescription refill coordination, and care-gap and screening outreach by panel.",
  },
  {
    question: "Is this a clinical role or an administrative one?",
    answer:
      "It is a non-clinical coordination role. Coordinators handle scheduling, forms, portal messages, referrals, prior authorizations, and routine outreach. All clinical decisions, exam-room care, and anything requiring medical judgment stay with your clinical team, which also supervises the coordinator's work.",
  },
  {
    question: "How is Patient Care Coordinator pricing structured?",
    answer:
      "A flat monthly rate per coordinator, scaled to the hours and panel size you need. Most practices start with one coordinator for a provider or small pod and scale from there.",
  },
  {
    question: "Can we combine a coordinator with Chronic Care Management?",
    answer:
      "Yes. You can run Patient Care Coordinator staffing and our Chronic Care Management program together under one vendor and one Business Associate Agreement.",
  },
  {
    question: "Does the coordinator access our EHR and patient portal?",
    answer:
      "Yes, with role-based access the same way your in-house staff would have, and only after a Business Associate Agreement is signed. No PHI is exported off your systems.",
  },
];
