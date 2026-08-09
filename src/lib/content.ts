import type { CollectionEntry } from 'astro:content';

export type Concept = CollectionEntry<'concepts'>;

export function isPublished(
  concept: Concept,
  production = import.meta.env.PROD,
): boolean {
  return !production || concept.data.status !== 'draft';
}

export function visibleConcepts(
  concepts: Concept[],
  production = import.meta.env.PROD,
): Concept[] {
  return concepts
    .filter((concept) => isPublished(concept, production))
    .sort((a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime());
}

export function conceptSlug(concept: Concept): string {
  return concept.id.replace(/^(en|es)\//, '');
}

export function conceptHref(concept: Concept): string {
  const prefix = concept.data.locale === 'es' ? '/es' : '';
  return `${prefix}/concepts/${conceptSlug(concept)}/`;
}

export function translationHref(
  concepts: Concept[],
  concept: Concept,
  targetLocale: 'en' | 'es',
): string {
  const translation = concepts.find(
    (candidate) =>
      candidate.data.translationKey === concept.data.translationKey &&
      candidate.data.locale === targetLocale &&
      candidate.data.status !== 'draft',
  );

  if (translation) return conceptHref(translation);
  return targetLocale === 'es' ? '/es/' : '/';
}

export function resolveRelated(
  concepts: Concept[],
  concept: Concept,
): Concept[] {
  return concept.data.relatedConcepts
    .map((id) => concepts.find((candidate) => candidate.id === id))
    .filter(
      (candidate): candidate is Concept =>
        Boolean(candidate) &&
        candidate?.data.locale === concept.data.locale &&
        candidate.data.status !== 'draft',
    );
}
