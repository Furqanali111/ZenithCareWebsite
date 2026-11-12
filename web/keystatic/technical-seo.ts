import { fields, singleton } from "@keystatic/core";

// Technical SEO settings for the SEO manager. Each singleton is one JSON file in content/.
// Every value is checked again when the site builds (next.config.ts, app/sitemap.ts,
// app/llms.txt/route.ts), so a bad entry fails the build instead of shipping.

const pathPattern = {
  regex: /^\/[a-z0-9/-]*$/,
  message: "Start with / and use lowercase letters, numbers, dashes and slashes",
};
const pathField = (description: string) =>
  fields.text({ label: "Page URL path", description, validation: { isRequired: true, pattern: pathPattern } });
const pathList = (label: string, description: string) =>
  fields.array(
    fields.text({ label: "Page URL path", validation: { isRequired: true, pattern: pathPattern } }),
    { label, description, itemLabel: (props) => props.value },
  );
// Redirect sources may use upper case, dots and underscores, but never : * ( ) ?
const redirectFrom = {
  regex: /^\/[A-Za-z0-9._~/-]*$/,
  message: "Start with / and use only letters, numbers, dots, dashes, underscores and slashes",
};

export const collections = {};

export const singletons = {
  // content/redirects.json: read by next.config.ts
  redirects: singleton({
    label: "Redirects",
    path: "content/redirects",
    format: "json",
    schema: {
      exact: fields.array(
        fields.object({
          from: fields.text({
            label: "Old URL path",
            description: "For example /old-page. Exactly this page only.",
            validation: { isRequired: true, pattern: redirectFrom },
          }),
          to: fields.text({
            label: "New URL",
            description: "A path like /new-page or a full https:// address.",
            validation: { isRequired: true },
          }),
          permanent: fields.checkbox({ label: "Permanent (301/308)", description: "Leave on unless the move is temporary.", defaultValue: true }),
        }),
        { label: "Single page redirects", itemLabel: (props) => `${props.fields.from.value} to ${props.fields.to.value}` },
      ),
      prefix: fields.array(
        fields.object({
          from: fields.text({
            label: "Old section path",
            description: "For example /old-section. Every page under it moves, so /old-section/a goes to /new-section/a.",
            validation: { isRequired: true, pattern: redirectFrom },
          }),
          to: fields.text({
            label: "New section path",
            description: "A path like /new-section, or a full https:// address.",
            validation: { isRequired: true },
          }),
          permanent: fields.checkbox({ label: "Permanent (301/308)", defaultValue: true }),
        }),
        { label: "Whole section redirects", itemLabel: (props) => `${props.fields.from.value}/* to ${props.fields.to.value}/*` },
      ),
    },
  }),
  // content/sitemap-controls.json: read by app/sitemap.ts
  sitemapControls: singleton({
    label: "Sitemap controls",
    path: "content/sitemap-controls",
    format: "json",
    schema: {
      exclude: pathList("Pages to leave out of the sitemap", "The page must exist, otherwise the build fails."),
      overrides: fields.array(
        fields.object({
          path: pathField("Must be a page that is in the sitemap."),
          priority: fields.number({ label: "Priority (0 to 1)", description: "Optional. Google ignores it, other crawlers may use it.", validation: { min: 0, max: 1 } }),
          changeFrequency: fields.select({
            label: "Change frequency",
            options: [
              { label: "Not set", value: "none" },
              { label: "Always", value: "always" },
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Yearly", value: "yearly" },
              { label: "Never", value: "never" },
            ],
            defaultValue: "none",
          }),
        }),
        { label: "Priority and change frequency by page", itemLabel: (props) => props.fields.path.value },
      ),
    },
  }),
  // content/llms-txt.json: read by app/llms.txt/route.ts
  llmsTxt: singleton({
    label: "llms.txt (AI summary)",
    path: "content/llms-txt",
    format: "json",
    schema: {
      summary: fields.text({
        label: "Summary",
        description: "One short paragraph shown under the site name. Leave blank to keep the built-in text.",
        multiline: true,
        validation: { length: { max: 500 } },
      }),
      extraLinks: fields.array(
        fields.object({
          title: fields.text({ label: "Title", validation: { isRequired: true } }),
          url: fields.text({
            label: "URL",
            description: "A path like /pricing or a full https:// address.",
            validation: { isRequired: true, pattern: { regex: /^(\/|https:\/\/)\S*$/, message: "Start with / or https://" } },
          }),
          description: fields.text({ label: "Short description" }),
        }),
        { label: "Extra links", description: "Listed under Additional pages.", itemLabel: (props) => props.fields.title.value },
      ),
    },
  }),
  // content/structured-data.json: read by lib/seo.tsx
  structuredData: singleton({
    label: "Structured data",
    path: "content/structured-data",
    format: "json",
    schema: {
      faqSchemaOff: pathList("Pages with FAQPage schema turned off", "The FAQ stays visible on the page. Only the schema markup is removed. Works for home, /faq and blog posts."),
      organizationPhone: fields.text({
        label: "Organization phone",
        description: "Optional, added to the Organization schema as a sales contact. Use international format, for example +1 555 123 4567. Leave blank to omit.",
        validation: { pattern: { regex: /^(\+?[0-9 ()-]{7,20})?$/, message: "Digits, spaces, dashes, brackets and an optional leading +" } },
      }),
      organizationSameAs: fields.array(
        fields.text({ label: "Profile URL", validation: { isRequired: true, pattern: { regex: /^https:\/\/\S+$/, message: "Start with https://" } } }),
        { label: "Extra profile URLs (sameAs)", description: "Real profiles of the company, such as Google Business Profile or Crunchbase. Added to LinkedIn, Facebook and Instagram.", itemLabel: (props) => props.value },
      ),
    },
  }),
  // content/breadcrumb-labels.json: read by components/breadcrumbs.tsx and breadcrumbLd
  breadcrumbLabels: singleton({
    label: "Breadcrumb labels",
    path: "content/breadcrumb-labels",
    format: "json",
    schema: {
      labels: fields.array(
        fields.object({
          path: pathField("The page the label is for."),
          label: fields.text({ label: "Shorter label", validation: { isRequired: true, length: { max: 40 } } }),
        }),
        { label: "Labels", itemLabel: (props) => `${props.fields.path.value}: ${props.fields.label.value}` },
      ),
    },
  }),
};
