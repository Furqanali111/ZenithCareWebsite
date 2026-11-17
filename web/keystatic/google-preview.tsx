import type { BasicFormField } from "@keystatic/core";
import { SnippetPreview } from "./snippet-preview";

/**
 * A field that shows the live Google preview in the editor and stores nothing. kind: a blog post
 * (title, slug and SEO title fields) or a page SEO entry. The component itself is a client module
 * (snippet-preview.tsx); this factory stays plain so the server-side editor API can load the config.
 */
export function googlePreview(kind: "post" | "page"): BasicFormField<null> {
  return {
    kind: "form",
    label: "Google preview",
    Input: () => <SnippetPreview kind={kind} />,
    defaultValue: () => null,
    parse: () => null,
    serialize: () => ({ value: undefined }),
    validate: (value) => value,
    reader: { parse: () => null },
  };
}
