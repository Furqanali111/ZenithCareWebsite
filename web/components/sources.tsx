// Primary-source links for claims about Medicare codes, fees and denials.
// Landing pages only (stable); deep links to CMS PDFs move often.
const CMS_PFS = {
  label: "CMS Physician Fee Schedule",
  href: "https://www.cms.gov/medicare/payment/fee-schedules/physician",
};
const CMS_MLN = {
  label: "CMS Medicare Learning Network publications",
  href: "https://www.cms.gov/outreach-and-education/medicare-learning-network-mln/mlnproducts",
};
const X12_CARC = {
  label: "X12 Claim Adjustment Reason Codes",
  href: "https://x12.org/codes/claim-adjustment-reason-codes",
};

export const SOURCES = {
  care: [CMS_PFS, CMS_MLN],
  denial: [X12_CARC, CMS_MLN],
} as const;

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export function SourcedFacts({
  heading,
  items,
}: {
  heading: string;
  items: readonly string[];
}) {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-serif text-xl font-semibold text-brand-ink">
          {heading}
        </h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-body-ink">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Sources({
  links,
  updated,
}: {
  links: readonly { label: string; href: string }[];
  /** ISO date (YYYY-MM-DD) the page content was last updated. */
  updated?: string;
}) {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-serif text-lg font-semibold text-brand-ink">
          Sources
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Rates, code descriptions and rules change. Confirm against the
          official publication before you bill.
          {updated ? (
            <>
              {" "}Last updated{" "}
              <time dateTime={updated}>{longDate(updated)}</time>.
            </>
          ) : null}
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-accent hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
