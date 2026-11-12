import { collection, config, fields, singleton } from "@keystatic/core";
import * as editablePages from "./keystatic/editable-pages";

/**
 * Blog editor at /keystatic. Edits content/posts/*.mdx in the git repo.
 * - `next dev`: reads and writes local files, no login.
 * - Production: GitHub login. Saves go to a branch and open a PR (never push to develop).
 * Setup + env vars: WebSiteDoc/Project/16-keystatic-cms.md
 */
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
    ...editablePages.collections,
    posts: collection({
      label: "Blog posts",
      path: "content/posts/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
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
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are saved but never shown on the site or in the sitemap.",
          defaultValue: false,
        }),
        body: fields.mdx({
          label: "Body",
          options: {
            image: {
              directory: "public/resources/body",
              publicPath: "/resources/body/",
            },
          },
        }),
      },
    }),
  },
  singletons: {
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
