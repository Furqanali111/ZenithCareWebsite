# Service Page Optimization Changelog

**Branch:** `feature/seo-keyword-clustering-service-pages` (from `develop`)
**Date:** 2026-10-19
**Diff:** 2 files changed, 51 insertions(+), 1 deletion(-)

This changelog lists every code change made as part of this SEO pass. Per the audit's headline finding, most of the originally-scoped work (metadata, internal linking batches 1-3, structured data) was already done in an earlier PR; this pass found and fixed the specific gaps that remained.

## 1. `web/lib/services.ts`

**What:** Fixed a metadata defect on the Remote Therapeutic Monitoring service.

```diff
-    metaTitle: "Therapeutic Monitoring (RTM)",
+    metaTitle: "Remote Therapeutic Monitoring (RTM) Services",
```

**Why:** Inconsistent with the service's own `name` field and with every sibling program's title pattern (e.g. "Remote Patient Monitoring (RPM) Services"). Matches the primary keyword ("remote therapeutic monitoring services") identified in `KEYWORD_TO_URL_MAP.md` and the workbook's Keyword Clusters sheet.

**URL affected:** `/services/remote-therapeutic-monitoring` (title tag, Open Graph title, Twitter card title — all three derive from `metaTitle` via `pageMetadata()` in `web/lib/seo.tsx`).

## 2. `web/app/services/[service]/page.tsx`

**What:** Added 10 entries to the `CROSS_LINKS` map that drives the existing `CrossLinkNote` component, so every one of the 14 service pages now carries one cross-category internal link (previously only 4 did).

```diff
   "medical-scribe": {
     before: "Scribes are particularly useful for practices managing",
     href: "/services/chronic-care-management",
     label: "CCM documentation requirements",
   },
+  "principal-care-management": {
+    before: "Your practice stays the billing provider for every PCM claim. For clean claim submission, Zenith also provides",
+    href: "/services/medical-billing",
+    label: "medical billing support",
+  },
+  "remote-patient-monitoring": {
+    before: "RPM pairs well with a dedicated point of contact for device and adherence calls. Zenith also provides",
+    href: "/services/patient-care-coordinator",
+    label: "patient care coordinators",
+  },
+  "remote-therapeutic-monitoring": {
+    before: "RTM shares the same monthly care-coordination model as",
+    href: "/services/chronic-care-management",
+    label: "Chronic Care Management",
+  },
+  "transitional-care-management": {
+    before: "TCM's 7- and 14-day follow-up windows are easier to hit with dedicated scheduling support. Zenith also provides",
+    href: "/services/medical-scheduler",
+    label: "remote medical scheduling",
+  },
+  "provider-credentialing": {
+    before: "Once a provider is credentialed and billing, many practices start their first",
+    href: "/services/care-management",
+    label: "care management program",
+  },
+  "accounts-receivable": {
+    before: "AR follow-up often surfaces denials tied to recurring claims like",
+    href: "/services/chronic-care-management",
+    label: "Chronic Care Management",
+  },
+  "medical-scheduler": {
+    before: "Scheduling support pairs naturally with structured follow-up programs like",
+    href: "/services/transitional-care-management",
+    label: "Transitional Care Management",
+  },
+  "medical-receptionist": {
+    before: "Receptionists fielding insurance questions work closely with Zenith's",
+    href: "/services/revenue-cycle-management",
+    label: "revenue cycle management team",
+  },
+  "patient-care-coordinator": {
+    before: "Coordinators frequently support practices already running",
+    href: "/services/chronic-care-management",
+    label: "Chronic Care Management",
+  },
+  "virtual-assistant": {
+    before: "Virtual assistants often handle the admin side of",
+    href: "/services/revenue-cycle-management",
+    label: "revenue cycle management work",
+  },
 };
```

**Why:** `INTERNAL_LINKING_PLAN.md` Batch 3 ("Cross-Category Contextual Links") specified this exact pattern for 4 services; the `CrossLinkNote` component and `CROSS_LINKS` map already existed in code implementing it, but only for those 4. The other 10 services rendered nothing where the template reserves space for this section (`{/* ─── Cross-category link note ─────── */}`). No new component, no new rendering logic — only data added to an existing map, in the same voice and format as the 4 existing entries.

**URLs affected:** `/services/principal-care-management`, `/services/remote-patient-monitoring`, `/services/remote-therapeutic-monitoring`, `/services/transitional-care-management`, `/services/provider-credentialing`, `/services/accounts-receivable`, `/services/medical-scheduler`, `/services/medical-receptionist`, `/services/patient-care-coordinator`, `/services/virtual-assistant`.

**Anchor text:** varied per the Internal Linking Plan's own guidance ("vary anchors pointing to the same page", "2-5 words", no "click here"/"learn more"). 4 of the 10 new links point to `/services/chronic-care-management` (Zenith's flagship and most topically relevant hub for scribe/coordinator/AR/RTM-adjacent workflows) but each uses distinct anchor text and surrounding sentence, matching the existing-4 pattern rather than repeating one phrase.

## 3. New documentation (this task's required deliverables)

| File | Purpose |
|---|---|
| `WebSiteDoc/SEO/KEYWORD_RESEARCH.md` | Research sources, keywords, intent, competitor evidence |
| `WebSiteDoc/SEO/KEYWORD_CLUSTERING.md` | Topic clusters with rationale |
| `WebSiteDoc/SEO/KEYWORD_TO_URL_MAPPING.md` | Per-URL keyword/field map and cannibalization re-check |
| `WebSiteDoc/SEO/SERVICE_PAGE_SEO_AUDIT.md` | Before/after findings per page |
| `WebSiteDoc/SEO/SERVICE_PAGE_OPTIMIZATION_CHANGELOG.md` | This file |
| `WebSiteDoc/SEO/SEO_VALIDATION_REPORT.md` | Build/lint/schema/crawlability validation |

## What was explicitly NOT changed

- No new pages created.
- No existing metadata changed except the one RTM defect (everything else audited as already correct).
- No new blog posts written (5 content gaps identified and documented as recommendations only — writing long-form content is outside "optimize existing service pages").
- No legal, pricing, design, or branding content touched.
- No `13-deferred-items.md` entries needed — no dangling reference was removed or proposed for removal in this pass.
