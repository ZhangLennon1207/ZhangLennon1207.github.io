import { defineCollection, z } from "astro:content";

const optionalUrl = z.preprocess(
	(value) => (value === "" || value === null ? undefined : value),
	z.string().url().optional(),
);
const optionalDate = z.preprocess(
	(value) => (value === "" || value === null ? undefined : value),
	z.coerce.date().optional(),
);

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
        pinned: z.boolean().default(false),
		author: z.string().optional(),
		authorUrl: optionalUrl,
		sourceUrl: optionalUrl,
		licenseUrl: optionalUrl,
		published: z.coerce.date(),
		updated: optionalDate,
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
