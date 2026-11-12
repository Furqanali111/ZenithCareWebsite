import { fields, singleton } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";

/**
 * Blog content extras: reusable post-body blocks and category intro text.
 * Components render via web/mdx-components.tsx and must keep the same names.
 */
export const bodyComponents = {
  Callout: wrapper({
    label: "Callout box",
    schema: {
      tone: fields.select({
        label: "Style",
        options: [
          { label: "Note", value: "note" },
          { label: "Warning", value: "warning" },
        ],
        defaultValue: "note",
      }),
    },
  }),
  BookCall: block({
    label: "Book a call button",
    schema: {
      label: fields.text({ label: "Button text", description: "Leave blank for 'Book a 15-minute call'. Links to /contact." }),
    },
  }),
  Toc: block({
    label: "Table of contents",
    description: "Lists the post's H2 headings as jump links.",
    schema: {
      title: fields.text({ label: "Heading", description: "Leave blank for 'On this page'." }),
    },
  }),
};

export const collections = {};

export const singletons = {
  // content/category-intros.json: intro text shown on /resources for a category.
  categoryIntros: singleton({
    label: "Blog category intros",
    path: "content/category-intros",
    format: "json",
    schema: {
      items: fields.array(
        fields.object({
          category: fields.text({
            label: "Category",
            description: "Must match the post's Category exactly, for example Billing.",
            validation: { isRequired: true },
          }),
          intro: fields.text({ label: "Intro text", multiline: true, validation: { isRequired: true } }),
        }),
        { label: "Categories", itemLabel: (props) => props.fields.category.value },
      ),
    },
  }),
};
