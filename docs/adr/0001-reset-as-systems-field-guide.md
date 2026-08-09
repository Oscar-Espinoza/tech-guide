# ADR 0001: Reset as Systems Field Guide

- Status: Accepted
- Date: 2026-08-09

## Context

The repository began as an uncommitted teaching monorepo that compared backend
runtimes and persistence implementations. The publishing goal changed to a
focused field guide that teaches system choices through constraints, diagrams,
and durable written concepts. The old applications, services, infrastructure,
and cross-language tooling increased maintenance without serving that goal.

## Decision

Replace the untracked monorepo with one static Astro project. Publish validated
local MDX, generate a static sitemap, and build a Pagefind index after Astro.
Use custom CSS and small browser scripts rather than a frontend framework. Host
on Netlify with pinned Node and pnpm versions and static security headers.

English content uses unprefixed routes. Spanish has an immediate `/es/` entry
point and translation-key infrastructure, but no translated concepts in the
first release. PostgreSQL vs MongoDB is the first complete concept.

## Consequences

The site has no runtime application server, content database, authentication, or
CMS. Publishing requires a repository change and production build. Search is
fully static and unavailable in the raw development server until an index is
built. This keeps hosting and failure modes simple while the collection grows.

The previous untracked implementation was permanently removed. Git history, the
existing remote and repository name, and the Apache 2.0 license remain.
