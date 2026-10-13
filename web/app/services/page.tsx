import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowRight, Receipt, Users } from "lucide-react";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { servicesByCategory, categoryMeta, type Service } from "@/lib/services";

const PATH = "/services";

export const metadata: Metadata = pageMetadata({
  title: "Services, Care Management & Virtual Staffing",
  description:
    "Remote Medicare care management (CCM, PCM, RPM, RTM, TCM) and virtual medical staffing (scribes, schedulers, receptionists, coordinators, assistants) for U.S. practices. PharmD-led, HIPAA.",
  path: PATH,
});

const rpm = servicesByCategory("rpm");
const rcm = servicesByCategory("rcm");
const staffing = servicesByCategory("staffing");

export default function ServicesOverviewPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: PATH },
        ])}
      />

      <PageHero
        eyebrow="Services"
        title="Capture unbilled Medicare revenue, and the admin hours you can't hire for."
        primaryCta={{ label: "Book a 15-minute call", href: "/contact" }}
        secondaryCta={{ label: "Estimate your ROI", href: "/roi-calculator" }}
      >
        Zenith runs the care coordination, monitoring, revenue-cycle, and
        administrative work behind Medicare care-management programs, billing
        operations, and remote medical roles, so your practice earns recurring
        revenue and recovers staff time, without adding headcount.
      </PageHero>

      {/* ─── Remote Patient Monitoring ───────────────────────────────── */}
      <ServiceCategorySection
        id="remote-patient-monitoring"
        icon={<Activity className="size-5" aria-hidden="true" />}
        label={categoryMeta.rpm.label}
        blurb="Five Medicare programs that reimburse your practice for coordinating, monitoring, and transitioning care. Your practice bills; Zenith delivers the labor."
        services={rpm}
        tone="background"
      />

      {/* ─── RPM comparison table ────────────────────────────────────── */}
      <section className="section-rhythm border-t border-border/60 bg-surface-tint">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Which program fits which patient?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-ink">
              A quick side-by-side of the five care-management programs.
              Reimbursement figures are 2026 Medicare national averages and vary
              by locality and payer.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-card text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Program</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Eligibility</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Primary CPT</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Base reimbursement</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Who can bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-card text-ink-strong">
                {COMPARISON.map((row) => (
                  <tr key={row.program}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-brand-accent">
                      {row.program}
                    </td>
                    <td className="px-4 py-3 leading-snug">{row.eligibility}</td>
                    <td className="px-4 py-3 font-mono text-xs leading-snug">{row.codes}</td>
                    <td className="whitespace-nowrap px-4 py-3">{row.rate}</td>
                    <td className="px-4 py-3 leading-snug">{row.whoCanBill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ─── Revenue Cycle Management ────────────────────────────────── */}
      <ServiceCategorySection
        id="revenue-cycle-management"
        icon={<Receipt className="size-5" aria-hidden="true" />}
        label={categoryMeta.rcm.label}
        blurb="Billing, coding, credentialing, and A/R follow-up handled inside your practice-management system, so more of what you earn is coded right, billed clean, and collected."
        services={rcm}
        tone="background"
      />

      {/* ─── Virtual Staffing & Admin Support ────────────────────────── */}
      <ServiceCategorySection
        id="virtual-staffing"
        icon={<Users className="size-5" aria-hidden="true" />}
        label={categoryMeta.staffing.label}
        blurb="Trained remote medical professionals who absorb the clinical admin that slows your team down, inside your systems, under a signed BAA, at a flat monthly rate."
        services={staffing}
        tone="surface"
      />

      {/* ─── Who we serve: eligibility at a glance ───────────────────── */}
      <section className="section-rhythm border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              Who we serve, at a glance
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-ink">
              Which practices can offer each service, and which patients can be
              billed. Eligibility is confirmed per patient and per payer at the
              time of service.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-card text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Eligible practices</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Patients who can be billed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-card text-ink-strong">
                {ELIGIBILITY.map((row) => (
                  <tr key={row.service}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-brand-accent">
                      {row.service}
                    </td>
                    <td className="px-4 py-3 leading-snug">{row.practices}</td>
                    <td className="px-4 py-3 leading-snug">{row.billing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-background">
        <div className="section-rhythm">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              Not sure which services fit your practice?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body-ink">
              Book a 15-minute call and we&rsquo;ll map out which programs your
              patients qualify for and which roles would take the most off your
              team, and what it could mean for your monthly revenue.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-6 text-sm">
                <Link href="/contact">Book a 15-minute call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-sm">
                <Link href="/roi-calculator">Estimate your ROI first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function ServiceCategorySection({
  id,
  icon,
  label,
  blurb,
  services,
  tone,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  blurb: string;
  services: Service[];
  tone: "background" | "surface";
}) {
  return (
    <section
      id={id}
      className={`section-rhythm scroll-mt-24 ${
        tone === "surface" ? "border-t border-border/60 bg-surface-tint" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              {icon}
            </span>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink md:text-3xl">
              {label}
            </h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-body-ink">{blurb}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.08} className="h-full">
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-teal-500)]/40 hover:shadow-[0_18px_40px_-24px_rgba(11,32,38,0.4)]"
              >
                <h3 className="font-serif text-lg font-semibold text-brand-ink group-hover:text-brand-accent">
                  {s.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-body-ink">
                  {s.shortDesc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent">
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
    </section>
  );
}

// shortcut: quick-reference eligibility rows from the Who-We-Serve doc, grouped
// by service bar (RCM + Virtual Staffing collapse to one row each). The full,
// per-service detail lives on each /services/<slug> page. Keep in sync if the
// eligibility copy there changes.
const ELIGIBILITY = [
  {
    service: "CCM",
    practices: "Family Medicine, Internal Medicine, Geriatrics, General Practice",
    billing: "Medicare Part B, 2+ chronic conditions, 12+ months, documented consent",
  },
  {
    service: "PCM",
    practices: "Cardiology, Endocrinology, Pulmonology, Nephrology, Neurology, Primary Care",
    billing: "Medicare Part B, 1 high-risk condition, 3+ months",
  },
  {
    service: "RPM",
    practices: "Cardiology, Endocrinology, Pulmonology, Nephrology, Primary Care",
    billing: "Medicare Part B, acute/chronic condition, device data, consent",
  },
  {
    service: "RTM",
    practices: "Orthopedics, PT/PM&R, Pain Management, Pulmonology",
    billing: "Respiratory/MSK monitoring, FDA-defined device or app, consent",
  },
  {
    service: "TCM",
    practices: "Hospitalist, Cardiology, Primary Care, Internal Medicine",
    billing: "Recently discharged patients, contact within 2 business days, visit within 7 to 14 days",
  },
  {
    service: "Revenue Cycle Management",
    practices: "Any practice, any specialty",
    billing: "Works on existing claims across all payers, not patient-enrolled",
  },
  {
    service: "Virtual Staffing",
    practices: "Any practice, any specialty",
    billing: "Administrative and operational support, not a billable program",
  },
];

// shortcut: a curated summary of the RPM services' eligibility/codes/rates,
// hand-kept in sync with lib/services.ts. Upgrade to derive from the registry
// (add whoCanBill + short eligibility/codes fields per service) if the figures
// start drifting from the service pages.
const COMPARISON = [
  {
    program: "CCM",
    eligibility: "2+ chronic conditions, 12+ months",
    codes: "99490, 99439, 99487/99489, 99491",
    rate: "~$62/mo",
    whoCanBill: "Physician, NP, PA, clinical staff",
  },
  {
    program: "PCM",
    eligibility: "1 high-risk condition, 3+ months",
    codes: "99424, 99425, 99426, 99427",
    rate: "~$68-$88/mo",
    whoCanBill: "Physician, NP, PA, clinical staff",
  },
  {
    program: "RPM",
    eligibility: "Acute/chronic condition + connected device",
    codes: "99453, 99454, 99445, 99457, 99458, 99470",
    rate: "~$150-$200+/mo",
    whoCanBill: "Physician, NP, PA",
  },
  {
    program: "RTM",
    eligibility: "Respiratory/MSK condition, app or device",
    codes: "98975, 98976/98977, 98980, 98981",
    rate: "~$90-$150/mo",
    whoCanBill: "Physician, NP, PA, PT, OT, SLP",
  },
  {
    program: "TCM",
    eligibility: "Post-discharge, 30-day window",
    codes: "99495, 99496",
    rate: "$220-$299/episode",
    whoCanBill: "Physician, NP, PA",
  },
];
