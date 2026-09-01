import { pageSchema } from "fumadocs-core/source/schema";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

const blogSchema = pageSchema.extend({
  author: z.string(),
  date: z.string().or(z.date()),
});

export const blogEn = defineCollections({
  dir: "content/blog/en",
  schema: blogSchema,
  type: "doc",
});

export const blogEs = defineCollections({
  dir: "content/blog/es",
  schema: blogSchema,
  type: "doc",
});

export default defineConfig();
