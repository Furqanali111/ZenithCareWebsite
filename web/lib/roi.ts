/**
 * CCM revenue math — representative, not a guarantee.
 *
 * Base assumption: CPT 99490 reimburses ~ $66 per enrolled patient per month
 * at the 2026 Medicare rate (base code only, no complex-CCM add-ons). Source:
 * Doc/Zenith_CCM_Launch_Roadmap (1).pdf §Core CCM Billing Facts. A 200-patient
 * fully-enrolled panel therefore nets ~ $13,200/month, which matches the
 * roadmap's revenue framing.
 *
 * We render the result as a ±10% range so the UI never pretends to be exact —
 * actual mix of CPT 99439 / 99487 / 99489 add-ons swings the number both ways.
 */
export const CCM_BASE_RATE_PER_PATIENT_MONTHLY = 66;

/** Window used to render the ± range (0.10 = ±10%). */
export const ROI_RANGE_SPREAD = 0.1;

export type RoiEstimate = {
  monthlyLow: number;
  monthlyMid: number;
  monthlyHigh: number;
  annualLow: number;
  annualMid: number;
  annualHigh: number;
};

/** Core calculation. Pure. */
export function estimateRoi(
  eligiblePatients: number,
  enrollmentFraction: number,
): RoiEstimate {
  const patients = Math.max(0, Math.floor(eligiblePatients));
  const rate = Math.min(1, Math.max(0, enrollmentFraction));
  const monthlyMid = patients * rate * CCM_BASE_RATE_PER_PATIENT_MONTHLY;
  const monthlyLow = monthlyMid * (1 - ROI_RANGE_SPREAD);
  const monthlyHigh = monthlyMid * (1 + ROI_RANGE_SPREAD);
  return {
    monthlyLow,
    monthlyMid,
    monthlyHigh,
    annualLow: monthlyLow * 12,
    annualMid: monthlyMid * 12,
    annualHigh: monthlyHigh * 12,
  };
}

/** Round dollars to the nearest $100 for display cleanliness. */
export function roundToHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

/** Human-friendly USD string with no cents. */
const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export function formatUsd(n: number): string {
  return USD.format(roundToHundred(n));
}

/**
 * Display helper: "$X,XXX – $Y,YYY" with an en-dash.
 * Collapses to a single value when the two bounds round to the same hundred,
 * so a zero-input doesn't render as "$0 – $0".
 */
export function formatRange(low: number, high: number): string {
  const lo = formatUsd(low);
  const hi = formatUsd(high);
  return lo === hi ? lo : `${lo} – ${hi}`;
}

/* -------------------------------------------------------------------------- */
/* Dev-only self-check. Server-only so HMR doesn't duplicate the log noise.   */
/* Fails loud in dev — console.assert is intentionally not enough.            */
/* -------------------------------------------------------------------------- */
if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
  const full = estimateRoi(200, 1);
  if (full.monthlyMid !== 13200) {
    throw new Error(
      `roi: 200 × 100% should produce $13,200/mo, got $${full.monthlyMid}`,
    );
  }
  const zero = estimateRoi(0, 0.5);
  if (zero.monthlyMid !== 0) {
    throw new Error(`roi: 0 patients should produce $0/mo`);
  }
  const half = estimateRoi(100, 0.5);
  if (half.monthlyMid !== 100 * 0.5 * CCM_BASE_RATE_PER_PATIENT_MONTHLY) {
    throw new Error(`roi: 100 × 50% math drifted`);
  }
  const clamped = estimateRoi(-50, 2);
  if (clamped.monthlyMid < 0) {
    throw new Error(`roi: negative inputs should clamp to >= 0`);
  }
}
