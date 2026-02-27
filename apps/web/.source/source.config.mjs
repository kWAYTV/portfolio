// source.config.ts
import { pageSchema } from "fumadocs-core/source/schema";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
var blogSchema = pageSchema.extend({
  author: z.string(),
  date: z.string().or(z.date())
});
var blogEn = defineCollections({
  type: "doc",
  dir: "content/blog/en",
  schema: blogSchema
});
var blogEs = defineCollections({
  type: "doc",
  dir: "content/blog/es",
  schema: blogSchema
});
var source_config_default = defineConfig();
export {
  blogEn,
  blogEs,
  source_config_default as default
};
