import { collection, config, fields, singleton } from "@keystatic/core";
import { collections as searchCollections, singletons as searchSingletons, ogFields, noindexField } from "./keystatic/search-appearance";
import * as blog from "./keystatic/blog-content";

// Shared field builders for the CPT and denial code pages.
const textList = (label: string, item: string) =>
  fields.array(fields.text({ label: item, multiline: true, validation: { isRequired: true } }), {
    label,
    itemLabel: (props) => props.value.slice(0, 60),
  });
const faqList = () =>
  fields.array(
    fields.object({
      question: fields.text({ label: "Question", validation: { isRequired: true } }),
      answer: fields.text({ label: "Answer", multiline: true, validation: { isRequired: true } }),
    }),
    { label: "FAQs (at least 2)", itemLabel: (props) => props.fields.question.value },
  );
const sourceLink = (required: boolean) =>
  fields.object({
    label: fields.text({ label: "Link text", validation: { isRequired: required } }),
    href: fields.url({ label: "Link address", validation: { isRequired: required } }),
  });
const metaDescription = () =>
  fields.text({
    label: "Meta description",
    description: "Shown in Google. The build fails unless it is 140 to 160 characters.",
    multiline: true,
    validation: { isRequired: true, length: { min: 140, max: 160 } },
  });

/**
 * Blog editor at /keystatic. Edits content/posts/*.mdx in the git repo.
 * - `next dev`: reads and writes local files, no login.
 * - Production: GitHub login. Saves go to a branch and open a PR (never push to develop).
 * Setup + env vars: WebSiteDoc/Project/16-keystatic-cms.md
 */
// Optional schema.org entity list: a name plus an optional reference URL (Wikipedia, cms.gov).
const entityList = (label: string, description: string) =>
  fields.array(
    fields.object({
      name: fields.text({ label: "Name", validation: { isRequired: true } }),
      url: fields.url({ label: "Reference URL (optional)" }),
    }),
    { label, description, itemLabel: (props) => props.fields.name.value },
  );

