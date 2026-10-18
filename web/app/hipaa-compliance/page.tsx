import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BulletedListItem } from "@/components/bulleted-list";

const PATH = "/hipaa-compliance";

export const metadata: Metadata = pageMetadata({
  title: "HIPAA Compliance",
  description:
    "How Zenith operates as a HIPAA Business Associate: signed BAA with every client, work inside your EHR, encrypted communications only.",
  path: PATH,
});

export default function HipaaCompliancePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "HIPAA Compliance", path: PATH },
        ])}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-3xl">
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium tracking-[0.14em] text-brand-accent">
            Trust &amp; compliance
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink md:text-5xl">
            HIPAA Business Associate, from day one.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-body-ink md:text-lg">
            Zenith signs a Business Associate Agreement with every client
            practice before any patient information changes hands. We work
            inside your EHR, use HIPAA-eligible tools, and keep PHI off any
            platform that isn&rsquo;t covered by a BAA.
          </p>
        </div>
      </section>

      {/* ─── Zero PHI on this site + BAA posture ─────────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-10">
            <div
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-900)] text-[color:var(--color-surface-0)]"
            >
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                This website collects no protected health information.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Our contact form, chatbot, and analytics are limited to
                business-contact information from providers and administrators.
                We ask every visitor to <strong className="font-medium text-ink-strong">keep patient details out of this site and out of unencrypted email</strong>.
                If you need to share PHI with us, we&rsquo;ll do it under a
                signed BAA, inside your EHR or an equivalent HIPAA-covered
                channel.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <TrustCard
              title="Signed BAA before any PHI"
              body="Before a single patient record moves, Zenith signs a Business Associate Agreement with your practice. The BAA governs permitted uses, safeguards, breach notification, and return or destruction of PHI at the end of the engagement."
            />
            <TrustCard
              title="Your EHR stays the system of record"
              body="Clinical staff work inside the EHR or CCM platform your practice already uses. No PHI gets exported to Zenith-owned tooling. The patient record never leaves your governance."
            />
          </div>
        </div>
      </section>

      {/* ─── Safeguards ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <header className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Safeguards
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
            Three layers, the HIPAA Security Rule way.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-body-ink">
            Our safeguards framework mirrors the HIPAA Security Rule&rsquo;s
            Administrative, Physical, and Technical categories. The
            controls below describe the posture we operate under; the
            implementation specifics, written policies, device inventory,
            audit-log samples, workforce training records, are shared
            during BAA review on request.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <SafeguardCard
            label="Administrative"
            items={[
              "Workforce HIPAA training before any clinical access",
              "Written policies, procedures, and sanctions for violations",
              "Named privacy & security contact for every engagement",
              "Access reviews and the Minimum Necessary rule",
            ]}
          />
          <SafeguardCard
            label="Physical"
            items={[
              "Locked workspaces for personnel handling PHI",
              "Device inventory and controlled hardware disposal",
              "No printing or local storage of patient records",
            ]}
          />
          <SafeguardCard
            label="Technical"
            items={[
              "Access via client-controlled EHR / CCM platforms only",
              "Encrypted transmission of all PHI; MFA on every account",
              "Audit logging on access to patient information",
              "HIPAA-eligible email tooling (Google Workspace / Microsoft 365, each under a BAA)",
            ]}
          />
        </div>
      </section>

      {/* ─── Minimum Necessary + breach notification ─────────────────── */}
      <section className="border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                Minimum Necessary, enforced.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                Zenith accesses, uses, and discloses only the PHI needed to
                perform the clinical work in your Business Associate
                Agreement. No bulk exports, no &ldquo;just in case&rdquo;
                lookups, no analytics on patient records.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                Breach notification, within statute.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-ink">
                In the event of a breach of unsecured PHI, we notify your
                practice without unreasonable delay and within the timeframe
                required by HIPAA and the governing BAA. Your practice
                remains responsible for notifying patients and HHS under
                45&nbsp;CFR&nbsp;164.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA + link to formal statement ──────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-2xl border border-border/70 bg-card p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.4fr)_auto] md:items-center">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
                Need the audit-ready version?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink">
                Our formal <Link href="/hipaa-statement" className="text-brand-accent underline underline-offset-2 hover:text-brand-ink">HIPAA Statement</Link> covers role, safeguards, BAA
                scope, breach notification language, and contacts in the format
                your compliance officer expects. Request a sample BAA on the
                call and we&rsquo;ll send a redlineable version within two
                business days.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-body-ink">
                <BulletedListItem>Sample BAA based on HHS model provisions</BulletedListItem>
                <BulletedListItem>Named compliance contact for your account</BulletedListItem>
                <BulletedListItem>Monthly summary reports formatted for audit</BulletedListItem>
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button asChild size="lg">
                <Link href="/contact">
                  Book a 15-min call
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/hipaa-statement">Read the formal statement</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h3 className="font-serif text-xl font-semibold text-brand-ink">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-body-ink">
        {body}
      </p>
    </div>
  );
}

function SafeguardCard({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-body-ink">
        {items.map((it) => (
          <BulletedListItem key={it}>{it}</BulletedListItem>
        ))}
      </ul>
    </div>
  );
}
