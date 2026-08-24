// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string()),
      readTime: z.string(),
      dateModified: z.date().optional(),
      bookTitle: z.string().optional(),
      bookTitleShort: z.string().optional(),
    })
});
// Book metadata synced from my local reading notes by scripts/sync-books.mjs.
// Do not hand-edit src/data/books — the sync rewrites it wholesale.
const books = defineCollection({
    loader: glob({ pattern: '**/*.json', base: "./src/data/books" }),
    schema: z.object({
      title: z.string(),
      subtitle: z.string().nullable().default(null),
      author: z.array(z.string()).default([]),
      authorCountry: z.string().length(2).nullable().default(null),
      authorGender: z.string().nullable().default(null),
      category: z.array(z.string()).default([]),
      publisher: z.string().nullable().default(null),
      pubYear: z.number().nullable().default(null),
      pages: z.number().nullable().default(null),
      isbn: z.string().nullable().default(null),
      rating: z.number().min(0).max(5).nullable().default(null),
      datesRead: z.array(z.string()).default([]),
      cover: z.string().nullable().default(null),
    })
});
// Export a single `collections` object to register your collection(s)
export const collections = { blog, books };