export default config({
  storage:
    process.env.NODE_ENV === "development"
      ? { kind: "local" }
      : {
          kind: "github",
          repo: "Furqanali111/ZenithCareWebsite",
          // The Next app lives in web/ inside the repo.
          pathPrefix: "web",
        },
  collections: {
    ...searchCollections,
    posts: collection({
      label: "Blog posts",
      path: "content/posts/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      // Opens the live page: same address in dev and on thezcs.com (live once the PR is merged).
      previewUrl: "/resources/{slug}",
      schema: {
        // The slug (URL) is editable separately from the H1 title.
        title: fields.slug({
          name: {
            label: "Title (H1)",
            validation: { isRequired: true },
          },
          slug: { label: "URL slug" },
        }),
        metaTitle: fields.text({
          label: "SEO title",
          description: "Shown in Google. Aim for 60 characters or fewer. Leave blank to reuse the H1.",
          validation: { length: { max: 60 } },
        }),
        description: fields.text({
          label: "Meta description",
          description: "Shown in Google and at the top of the post. 160 characters or fewer.",
          multiline: true,
          validation: { isRequired: true, length: { max: 160 } },
        }),
        publishedAt: fields.date({
          label: "Published",
          validation: { isRequired: true },
        }),
        updatedAt: fields.date({
          label: "Last updated",
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: "Category",
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        readingMinutes: fields.integer({
          label: "Reading time (minutes)",
          validation: { isRequired: true, min: 1 },
        }),
        // Keystatic saves the file as public/resources/<slug>/coverImage.<ext> and
        // stores /resources/<slug>/coverImage.<ext>. The page uses the title as alt text.
        coverImage: fields.image({
          label: "Cover image",
          description: "Upload a landscape .webp or .jpg about 1280 px wide, under 200 KB. The page crops it to a wide banner.",
          directory: "public/resources",
          publicPath: "/resources/",
        }),
        coverAlt: fields.text({
          label: "Cover image alt text",
          description: "Describes the image for screen readers and Google Images. Leave blank to reuse the title.",
        }),
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: "Question", validation: { isRequired: true } }),
            answer: fields.text({
              label: "Answer",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "FAQs (also become FAQPage schema)",
            itemLabel: (props) => props.fields.question.value,
          },
        ),
        noindex: fields.checkbox({
          label: "Hide from Google (noindex)",
          description: "The post stays reachable by its URL but is left out of search results and the sitemap.",
          defaultValue: false,
        }),
        ...ogFields,
        canonicalUrl: fields.url({
          label: "Canonical URL (optional)",
          description: "Only set this if the same article is published elsewhere and that copy should rank. Leave blank to use this page's own address.",
        }),
        about: entityList("About (schema)", "The main topics of the article, for example Chronic Care Management. Added to the Article structured data."),
        mentions: entityList("Mentions (schema)", "Other named things the article discusses, for example CMS or HIPAA. Added to the Article structured data."),
        publishAt: fields.date({
          label: "Publish on (optional)",
          description: "A future date hides the post until that day. It goes live on the first site rebuild on or after it (see 16c-cms-blog-content.md).",
        }),
        related: fields.array(fields.relationship({ label: "Post", collection: "posts" }), {
          label: "Related posts (optional)",
          description: "Hand-picked posts shown first under Related reading. The rest are filled by shared tags.",
          itemLabel: (props) => props.value ?? "Pick a post",
        }),
        series: fields.text({ label: "Series name (optional)", description: "Posts with the same series name link to each other." }),
        seriesOrder: fields.integer({ label: "Position in series", validation: { min: 1 } }),
        sources: fields.array(
          fields.object({
            label: fields.text({ label: "Label", validation: { isRequired: true } }),
            url: fields.url({ label: "URL", validation: { isRequired: true } }),
          }),
          {
            label: "Sources (optional)",
            description: "Replaces the default CMS source links under the post when filled.",
            itemLabel: (props) => props.fields.label.value,
          },
        ),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are saved but never shown on the site or in the sitemap.",
          defaultValue: false,
        }),
        body: fields.mdx({
          label: "Body",
          components: blog.bodyComponents,
          options: {
            image: {
              directory: "public/resources/body",
              publicPath: "/resources/body/",
            },
          },
        }),
      },
    }),
    // content/cpt-codes/<code>.json: one page per code under /services/care-management/cpt-codes.
    cptCodes: collection({
      label: "CPT code pages",
      path: "content/cpt-codes/*",
      slugField: "code",
      format: "json",
      previewUrl: "/services/care-management/cpt-codes/{slug}",
      schema: {
        code: fields.slug({
          name: {
            label: "CPT code",
            description: "Five digits. It is the page URL, so do not change it once published.",
            validation: { isRequired: true, pattern: { regex: /^\d{5}$/, message: "Five digits" } },
          },
          slug: { label: "URL slug" },
        }),
        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers come first in lists and on the home page.",
          validation: { isRequired: true, min: 1 },
        }),
        program: fields.select({
          label: "Program",
          options: [
            { label: "Chronic Care Management", value: "ccm" },
            { label: "Principal Care Management", value: "pcm" },
            { label: "Remote Patient Monitoring", value: "rpm" },
            { label: "Remote Therapeutic Monitoring", value: "rtm" },
            { label: "Transitional Care Management", value: "tcm" },
          ],
          defaultValue: "ccm",
        }),
        shortTitle: fields.text({
          label: "Short title",
          description: "Page title is 'CPT <code>: <this> | Zenith Care Solutions'. The build fails above 60 characters in total, so keep this to about 25.",
          validation: { isRequired: true },
        }),
        metaDescription: metaDescription(),
        summary: fields.text({ label: "Summary", multiline: true, validation: { isRequired: true } }),
        time: fields.text({ label: "Time threshold", validation: { isRequired: true } }),
        performer: fields.text({ label: "Who can perform it", multiline: true, validation: { isRequired: true } }),
        frequency: fields.text({ label: "Frequency", multiline: true, validation: { isRequired: true } }),
        rate: fields.text({
          label: "Rate text",
          description: "Type {ccm:99490} to insert the rate kept in the ROI calculator so CCM figures stay in sync. Other rates are plain text.",
          validation: { isRequired: true },
        }),
        requirements: textList("Requirements (at least 3)", "Requirement"),
        pitfalls: textList("Common pitfalls (at least 2)", "Pitfall"),
        pairsWith: fields.array(
          fields.text({
            label: "CPT code",
            validation: { isRequired: true, pattern: { regex: /^\d{5}$/, message: "Five digits" } },
          }),
          { label: "Often billed with (codes that have a page here)", itemLabel: (props) => props.value },
        ),
        conflicts: fields.text({ label: "Cannot be billed with (optional)", multiline: true }),
        cmsFacts: textList("CMS facts (optional, shown with the source link below)", "Fact"),
        cmsSource: sourceLink(false),
        faqs: faqList(),
      },
    }),
    // content/denial-codes/<slug>.json: one page per code under /services/revenue-cycle-management/denial-codes.
    denialCodes: collection({
      label: "Denial code pages",
      path: "content/denial-codes/*",
      slugField: "code",
      format: "json",
      previewUrl: "/services/revenue-cycle-management/denial-codes/{slug}",
      schema: {
        code: fields.slug({
          name: {
            label: "Denial code",
            description: "For example CO-16. The lowercase form (co-16) is the page URL, so do not change it once published.",
            validation: { isRequired: true, pattern: { regex: /^[A-Z]{2}-\d+$/, message: "Two capital letters, a dash and a number, like CO-16" } },
          },
          slug: { label: "URL slug" },
        }),
        shortTitle: fields.text({
          label: "Short title",
          description: "Page title is '<code> Denial: <this> | Zenith Care Solutions'. The build fails above 60 characters in total, so keep this to about 20.",
          validation: { isRequired: true },
        }),
        metaDescription: metaDescription(),
        summary: fields.text({ label: "Summary", multiline: true, validation: { isRequired: true } }),
        remit: fields.text({ label: "What the remittance says (optional)", multiline: true }),
        routine: fields.checkbox({
          label: "Routine adjustment, not a real denial",
          defaultValue: false,
        }),
        causes: textList("Common causes (at least 3)", "Cause"),
        fixes: textList("How to fix (at least 3)", "Fix"),
        prevention: textList("Prevention (at least 2)", "Step"),
        related: fields.array(
          fields.text({
            label: "Denial code page",
            description: "The lowercase URL slug, for example co-16.",
            validation: { isRequired: true, pattern: { regex: /^[a-z]{2}-\d+$/, message: "Like co-16" } },
          }),
          { label: "Related denial codes", itemLabel: (props) => props.value },
        ),
        extraSources: fields.array(sourceLink(true), {
          label: "Extra source links (optional)",
          itemLabel: (props) => props.fields.label.value,
        }),
        faqs: faqList(),
      },
    }),
    ...blog.collections,
  },
  singletons: {
    // content/redirects.json: old address -> new address, applied by next.config.ts.
    redirects: singleton({
      label: "Redirects",
      path: "content/redirects",
      format: "json",
      schema: {
        items: fields.array(
          fields.object({
            from: fields.text({
              label: "Old address",
              description: "Starts with /, for example /resources/old-post-name. No wildcards.",
              validation: { isRequired: true, pattern: { regex: /^\/[A-Za-z0-9\-_/.]*$/, message: "Start with / and use letters, numbers, dashes, slashes" } },
            }),
            to: fields.text({
              label: "New address",
              description: "A path like /resources/new-post-name, or a full https:// address.",
              validation: { isRequired: true },
            }),
            permanent: fields.checkbox({
              label: "Permanent (301)",
              description: "Leave ticked for a renamed page. Untick only for a temporary move.",
              defaultValue: true,
            }),
          }),
          { label: "Redirects", itemLabel: (props) => `${props.fields.from.value} -> ${props.fields.to.value}` },
        ),
      },
    }),
    ...searchSingletons,
    ...blog.singletons,
    // content/faq.json: feeds /faq, the FAQ chatbot and the FAQPage schema.
    faq: singleton({
      label: "FAQ",
      path: "content/faq",
      format: "json",
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({
              label: "ID",
              description: "Unique, lowercase words joined by dashes. Do not change it once published. A duplicate fails the build.",
              validation: {
                isRequired: true,
                pattern: { regex: /^[a-z0-9-]+$/, message: "Lowercase letters, numbers and dashes only" },
              },
            }),
            category: fields.select({
              label: "Category",
              options: [
                { label: "Basics", value: "Basics" },
                { label: "Billing", value: "Billing" },
                { label: "Compliance", value: "Compliance" },
                { label: "Working With Us", value: "Working With Us" },
                { label: "Pricing", value: "Pricing" },
              ],
              defaultValue: "Basics",
            }),
            question: fields.text({ label: "Question", validation: { isRequired: true } }),
            answer: fields.text({
              label: "Answer",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Questions",
            itemLabel: (props) => props.fields.question.value,
          },
        ),
      },
    }),
    // content/page-seo.json: Google title and description of the main pages, by URL path.
    pageSeo: singleton({
      label: "Page titles and descriptions",
      path: "content/page-seo",
      format: "json",
      schema: {
        pages: fields.array(
          fields.object({
            path: fields.text({
              label: "Page URL path",
              description: "For example /about. Do not change it: it picks which page the text applies to.",
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
            ogTitle: ogFields.ogTitle,
            ogSubtitle: ogFields.ogSubtitle,
            noindex: noindexField,
          }),
          {
            label: "Pages",
            itemLabel: (props) => props.fields.path.value,
          },
        ),
      },
    }),
  },
});
