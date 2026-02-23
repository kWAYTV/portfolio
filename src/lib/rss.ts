import { Feed } from "feed";
import { cacheLife } from "next/cache";
import { baseUrl, siteName } from "@/lib/metadata";
import { blogSource } from "@/lib/source";

// biome-ignore lint/suspicious/useAwait: <use cache components need to be async>
export async function getRSS(): Promise<string> {
  "use cache";
  cacheLife("days"); // Revalidate daily; new posts appear in feed within 24h

  const feed = new Feed({
    title: `Blog | ${siteName}`,
    id: `${baseUrl.origin}/blog`,
    link: `${baseUrl.origin}/blog`,
    language: "en",
    favicon: `${baseUrl.origin}/icon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteName}`,
  });

  const pages = blogSource.getPages().sort((a, b) => {
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
}
