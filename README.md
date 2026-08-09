# Systems Field Guide

Systems, explained through their trade-offs.

Systems Field Guide is a static educational collection about architecture,
databases, and engineering workflows. Each concept combines mental models,
diagrams, practical use cases, common questions, and the constraints behind real
choices. The first complete guide compares PostgreSQL and MongoDB without
declaring a universal winner.

## Technology

- Astro 7 with strict TypeScript and static output
- Local MDX content collections with validated frontmatter
- Astro’s font pipeline for self-hosted Source Serif 4 and IBM Plex Sans
- Pagefind for build-time, privacy-friendly full-text search
- Vitest and Playwright for unit and browser checks
- Custom CSS and browser APIs; no frontend framework or client runtime

Exact versions are pinned in `package.json`, `.node-version`, `.tool-versions`,
and `pnpm-lock.yaml`. Node.js 24.18.1 and pnpm 11.21.0 are required.

The final `pnpm outdated` audit has three intentional compatibility groups:

- ESLint and `@eslint/js` 9 with `eslint-plugin-astro` 1.7: the Astro plugin’s
  ESLint 10 line currently requires `eslint-plugin-jsx-a11y` 6.10, whose
  published peer range ends at ESLint 9. Combining those newest majors produces
  an unresolved peer graph.
- TypeScript 6.0: the current `typescript-eslint` peer range ends below
  TypeScript 6.1, so TypeScript 7 is not yet compatible.
- `@types/node` 24: types intentionally match the pinned Node 24 LTS runtime
  rather than the Node 26 Current line.

Dependabot will surface compatible upgrades when these ranges converge.

## Local development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Astro serves the site at `http://localhost:4321`. The development server does
not contain a Pagefind index; run a production build before testing search.

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm test:e2e
```

`pnpm build` writes the static site to `dist/` and then creates Pagefind’s
language-aware index. Set `SITE_URL` to the canonical production origin. On
Netlify, `URL` is used when `SITE_URL` is absent; localhost is only the local
fallback.

## Content

Concepts live in `content/concepts/<locale>/` as Markdown or MDX. The schema in
`src/lib/content-schema.ts` validates title, description, category, tags,
locale, translation key, status, difficulty, dates, featured state, and related
IDs. English uses unprefixed routes. Spanish will use `/es/`; until translations
are authored, language links lead to the Spanish coming-soon page.

Drafts are visible during local development for editorial review, but are
excluded from production routes, search, sitemap output, and related-content
resolution. Change the collection entry first when changing published content.

## Deployment

`netlify.toml` pins the same Node and pnpm versions, builds with `pnpm build`,
publishes `dist`, adds security headers, and gives immutable assets long-lived
cache headers. Netlify should provide its production `URL`; a custom domain
should also be set as `SITE_URL` so canonical and Open Graph URLs remain stable.

The project is licensed under the [Apache License 2.0](LICENSE).
