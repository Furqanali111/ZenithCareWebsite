import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx — maps MDX elements to React components.
 * Keep it minimal; add overrides (e.g. custom `<Callout>`) only when a
 * post actually needs one.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
