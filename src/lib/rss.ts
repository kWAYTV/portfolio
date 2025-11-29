import { Feed } from "feed";
import { blogSource } from "@/lib/source";

const baseUrl = "https://perc.dev";

export function getRSS() {
  const feed = new Feed({
    title: "perc.dev blog",
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: "en",
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Martin Vila`,
  });

  for (const page of blogSource.getPages()) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date ?? Date.now()),
      author: [{ name: page.data.author ?? "Martin Vila" }],
    });
  }

  return feed.rss2();
}
