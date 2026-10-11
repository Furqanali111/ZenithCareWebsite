/**
 * Augments the default `*.mdx` type (from @types/mdx) so TypeScript sees
 * ESM named exports from the top of our post files — specifically
 * `export const frontmatter = { ... }`. The runtime shape is enforced by
 * the self-check in content/posts.ts.
 */
declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType<MDXProps>;
  export const frontmatter: Record<string, unknown>;
  export default MDXComponent;
}
