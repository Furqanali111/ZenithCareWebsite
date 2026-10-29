"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { estimateRoi, formatRange } from "@/lib/roi";

const DEFAULT_PATIENTS = 200;
const DEFAULT_ENROLLMENT_PCT = 50;

export function RoiCalculator() {
  const [patients, setPatients] = useState<number>(DEFAULT_PATIENTS);
  const [enrollmentPct, setEnrollmentPct] = useState<number>(
    DEFAULT_ENROLLMENT_PCT,
  );

  // estimateRoi() already clamps patients to >= 0 and Math.floors the input,
  // so negatives, decimals, and NaN are safe without a UI-side clamp.
  const result = estimateRoi(patients, enrollmentPct / 100);

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
        <div className="space-y-6">
          <Field label="Eligible Medicare patients" htmlFor="roi-patients">
            <Input
              id="roi-patients"
              type="number"
              inputMode="numeric"
              min={0}
              step={10}
              value={patients}
              onChange={(e) => setPatients(Number(e.target.value) || 0)}
              aria-describedby="roi-patients-help"
            />
            <p
              id="roi-patients-help"
              className="mt-2 text-sm text-muted-foreground"
            >
              Patients in the panel with 2+ chronic conditions on Medicare
              Part B.
            </p>
          </Field>

          <Field
            label={`Expected enrollment rate, ${enrollmentPct}%`}
            htmlFor="roi-enrollment"
          >
            <Slider
              id="roi-enrollment"
              min={20}
              max={80}
              step={5}
              value={[enrollmentPct]}
              onValueChange={(v) => setEnrollmentPct(v[0])}
              aria-label={`Expected enrollment rate, ${enrollmentPct} percent`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Realistic range for a cold-start CCM program is 40-60%.
            </p>
          </Field>
        </div>

        <div
          className="rounded-lg bg-surface-tint p-6 md:p-8"
          role="status"
          aria-live="polite"
        >
          <StatTile
            caption="Typical monthly reimbursement (±10% band)"
            value={formatRange(result.monthlyLow, result.monthlyHigh)}
            suffix="/ month"
            emphasis="primary"
          />
          <div className="my-6 border-t border-border/70" />
          <StatTile
            caption="Typical annual reimbursement (±10% band)"
            value={formatRange(result.annualLow, result.annualHigh)}
            suffix="/ year"
            emphasis="secondary"
          />
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Representative figures only. Assumes CPT 99490 base-code billing
            at the 2026 Medicare rate. Actual reimbursement varies with
            complex-CCM add-ons (99439 / 99487 / 99489), payer mix, and
            enrollment conversion. Zenith does not bill Medicare directly;
            the billing practitioner remains the practice.
          </p>
          <Button asChild size="lg" className="mt-6 w-full md:w-auto">
            <Link href="/contact">Book a call to discuss your panel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function StatTile({
  caption,
  value,
  suffix,
  emphasis,
}: {
  caption: string;
  value: string;
  suffix: string;
  emphasis: "primary" | "secondary";
}) {
  const valueSize =
    emphasis === "primary"
      ? "text-4xl md:text-5xl"
      : "text-2xl md:text-3xl";
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {caption}
      </p>
      <p className="mt-2 flex items-baseline gap-2">
        <span
          className={`font-serif font-semibold tracking-tight text-brand-ink ${valueSize}`}
        >
          {value}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {suffix}
        </span>
      </p>
    </div>
  );
}

