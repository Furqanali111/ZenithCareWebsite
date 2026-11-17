import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { pageMetadata } from "@/lib/seo";
import { loadDashboard } from "@/lib/seo-dashboard-data";
import { SeoDashboardTable } from "@/components/seo-dashboard-table";

// For the SEO team: every post and edited page with its score, keyword and indexing status.
// Behind the gate in proxy.ts (GitHub sign-in or password), noindex, and not in the sitemap.
// Rendered per request because the text of pages written in code is read from the live site.
// The data is built in lib/seo-dashboard-data.ts. Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
export const metadata: Metadata = pageMetadata({
  title: "SEO dashboard",
  description: "Internal SEO status of every post and page. Not for search engines.",
  path: "/seo-dashboard",
  noindex: true,
});

async function Dashboard() {
  await connection(); // request time: pages are read from the running site
  return <SeoDashboardTable {...await loadDashboard()} />;
}

export default function SeoDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">SEO dashboard</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Score and status of every post and edited page. Filter, sort, export, or switch to the table to edit many rows at once. Edits are saved to a pull request, so they go live after review, merge and deploy.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Reading the pages...</p>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
