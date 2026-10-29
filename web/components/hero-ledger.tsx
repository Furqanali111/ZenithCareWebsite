"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { ANCHOR_PATIENTS, CPT_RATES } from "@/lib/roi";

const CODES = [
  { code: "99490", label: "Base" },
  { code: "99439", label: "Add-on" },
  { code: "99487", label: "Complex" },
] as const;
type Code = (typeof CODES)[number]["code"];

/**
 * Home hero reimbursement card. The visitor drags a panel size and the monthly
 * figure eases to match. Same math as /roi-calculator at full enrollment:
 * enrolled patients x the selected code's rate (the visitor picks Base, Add-on
 * or Complex). Representative, never a guarantee
 * (the caption below the card says so). Dark in dark mode, white in light.
 */
export function HeroLedger() {
  const [patients, setPatients] = useState<number>(ANCHOR_PATIENTS);
  const [code, setCode] = useState<Code>("99490");
  const rate = CPT_RATES[code];
  const picked = CODES.find((c) => c.code === code)!;

  return (
    <aside aria-label="Representative CCM reimbursement" className="reveal-up reveal-up-3 relative">
      <div className="float-y rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-surface-0)] p-7 text-[color:var(--color-brand-900)] shadow-[var(--shadow-float)] dark:border-white/10 dark:bg-[color:var(--dk-surface)] dark:text-[color:var(--dk-ink)] dark:shadow-2xl dark:shadow-black/40 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-brand-700)] dark:text-[color:var(--dk-ring)]">
            Monthly reimbursement, typical panel
          </span>
          <span className="shrink-0 rounded-full bg-[color:var(--color-brand-50)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-brand-700)] dark:bg-white/10 dark:text-[color:var(--dk-ring)]">
            CPT <span className="font-mono">{code}</span>
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-3 font-serif font-semibold tracking-tight">
          <span className="text-5xl tabular-nums md:text-6xl">
            <CountUp value={patients * rate} prefix="$" />
          </span>
          <span className="text-base font-medium text-[color:var(--color-ink-700)] dark:text-[color:var(--dk-body-ink)]">
            / month
          </span>
        </div>
        <p className="mt-2 text-sm text-[color:var(--color-ink-700)] dark:text-[color:var(--dk-body-ink)]">
          {patients} enrolled patients × ${rate} {picked.label.toLowerCase()}-code reimbursement
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-medium text-[color:var(--color-ink-700)] dark:text-[color:var(--dk-body-ink)]">
            <label htmlFor="hero-panel-size">Try your own panel size</label>
            <span className="tabular-nums">{patients} patients</span>
          </div>
          <input
            id="hero-panel-size"
            type="range"
            min={20}
            max={500}
            step={10}
            value={patients}
            onChange={(e) => setPatients(Number(e.target.value))}
            aria-valuetext={`${patients} enrolled patients`}
            className="mt-3 h-6 w-full cursor-pointer accent-[color:var(--step-accent)]"
          />
        </div>

        <fieldset className="mt-5">
          <legend className="sr-only">Billing code to apply</legend>
          <div className="grid grid-cols-3 gap-3">
            {CODES.map((c) => (
              <RatePill
                key={c.code}
                label={c.label}
                value={`$${CPT_RATES[c.code]}`}
                note={c.code}
                checked={c.code === code}
                onSelect={() => setCode(c.code)}
              />
            ))}
          </div>
        </fieldset>

        <Link
          href="/roi-calculator"
          className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[color:var(--color-brand-700)] hover:text-[color:var(--color-brand-900)] dark:text-[color:var(--dk-ring)] dark:hover:text-[color:var(--dk-ink)]"
        >
          See the full breakdown
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground dark:text-white/75">
        Representative example, one {picked.label.toLowerCase()} code per patient per month. Actual results vary.
      </p>
    </aside>
  );
}

function RatePill({
  label,
  value,
  note,
  checked,
  onSelect,
}: {
  label: string;
  value: string;
  note: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name="hero-code"
        value={note}
        checked={checked}
        onChange={onSelect}
        aria-label={`${label}, CPT ${note}, ${value} per patient`}
        className="peer sr-only"
      />
      <span className="block rounded-xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-surface-50)] p-3 text-center transition-[border-color,background-color,box-shadow] duration-200 hover:border-[color:var(--step-line)] peer-checked:border-[color:var(--step-accent)] peer-checked:bg-[color:var(--color-brand-50)] peer-checked:shadow-[inset_0_0_0_1px_var(--step-accent)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[color:var(--step-accent)] dark:border-white/10 dark:bg-white/5 dark:peer-checked:bg-white/10">
        <span className="block text-xs font-semibold text-[color:var(--color-brand-700)] dark:text-[color:var(--dk-ring)]">{label}</span>
        <span className="mt-1 block font-serif text-lg font-semibold text-[color:var(--color-brand-900)] dark:text-[color:var(--dk-ink)]">{value}</span>
        <span className="mt-0.5 block font-mono text-xs text-[color:var(--color-ink-700)] dark:text-[color:var(--dk-body-ink)]">{note}</span>
      </span>
    </label>
  );
}
