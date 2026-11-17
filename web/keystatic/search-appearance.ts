import { fields, singleton } from "@keystatic/core";
import { googlePreview } from "./google-preview";
import { lockedPath } from "./locked-path";

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

// Focus keyword, nofollow and the social-card text and image override. Shared by posts and pages.
// The keyword feeds the SEO dashboard score only; it is never printed on the page.
export const seoExtraFields = {
  focusKeyword: fields.text({
    label: "Focus keyword",
    description: "The main phrase this page should rank for, for example chronic care management billing. Used by the SEO dashboard (/seo-dashboard) to score the page.",
  }),
  keywordSynonyms: fields.array(fields.text({ label: "Synonym or variation", validation: { isRequired: true } }), {
    label: "Keyword synonyms and variations (optional)",
    description: "Other ways to say the focus keyword, for example CCM billing or chronic care management billing. The dashboard checks accept any of them. Plurals and endings such as -ing and -ed are matched already.",
    itemLabel: (props) => props.value,
  }),
  nofollow: fields.checkbox({
    label: "Do not follow links (nofollow)",
    description: "Tick to ask Google not to follow the links on this page. Leave unticked for normal pages.",
    defaultValue: false,
  }),
  socialTitle: fields.text({
    label: "Social title (optional)",
    description: "Title in LinkedIn, Facebook and X link cards. Leave blank to reuse the SEO title.",
    validation: { length: { max: 90 } },
  }),
  socialDescription: fields.text({
    label: "Social description (optional)",
    description: "Text in link cards. Leave blank to reuse the meta description. 200 characters or fewer.",
    multiline: true,
    validation: { length: { max: 200 } },
  }),
  socialImage: fields.image({
    label: "Social sharing image (optional)",
    description: "A 1200 x 630 px .jpg or .webp under 300 KB. Leave empty to keep the generated share card.",
    directory: "public/social",
    publicPath: "/social/",
  }),
};

// Any schema.org type the page types below do not cover. Checked again when the site builds
// (lib/custom-jsonld.ts), so invalid JSON fails the build instead of shipping.
export const customJsonLdField = fields.text({
  label: "Custom structured data (advanced)",
  description:
    'Paste JSON-LD for any other schema.org type (Event, HowTo, VideoObject, Product...). One object like {"@type": "Event", ...} or a list of them. "@context" is added for you. Leave empty for none.',
  multiline: true,
  validation: { pattern: { regex: /^\s*([[{][\s\S]*[\]}])?\s*$/, message: "Must be JSON that starts with { or [" } },
});

const pageSchemaType = fields.select({
  label: "Page type (schema)",
  description: "The main schema.org type of this page. Automatic keeps what the site already uses. FAQPage needs a visible FAQ on the page.",
  options: [
    { label: "Automatic (recommended)", value: "default" },
    { label: "WebPage", value: "WebPage" },
    { label: "AboutPage", value: "AboutPage" },
    { label: "ContactPage", value: "ContactPage" },
    { label: "CollectionPage", value: "CollectionPage" },
    { label: "ItemPage", value: "ItemPage" },
    { label: "ProfilePage", value: "ProfilePage" },
    { label: "FAQPage", value: "FAQPage" },
  ],
  defaultValue: "default",
});

export const seoItem = fields.object({
  // Read only on an existing entry: changing it would point the entry at another page.
  path: lockedPath("Page URL path"),
  title: fields.text({
    label: "SEO title",
    description: "The site name is added after it (| Zenith Care Solutions). Keep it to 36 characters or fewer so the whole title stays under 60.",
    validation: { isRequired: true, length: { max: 36 } },
  }),
  description: fields.text({
    label: "Meta description",
    description: "Shown in Google results. Aim for 140 to 160 characters (the dashboard checks this). Longer than 160 is refused.",
    multiline: true,
    validation: { isRequired: true, length: { max: 160 } },
  }),
  googlePreview: googlePreview("page"),
  ...ogFields,
  noindex: noindexField,
  ...seoExtraFields,
  canonicalUrl: fields.url({
    label: "Canonical URL (optional)",
    description: "Only set this if another address should rank instead of this page. Leave blank to use this page's own address.",
  }),
  schemaType: pageSchemaType,
  customJsonLd: customJsonLdField,
});

// content/global-seo.json: site-wide defaults, read by lib/seo.tsx.
// content/robots.json: extra robots.txt rules, read by app/robots.txt/route.ts.
export const globalSingletons = {
  globalSeo: singleton({
    label: "Global SEO settings",
    path: "content/global-seo",
    format: "json",
    schema: {
      titleTemplate: fields.text({
        label: "Page title template",
        description: "How every page title is built. %title% is the page's SEO title and %site% is the site name. Default: %title% | %site%. The whole title should stay under 60 characters.",
        defaultValue: "%title% | %site%",
        validation: { isRequired: true, pattern: { regex: /^(?=.*%title%)[^%]*(%(title|site)%[^%]*)+$/, message: "Must contain %title%. Only %title% and %site% may appear between % signs." } },
      }),
      defaultDescription: fields.text({
        label: "Default meta description",
        description: "Used only when a page has no description of its own. 140 to 160 characters.",
        multiline: true,
        validation: { length: { max: 160 } },
      }),
      defaultSocialImage: fields.image({
        label: "Default social sharing image",
        description: "A 1200 x 630 px .jpg or .webp. Used on pages that have no share card of their own.",
        directory: "public/social",
        publicPath: "/social/",
      }),
      logo: fields.image({
        label: "Website logo (for Google)",
        description: "A square .png of at least 112 x 112 px. Used in the Organization schema. Leave empty to keep /logo.png.",
        directory: "public/social",
        publicPath: "/social/",
      }),
    },
  }),
  robotsTxt: singleton({
    label: "Robots.txt",
    path: "content/robots",
    format: "json",
    schema: {
      content: fields.text({
        label: "robots.txt text",
        description:
          "The whole file, served at /robots.txt. Allowed lines: User-agent, Allow, Disallow, Sitemap, Crawl-delay and # comments. Disallow: / (the whole site), blocking AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot), and removing the /keystatic and /api/keystatic rules are refused. A Sitemap line is added if missing. Checked again when the site builds.",
        multiline: true,
        validation: {
          isRequired: true,
          pattern: {
            regex: /^(?=[\s\S]*^Disallow:\s*\/keystatic\s*$)(?=[\s\S]*^Disallow:\s*\/api\/keystatic\s*$)(?![\s\S]*^Disallow:\s*\/\s*$)[\s\S]*$/m,
            message: "Keep Disallow: /keystatic and Disallow: /api/keystatic, and never use Disallow: / on its own.",
          },
        },
      }),
    },
  }),
};

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
