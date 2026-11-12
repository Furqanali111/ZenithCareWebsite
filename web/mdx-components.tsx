import type { MDXComponents } from "mdx/types";
import { BookCall, Callout, H2 } from "@/components/post-blocks";

/**
 * Required by @next/mdx — maps MDX elements to React components.
 * Callout, BookCall and Toc are inserted from the Keystatic editor. Toc is
 * bound to the post's headings in app/resources/[slug]/page.tsx.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { h2: H2, Callout, BookCall, ...components };
}
