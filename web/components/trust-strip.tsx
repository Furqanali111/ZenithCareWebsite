import { ShieldCheck, Stethoscope, Database, FileCheck } from "lucide-react";

/**
 * Four-column trust strip surfaced under hero sections. Keeps the credibility
 * frame consistent across home, service, and specialty pages. Icons are
 * illustrative, not decorative dots (every icon pairs with a specific claim).
 *
 * No "quietly trusted by" / logo-wall framing, Zenith is pre-launch, so the
 * trust marks are credentials and compliance posture, not customer logos.
 */
const DEFAULT_ITEMS: { label: string; detail: string }[] = [
  { label: "HIPAA Business Associate", detail: "BAA signed before any PHI changes hands." },
  { label: "Trained clinical staff", detail: "Not a call-centre. Real clinical coordination." },
  { label: "Inside your EHR", detail: "No PHI exported. Documentation lives where you work." },
  { label: "CMS-aligned billing", detail: "CPT 99490 / 99439 / 99487 / 99489 / 99491 / 99437." },
];

const ICONS = [ShieldCheck, Stethoscope, Database, FileCheck];

export function TrustStrip({
  className = "",
  tone = "light",
  items,
}: {
  className?: string;
  tone?: "light" | "surface";
  /** Per-page trust marks (label-only). Falls back to the default four. */
  items?: readonly string[];
}) {
  const base = tone === "surface" ? "bg-surface-tint" : "bg-background";
  // Per-service labels render without a detail line; the default set keeps its
  // explanatory sub-lines.
  const entries = items?.length
    ? items.map((label) => ({ label, detail: undefined }))
    : DEFAULT_ITEMS;
  return (
    <section
      aria-label="Why practices trust Zenith"
      className={`border-y border-border/60 ${base} ${className}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 md:py-12 lg:grid-cols-4 lg:gap-10">
        {entries.map((entry, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <TrustItem
              key={entry.label}
              icon={<Icon className="size-5" aria-hidden="true" />}
              label={entry.label}
              detail={entry.detail}
            />
          );
        })}
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
  detail?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex size-9 flex-none items-center justify-center rounded-lg bg-[color:var(--color-brand-50)] text-brand-accent dark:bg-white/10 dark:text-[color:var(--color-accent-600)]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-serif text-sm font-semibold text-brand-ink">
          {label}
        </p>
        {detail ? (
          <p className="mt-1 text-sm leading-relaxed text-body-ink">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}
