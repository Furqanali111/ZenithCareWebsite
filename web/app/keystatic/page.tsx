// The editor UI is rendered by ./layout.tsx. Deeper editor URLs
// (/keystatic/branch/...) are rewritten to this page in next.config.ts.
// The layout never renders `children`, which `next dev` flags as an unvalidated segment.
export const instant = false;

export default function Page() {
  return null;
}
