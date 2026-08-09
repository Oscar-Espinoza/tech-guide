# AGENTS.md

## Project purpose

`tech-guide` publishes **Systems Field Guide**, a static educational collection
that explains architectures, databases, and engineering workflows through
trade-offs. Favor clear mental models, traceable official references, practical
constraints, and accessible diagrams over feature lists or universal winners.

## Architecture

- This is one root-level Astro project with static output. Do not add a backend,
  SSR adapter, CMS, database, frontend framework, monorepo tooling, or external
  content service without a current, documented requirement.
- Content is local Markdown/MDX in the validated `concepts` collection.
- Keep client JavaScript limited to search, theme, mobile navigation, and
  collection filters. Prefer semantic HTML, Astro components, CSS, and browser
  APIs.
- Reusable diagrams are Astro-rendered SVG with titles, descriptions, captions,
  legends where needed, and shared theme tokens. Do not introduce Mermaid.
- Record meaningful publishing or architecture decisions in `docs/adr/`.

## Content contract

- Concept frontmatter includes `title`, `description`, `category`, `tags`,
  `locale`, `translationKey`, `status`, `difficulty`, `featured`, `publishedAt`,
  `updatedAt`, and `relatedConcepts`.
- Categories are `architectures`, `databases`, and `workflows`. Statuses are
  `draft`, `published`, and `evolving`.
- English is unprefixed. Spanish content uses `/es/`; missing Spanish
  translations link to `/es/` rather than serving English under a Spanish URL.
- Drafts must not enter production routes, Pagefind, sitemaps, or related lists.
- Use the standard sections: overview, mental model, how it works, use cases,
  trade-offs, when to choose each option, dos and don’ts, common questions,
  diagrams, references, and related concepts.
- Prefer official primary references. Date meaningful revisions.

## Visual and accessibility conventions

- Preserve the warm/graphite editorial system, restrained blue accent, Source
  Serif 4 headings, and IBM Plex Sans body text.
- Self-host fonts through Astro’s supported font pipeline. Pages must not depend
  on third-party font requests.
- Keep correct document language, semantic landmarks and heading order, visible
  keyboard focus, WCAG AA contrast, reduced-motion behavior, and useful text
  alternatives for every diagram.
- Theme controls must honor the system default, persist manual choice, and keep
  the pre-render initialization in the document head to prevent flashing.

## Tooling and workflow

1. Inspect the worktree and preserve unrelated user changes.
2. Use the exact Node and pnpm versions declared by the repository. Dependencies
   and GitHub Actions remain exactly pinned; no floating tags or prereleases.
3. Make the smallest coherent change. Update docs when routes, commands,
   metadata, or publishing behavior change.
4. Run `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test`,
   `pnpm build`, and relevant Playwright tests.
5. Verify both themes and mobile/desktop behavior for visual changes.
6. Run `pnpm outdated` when changing dependencies and document any intentional
   compatibility pin.
