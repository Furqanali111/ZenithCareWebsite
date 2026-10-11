import { ShieldCheck, Stethoscope, Database, FileCheck } from "lucide-react";

/**
 * Four-column trust strip surfaced under hero sections. Keeps the credibility
 * frame consistent across home, service, and specialty pages. Icons are
 * illustrative, not decorative dots (every icon pairs with a specific claim).
 *
 * No "quietly trusted by" / logo-wall framing — Zenith is pre-launch, so the
 * trust marks are credentials and compliance posture, not customer logos.
 */
export function TrustStrip({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "surface";
}) {
  const base =
    tone === "surface"
      ? "bg-[color:var(--color-surface-50)]"
      : "bg-background";
  return (
    <section
      aria-label="Why practices trust Zenith"
      className={`border-y border-border/60 ${base} ${className}`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 md:py-12 lg:grid-cols-4 lg:gap-10">
        <TrustItem
          icon={<ShieldCheck className="size-5" aria-hidden="true" />}
          label="HIPAA Business Associate"
          detail="BAA signed before any PHI changes hands."
        />
        <TrustItem
          icon={<Stethoscope className="size-5" aria-hidden="true" />}
          label="Clinically PharmD-led"
          detail="Not a call-centre. Trained clinical staff."
        />
        <TrustItem
          icon={<Database className="size-5" aria-hidden="true" />}
          label="Inside your EHR"
          detail="No PHI exported. Documentation lives where you work."
        />
        <TrustItem
          icon={<FileCheck className="size-5" aria-hidden="true" />}
          label="CMS-aligned billing"
          detail="CPT 99490 / 99439 / 99487 / 99489 / 99491 / 99437."
        />
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  label,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex size-9 flex-none items-center justify-center rounded-lg bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)] dark:bg-white/10 dark:text-[color:var(--color-accent-600)]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-serif text-sm font-semibold text-[color:var(--color-brand-900)]">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-ink-600)]">
          {detail}
        </p>
      </div>
    </div>
  );
}
