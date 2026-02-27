import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

interface BlogArticleProps {
  components: MDXComponents;
  MDX: ComponentType<{ components?: MDXComponents }>;
}

export function BlogArticle({ MDX, components }: BlogArticleProps) {
  return (
    <article className="prose prose-neutral prose-sm dark:prose-invert prose-table:block prose-table:w-full max-w-none prose-img:max-w-full prose-pre:overflow-x-auto prose-table:overflow-x-auto prose-img:rounded-md prose-headings:font-medium prose-a:text-foreground prose-code:text-xs prose-p:text-muted-foreground/80 prose-headings:tracking-tight prose-a:underline-offset-4">
      <MDX components={components} />
    </article>
  );
}
