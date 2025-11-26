import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const rfds = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rfds' }),
  schema: z.object({
    title: z.string(),
    number: z.string(),
    author: z.string(),
    state: z.enum(['idea', 'discussing', 'accepted', 'active', 'archived']),
    tags: z.array(z.string()),
    created: z.string(),
    updated: z.string().optional(),
  }),
});

export const collections = { rfds };
