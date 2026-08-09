import { z } from 'astro/zod';

export const categories = ['architectures', 'databases', 'workflows'] as const;
export const statuses = ['draft', 'published', 'evolving'] as const;
export const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
export const locales = ['en', 'es'] as const;

export const conceptSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20).max(220),
  category: z.enum(categories),
  tags: z.array(z.string().min(1)).min(1),
  locale: z.enum(locales),
  translationKey: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(statuses),
  difficulty: z.enum(difficulties),
  featured: z.boolean().default(false),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  relatedConcepts: z.array(z.string()).default([]),
});

export type ConceptData = z.infer<typeof conceptSchema>;
