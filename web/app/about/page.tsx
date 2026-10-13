import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, personLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FounderMonogram } from "@/components/founder-monogram";
import { BulletedListItem } from "@/components/bulleted-list";
import { Reveal } from "@/components/reveal";
import { founder } from "@/lib/site";

const PATH = "/about";

// Personal LinkedIn URL, distinct from the Zenith company page.
// Deliberately empty until the real slug is confirmed; the Person JSON-LD
// `sameAs` and the LinkedIn CTA both suppress themselves when blank, same
// pattern as the WhatsApp / Calendly guards. Dangling-reference per
// WebSiteDoc/13-deferred-items.md.
const FOUNDER_LINKEDIN = "";

export const metadata: Metadata = pageMetadata({
  title: "About Zenith Care Solutions",
  description:
    "Zenith Care Solutions was founded by Ali Hassan Kaleem, a clinical pharmacist with an oncology and bone-marrow-transplant background, to bring real clinical staff to U.S. Chronic Care Management.",
  path: PATH,
});

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
              "Clinical pharmacist with oncology and bone-marrow-transplant experience. Founded Zenith Care Solutions to bring real clinical staff to U.S. Chronic Care Management.",
            sameAs: FOUNDER_LINKEDIN ? [FOUNDER_LINKEDIN] : undefined,
            knowsAbout: [
              "Chronic Care Management",
              "Clinical Pharmacy",
              "Oncology",
              "Bone Marrow Transplant",
              "Medication Therapy Management",
              "Medicare Billing",
            ],
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: PATH },
          ]),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
          <FounderMonogram initials={founder.initials} name={founder.name} size="lg" />
          <div>
            <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-accent">
              About the founder
            </span>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
              Zenith is run by a trained{" "}
              <em className="italic">pharmacist</em>, not a call centre.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-body-ink md:text-lg">
              {founder.name} founded Zenith to bring clinical staff, people
              who understand medications, comorbidities, and compliance, to
              Chronic Care Management programs that most practices either
              don&rsquo;t run or hand to a call-centre vendor.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Credentials strip ────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <header className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Background
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Clinical background that matters when the patient is on five
              medications.
            </h2>
          </header>

          <Reveal className="mt-10 grid gap-6 md:grid-cols-2">
            <CredentialCard
              label="Specialty"
              value="Oncology & BMT"
              detail="Clinical pharmacy experience in oncology and bone-marrow-transplant care, among the highest-complexity medication regimens in medicine."
            />
            <CredentialCard
              label="Industry"
              value="Medication Therapy Management"
              detail="Prior MTM operations experience, the same workflow discipline CCM programs run on."
            />
          </Reveal>
        </div>
      </section>

      {/* ─── Why Zenith ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <header>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Why Zenith exists
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            CCM is a clinical job. We staff it that way.
          </h2>
        </header>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-body-ink">
          <p>
            Medicare reimburses physician practices for Chronic Care Management
            because the work matters: patients with two or more chronic
            conditions do measurably better when someone coordinates their
            medications, calls them before refills run out, and follows up on
            specialist appointments nobody else is tracking.
          </p>
          <p>
            Most CCM vendors staff this with general call-centre agents. That
            works for the volume math, but it leaves clinical judgment on the
            table, the thing providers trust us to bring. Zenith builds the
            program the way a pharmacist would: real clinical oversight,
            documentation that would survive an audit, workflows designed
            around medication and comorbidity patterns.
          </p>
          <p>
            Operating remotely from Pakistan with U.S. clients is a feature,
            not a workaround. It lets Zenith keep the economics competitive
            while hiring clinically trained staff, the kind of trade only
            a founder with both the clinical and operational background
            can run honestly.
          </p>
        </div>
      </section>

      {/* ─── What this means for your practice ───────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <header className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              What this means for your practice
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Four things you can expect, from day one.
            </h2>
          </header>
          <Reveal>
          <ul className="mt-10 grid gap-3 md:grid-cols-2 md:gap-x-10">
            <BulletedListItem>
              Care-coordination calls run by someone who understands drug
              interactions and specialist handoffs, not a script reader.
            </BulletedListItem>
            <BulletedListItem>
              Documentation written for your EHR with the clinical specificity
              a Medicare audit expects.
            </BulletedListItem>
            <BulletedListItem>
              Flags escalated promptly when a patient&rsquo;s symptoms or
              medication regimen need your judgment.
            </BulletedListItem>
            <BulletedListItem>
              A single monthly summary report that reads in two minutes and
              answers the three questions you&rsquo;ll ask on the call.
            </BulletedListItem>
          </ul>
          </Reveal>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
          Fifteen minutes with Ali.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
          No sales script. We confirm your eligible patient count, walk
          through the per-code math, and tell you honestly whether Zenith
          is a fit.
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
                Ali on LinkedIn
              </a>
            </Button>
          ) : null}
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function CredentialCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 font-serif text-xl font-semibold text-brand-ink">
        {value}
      </p>
      <span
        aria-hidden="true"
        className="mt-3 block h-px w-10 bg-[color:var(--color-gold-500)]/60"
      />
      <p className="mt-3 text-sm leading-relaxed text-body-ink">
        {detail}
      </p>
    </div>
  );
}
