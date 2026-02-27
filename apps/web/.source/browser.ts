// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blogEn: create.doc("blogEn", {"hello-world.mdx": () => import("../content/blog/en/hello-world.mdx?collection=blogEn"), "shipping-the-wrong-thing.mdx": () => import("../content/blog/en/shipping-the-wrong-thing.mdx?collection=blogEn"), "side-project-graveyard.mdx": () => import("../content/blog/en/side-project-graveyard.mdx?collection=blogEn"), }),
  blogEs: create.doc("blogEs", {"hello-world.mdx": () => import("../content/blog/es/hello-world.mdx?collection=blogEs"), "shipping-the-wrong-thing.mdx": () => import("../content/blog/es/shipping-the-wrong-thing.mdx?collection=blogEs"), "side-project-graveyard.mdx": () => import("../content/blog/es/side-project-graveyard.mdx?collection=blogEs"), }),
};
export default browserCollections;