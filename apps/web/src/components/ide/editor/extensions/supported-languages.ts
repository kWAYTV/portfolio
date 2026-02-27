import type { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";

export const langExtensions: Record<string, () => Extension> = {
  tsx: () => javascript({ jsx: true, typescript: true }),
  typescript: () => javascript({ typescript: true }),
  markdown: () => markdown(),
  mdx: () => markdown(),
};
