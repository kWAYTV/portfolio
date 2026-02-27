// @ts-nocheck
import * as __fd_glob_5 from "../content/blog/es/side-project-graveyard.mdx?collection=blogEs"
import * as __fd_glob_4 from "../content/blog/es/shipping-the-wrong-thing.mdx?collection=blogEs"
import * as __fd_glob_3 from "../content/blog/es/hello-world.mdx?collection=blogEs"
import * as __fd_glob_2 from "../content/blog/en/side-project-graveyard.mdx?collection=blogEn"
import * as __fd_glob_1 from "../content/blog/en/shipping-the-wrong-thing.mdx?collection=blogEn"
import * as __fd_glob_0 from "../content/blog/en/hello-world.mdx?collection=blogEn"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blogEn = await create.doc("blogEn", "content/blog/en", {"hello-world.mdx": __fd_glob_0, "shipping-the-wrong-thing.mdx": __fd_glob_1, "side-project-graveyard.mdx": __fd_glob_2, });

export const blogEs = await create.doc("blogEs", "content/blog/es", {"hello-world.mdx": __fd_glob_3, "shipping-the-wrong-thing.mdx": __fd_glob_4, "side-project-graveyard.mdx": __fd_glob_5, });