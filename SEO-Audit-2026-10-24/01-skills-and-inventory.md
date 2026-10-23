# 01. Skill execution matrix and page inventory

## Skill execution matrix

| Skill | Source | Capabilities (as documented in its SKILL.md) | Used on | Findings | Overlap | Status |
|---|---|---|---|---|---|---|
| seo-audit | SearchFit | Crawlability, meta, headings, images, schema, links, scored report | All 52 sitemap URLs (live) plus code (`sitemap.ts`, `robots.ts`, `seo.tsx`, `next.config.ts`) | F-06, F-10, passes | technical-seo | Completed |
| technical-seo | SearchFit | Robots, sitemap, status codes, redirects, headers, CWV checklist | Live headers on 8 variants, config review | Redirects clean; CWV unmeasured (F-08) | seo-audit | Partial (CWV blocked: PSI 429) |
| on-page-seo | SearchFit | Title/desc/H1/alt/internal-link checks per page | All pages via crawl | F-06, F-11, F-12 | seo-audit | Completed (audit mode; rewrites proposed, not applied) |
| keyword-clustering | SearchFit | Cluster keywords to pages, flag cannibalization | Existing titles/H1s mapped to intents | F-05, F-09 | content-strategy | Partial: no volume or difficulty data available, so clusters are intent-based only |
| content-strategy | SearchFit | Topical map, gap analysis, calendar | Existing 14 articles + 17 service pages | F-09 | keyword-clustering | Completed (plan only) |
| internal-linking | SearchFit | Inbound/outbound counts, orphans, anchors, hub-spoke | Link graph of 52 pages | F-04 | broken-links | Completed |
| broken-links | SearchFit | Status of all links, redirect chains | 53 unique internal hrefs | None broken | internal-linking | Completed (internal only; external links not checked) |
| schema-markup | SearchFit | JSON-LD types and validity | 7 representative templates + parse of all 52 | F-07, F-13 | seo-audit | Completed (static check; Google Rich Results Test not run) |
| ai-visibility | SearchFit | AI mention audit, content and technical signals | robots.txt, `llms.txt`, schema, answer formatting | See file 04 | none | Partial: live prompts against AI products not run, so no visibility score is claimed |
| create-topic, create-content, content-brief, generate-schema | SearchFit | Generate content or schema | n/a | n/a | n/a | Not run: they produce content or code, deferred until you approve |
| **Claude SEO repository** | Claude SEO | n/a | n/a | n/a | n/a | **Blocked: not installed.** No `claude-seo` skills exist in `~/.claude/skills` or `~/.claude/plugins`. Not installed per your rule. |
| notfair seo-page / sitemap-audit / seo-analysis | Other plugin (`nowork-studio/notfair`) | Installed, different ecosystem | n/a | n/a | Overlaps seo-audit | Not invoked; may need credentials. Listed as an option. |

Capabilities requested from Claude SEO that therefore had no dedicated tool: competitive analysis, backlink analysis, performance/CWV. They were covered by manual crawl scripts and web search, or are marked unavailable.

## Page inventory (52 URLs, all 200, all indexable, all canonical-self)

| Group | Count | URLs |
|---|---|---|
| Home | 1 | `/` |
| Service hubs | 4 | `/services`, `/services/care-management`, `/services/revenue-cycle-management`, `/services/virtual-staffing` |
| Service pages | 14 | CCM, PCM, RPM, RTM, TCM, medical-billing, medical-coding, provider-credentialing, accounts-receivable, medical-scribe, medical-scheduler, medical-receptionist, patient-care-coordinator, virtual-assistant |
| Specialties | 3 | `/who-we-serve/{primary-care,internal-medicine,geriatrics}` |
| Conversion / trust | 8 | `/contact`, `/pricing`, `/how-it-works`, `/roi-calculator`, `/about`, `/faq`, `/hipaa-compliance`, `/security` |
| Resources | 15 | `/resources` + 14 articles |
| Legal | 7 | privacy, terms, hipaa-statement, accessibility, refund-policy, service-delivery, complaints |

Discovery sources: `find app -name page.tsx`, live `sitemap.xml`, crawl of internal links. Code routes and sitemap agree (no route missing from sitemap, nothing in sitemap that 404s). Dynamic routes: `/services/[service]`, `/who-we-serve/[specialty]`, `/resources/[slug]`.

Distinction used throughout: **crawlable** (verified by fetch), **indexable** (no noindex/canonical conflict, verified), **indexed** (not verifiable here, needs Search Console).
