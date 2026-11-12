import { fields, singleton } from "@keystatic/core";

/**
 * Search appearance fields, shared by the "Page titles and descriptions" singleton and
 * the service and specialty singleton below. Doc: WebSiteDoc/Project/16b-cms-search-appearance.md
 */

// Keystatic 0.6.9 has no live character counter. Over-length text shows a red error,
// so each description states the limit and the validation enforces it.
export const ogFields = {
  ogTitle: fields.text({
    label: "Share card headline (optional)",
    description:
      "Big text on the image shown when the page is shared on LinkedIn, Slack or X. Leave blank to keep the default. About 60 characters or fewer.",
    validation: { length: { max: 80 } },
  }),
  ogSubtitle: fields.text({
    label: "Share card subtext (optional)",
    description: "Smaller line under the headline. Leave blank to keep the default. About 120 characters or fewer.",
    multiline: true,
    validation: { length: { max: 160 } },
  }),
};

export const noindexField = fields.checkbox({
  label: "Hide from Google (noindex)",
  description: "Tick to ask Google not to list this page. It is also removed from the sitemap. Leave unticked for normal pages.",
  defaultValue: false,
});

const seoItem = fields.object({
  path: fields.text({
    label: "Page URL path",
    description: "Picks which page the text applies to. Do not change it.",
    validation: { isRequired: true, pattern: { regex: /^\/[a-z0-9/-]*$/, message: "Start with / and use lowercase letters, numbers, dashes and slashes" } },
  }),
  title: fields.text({
    label: "SEO title",
    description: "The site name is added after it (| Zenith Care Solutions). Keep it to 36 characters or fewer so the whole title stays under 60.",
    validation: { isRequired: true, length: { max: 36 } },
  }),
  description: fields.text({
    label: "Meta description",
    description: "Shown in Google results. 160 characters or fewer.",
    multiline: true,
    validation: { isRequired: true, length: { max: 160 } },
  }),
  ...ogFields,
  noindex: noindexField,
});

export const collections = {};

export const singletons = {
  // content/page-seo-services.json: same editing as page-seo.json for /services/<slug>
  // and /who-we-serve/<specialty>, whose default text lives in code.
  serviceSeo: singleton({
    label: "Service and specialty page titles",
    path: "content/page-seo-services",
    format: "json",
    schema: {
      pages: fields.array(seoItem, {
        label: "Pages",
        itemLabel: (props) => props.fields.path.value,
      }),
    },
  }),
};
