# Keystatic blog content tools

Extends `16-keystatic-cms.md`. Config: `web/keystatic/blog-content.ts` plus the post fields in `web/keystatic.config.ts`.

## Blocks inside the post body

In the Body editor, use the `+` menu:

- **Callout box**: wraps paragraphs in a shaded box. Style Note or Warning.
- **Book a call button**: links to `/contact`. Optional button text.
- **Table of contents**: lists the post's `##` (H2) headings as jump links. Put it near the top. H2 headings now get an `id` so the links work; nothing else changes on existing posts.
- Comparison tables: not a block. The editor already has a Table option in the same menu (stored as a markdown table).

Code: `web/components/post-blocks.tsx`, registered in `web/mdx-components.tsx` (the Toc is bound to the post's headings in `app/resources/[slug]/page.tsx`).

## Post fields

- **Related posts**: pick posts by hand. They show first under "Related reading", then shared-tag ranking fills up to 3.
- **Series name + Position in series**: posts with the same series name show an "In this series" list (ordered by position) under the article. Needs at least 2 posts.
- **Sources**: label + URL list shown under the post. Empty means the default CMS links, as before.
- **Publish on**: a future date hides the post (like a draft: no page, list or sitemap entry) until a build on or after that day. The date comes from the build day (`BUILD_DATE` in `next.config.ts`), so the site must be rebuilt after the date passes. Free options: a Vercel Deploy Hook (Project Settings, Git, Deploy Hooks) called daily by a GitHub Actions `schedule` workflow (`curl -X POST <hook url>`). Not set up yet; until then a scheduled post appears at the next normal deploy.

## Blog category intros

There are no category pages yet. The smallest useful thing: the **Blog category intros** singleton (`content/category-intros.json`) holds intro text per category, shown as a short "topics" block on `/resources` above the post grid. Category must match the posts' Category text exactly. An intro for a category with no published post is hidden. Empty by default, so the page is unchanged.

## Internal link report

```bash
cd web && pnpm links:report
```

Lists published posts that no other post links to (counts `/resources/<slug>` links in bodies and the Related posts field). No editor UI.
