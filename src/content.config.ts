import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { conceptSchema } from './lib/content-schema';

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx)', base: './content/concepts' }),
  schema: conceptSchema,
});

export const collections = { concepts };
