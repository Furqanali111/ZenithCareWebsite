import { collection, config, fields } from "@keystatic/core";

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
});
