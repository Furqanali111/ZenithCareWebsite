import { collection, config, fields, singleton } from "@keystatic/core";
import { collections as searchCollections, singletons as searchSingletons, globalSingletons, seoExtraFields, seoItem, ogFields, customJsonLdField } from "./keystatic/search-appearance";
import * as blog from "./keystatic/blog-content";
import { googlePreview } from "./keystatic/google-preview";
import * as technicalSeo from "./keystatic/technical-seo";
import * as editablePages from "./keystatic/editable-pages";
import { REPO } from "./lib/repo";

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
          repo: REPO as `${string}/${string}`,
          // The Next app lives in web/ inside the repo.
          pathPrefix: "web",
        },
  collections: {
    ...searchCollections,
    ...technicalSeo.collections,
    ...editablePages.collections,
    posts: collection({
      label: "Blog posts",
      path: "content/posts/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      // Opens the page on the branch's Vercel preview (app/preview/route.ts), so an unmerged edit can be seen. Falls back to the live address.
      previewUrl: "/preview?branch={branch}&to=/resources/{slug}",
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
          description: "Shown in Google, with the site name added after it. Keep it to 36 characters or fewer so the whole title stays under 60. Leave blank to reuse the H1 (the dashboard checks the whole title).",
          validation: { length: { max: 60 } },
        }),
        description: fields.text({
          label: "Meta description",
          description: "Shown in Google and at the top of the post. Aim for 140 to 160 characters (the dashboard checks this). Longer than 160 is refused.",
          multiline: true,
          validation: { isRequired: true, length: { max: 160 } },
        }),
        // Shows the search result and title checks while you type. Stores nothing.
        googlePreview: googlePreview("post"),
        publishedAt: fields.date({
          label: "Published",
          validation: { isRequired: true },
        }),
        updatedAt: fields.date({
          label: "Last updated",
          description: "Set to today automatically when a pull request changes the post text (.github/workflows/post-dates.yml). Set it by hand only to override.",
          validation: { isRequired: true },
        }),
        reviewedAt: fields.date({
          label: "Clinically reviewed on (optional)",
          description: "The day the clinical reviewer last checked the facts. Shown under the title.",
        }),
        // A fixed list: a typo in free text would create a new category with no intro text on /resources.
        // To add a category, add it here and in content/category-intros.json.
        category: fields.select({
          label: "Category",
          options: ["Billing & Reimbursement", "CCM Operations", "Care Management", "Compliance", "Revenue Cycle", "Virtual Staffing"].map((c) => ({ label: c, value: c })),
          defaultValue: "CCM Operations",
        }),
        // Lowercase with dashes (cpt-99490, medical-billing): "CCM", "ccm" and "Ccm" would be three different tags.
        tags: fields.array(fields.text({ label: "Tag", validation: { pattern: { regex: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Lowercase letters, numbers and single dashes, like medical-billing" } } }), {
          label: "Tags",
          itemLabel: (props) => props.value,
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
        ...seoExtraFields,
        schemaType: fields.select({
          label: "Schema type",
          description: "Article is the default. NewsArticle is left out on purpose: this is health guidance, not news.",
          options: [
            { label: "Article", value: "Article" },
            { label: "BlogPosting", value: "BlogPosting" },
            { label: "TechArticle", value: "TechArticle" },
          ],
          defaultValue: "Article",
        }),
        customJsonLd: customJsonLdField,
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
      previewUrl: "/preview?branch={branch}&to=/services/care-management/cpt-codes/{slug}",
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
      previewUrl: "/preview?branch={branch}&to=/services/revenue-cycle-management/denial-codes/{slug}",
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
    ...searchSingletons,
    ...globalSingletons,
    ...blog.singletons,
    ...technicalSeo.singletons,
    ...editablePages.singletons,
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
        pages: fields.array(seoItem, {
          label: "Pages",
          itemLabel: (props) => props.fields.path.value,
        }),
      },
    }),
  },
});
