import { describe, expect, it } from 'vitest';
import {
  conceptHref,
  conceptSlug,
  resolveRelated,
  translationHref,
  visibleConcepts,
  type Concept,
} from '../src/lib/content';
import { conceptSchema } from '../src/lib/content-schema';

const makeConcept = (
  id: string,
  overrides: Record<string, unknown> = {},
): Concept =>
  ({
    id,
    body: '',
    collection: 'concepts',
    data: {
      title: 'A valid concept',
      description: 'A sufficiently detailed description for schema validation.',
      category: 'databases',
      tags: ['data'],
      locale: 'en',
      translationKey: 'valid-concept',
      status: 'published',
      difficulty: 'beginner',
      featured: false,
      publishedAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-02'),
      relatedConcepts: [],
      ...overrides,
    },
    filePath: `/content/${id}.mdx`,
    digest: id,
    rendered: undefined,
    deferredRender: true,
  }) as unknown as Concept;

describe('content schema and publishing helpers', () => {
  it('validates complete frontmatter and rejects invalid categories', () => {
    expect(conceptSchema.safeParse(makeConcept('en/valid').data).success).toBe(
      true,
    );
    expect(
      conceptSchema.safeParse({
        ...makeConcept('en/valid').data,
        category: 'tools',
      }).success,
    ).toBe(false);
  });

  it('excludes drafts in production and sorts by most recently updated', () => {
    const draft = makeConcept('en/draft', {
      status: 'draft',
      updatedAt: new Date('2026-02-01'),
    });
    const older = makeConcept('en/older', {
      updatedAt: new Date('2026-01-01'),
    });
    const newer = makeConcept('en/newer', {
      updatedAt: new Date('2026-01-10'),
    });
    expect(
      visibleConcepts([draft, older, newer], true).map((item) => item.id),
    ).toEqual(['en/newer', 'en/older']);
    expect(visibleConcepts([draft], false)).toHaveLength(1);
  });

  it('builds locale-aware routes and falls back when a translation is absent', () => {
    const english = makeConcept('en/postgresql-vs-mongodb', {
      translationKey: 'databases',
    });
    const spanish = makeConcept('es/postgresql-vs-mongodb', {
      locale: 'es',
      translationKey: 'databases',
    });
    expect(conceptSlug(english)).toBe('postgresql-vs-mongodb');
    expect(conceptHref(english)).toBe('/concepts/postgresql-vs-mongodb/');
    expect(translationHref([english], english, 'es')).toBe('/es/');
    expect(translationHref([english, spanish], english, 'es')).toBe(
      '/es/concepts/postgresql-vs-mongodb/',
    );
  });

  it('resolves related entries in order while excluding drafts and other locales', () => {
    const source = makeConcept('en/source', {
      relatedConcepts: ['en/one', 'en/draft', 'es/one'],
    });
    const one = makeConcept('en/one');
    const draft = makeConcept('en/draft', { status: 'draft' });
    const spanish = makeConcept('es/one', { locale: 'es' });
    expect(
      resolveRelated([source, one, draft, spanish], source).map(
        (item) => item.id,
      ),
    ).toEqual(['en/one']);
  });
});
