import { Suspense } from "react";
import type { Metadata } from "next";
import Editor from "./editor";

// Internal editor: keep it out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Layout() {
  return (
    <Suspense>
      <Editor />
    </Suspense>
  );
}
