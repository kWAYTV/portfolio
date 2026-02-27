import { Feed } from "feed";
import { unstable_cache } from "next/cache";
import { baseUrl, siteName } from "@/lib/metadata";
import { blogSource } from "@/lib/source";
import { fumadocsI18n } from "@/lib/i18n";

export async function getRSS(): Promise<string> {
  return unstable_cache(
    async () => {
      const feed = new Feed({
        title: `Blog | ${siteName}`,
        id: `${baseUrl.origin}/blog`,
        link: `${baseUrl.origin}/blog`,
        language: "en",
        favicon: `${baseUrl.origin}/icon.png`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${siteName}`,
      });

      const pages = blogSource
        .getPages(fumadocsI18n.defaultLanguage)
        .sort((a, b) => {
          const dateA = new Date(a.data.date ?? 0).getTime();
          const dateB = new Date(b.data.date ?? 0).getTime();
          return dateB - dateA;
        });

      for (const page of pages) {
        feed.addItem({
          id: `${baseUrl.origin}${page.url}`,
          title: page.data.title ?? "",
          description: page.data.description ?? undefined,
          link: `${baseUrl.origin}${page.url}`,
          date: new Date(page.data.date ?? 0),
          author: [{ name: page.data.author ?? siteName }],
        });
      }

      return feed.rss2();
    },
    ["rss"],
    { revalidate: 86_400 }
  )();
}
