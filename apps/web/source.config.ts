import { pageSchema } from "fumadocs-core/source/schema";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

const blogSchema = pageSchema.extend({
  author: z.string(),
  date: z.string().or(z.date()),
});

export const blogEn = defineCollections({
  type: "doc",
  dir: "content/blog/en",
  schema: blogSchema,
});

export const blogEs = defineCollections({
  type: "doc",
  dir: "content/blog/es",
  schema: blogSchema,
});

export default defineConfig();
