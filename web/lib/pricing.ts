/**
 * Pricing registry for /pricing. One entry per service category in
 * lib/services.ts. `amount` stays null until real USD figures exist; the page
 * then says the price is fixed in the written proposal. Never invent a number.
 * Fill in `amount` (e.g. "$1,500") and `unit` here and /pricing updates.
 */
import { categoryMeta, type ServiceCategory } from "./services";

export type PricingPlan = {
  category: ServiceCategory;
  summary: string;
  included: string[];
  billing: "monthly" | "one-time";
  /** USD display string, or null until confirmed. */
  amount: string | null;
  /** e.g. "per month", "per staff member per month". */
  unit: string;
  /** Time from signed agreement to work starting. Placeholder until confirmed. */
  startTime: string;
  extras: string;
};

export const pricing: readonly PricingPlan[] = [
  {
    category: "rpm",
    summary:
      "Monthly care management for your eligible Medicare patients, done inside your EHR under your supervision.",
    included: [
      "Dedicated care coordinators working inside your EHR",
      "Monthly patient outreach and care plan upkeep",
      "Time tracking records to support your billing",
      "Monthly activity reporting",
    ],
    billing: "monthly",
    amount: null,
    unit: "per month",
    startTime: "Within 10 business days of the signed agreement",
    extras: "None. Any additional work is agreed in writing before it starts.",
  },
  {
    category: "rcm",
    summary:
      "Billing, coding, credentialing and AR follow-up for your practice.",
    included: [
      "Named billing and coding specialists",
      "Claim follow-up and denial work",
      "Credentialing and payer enrollment support",
      "Monthly performance reporting",
    ],
    billing: "monthly",
    amount: null,
    unit: "per month",
    startTime: "Within 10 business days of the signed agreement",
    extras: "None. Any additional work is agreed in writing before it starts.",
  },
  {
    category: "staffing",
    summary:
      "Remote scribes, schedulers, receptionists and coordinators who work your hours inside your systems.",
    included: [
      "Trained remote staff matched to your roles",
      "Work done inside your systems and workflows",
      "A named point of contact at Zenith",
      "Replacement cover if a team member is unavailable",
    ],
    billing: "monthly",
    amount: null,
    unit: "per staff member per month",
    startTime: "Within 10 business days of the signed agreement",
    extras: "None. Any additional work is agreed in writing before it starts.",
  },
];

export const pricingLabel = (p: PricingPlan) => categoryMeta[p.category].label;
