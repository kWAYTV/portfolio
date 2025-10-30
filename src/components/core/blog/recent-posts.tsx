import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

const MAX_RECENT_POSTS = 3;

export function RecentPosts() {
  const allBlogs = getBlogPosts();
  const recentPosts = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, MAX_RECENT_POSTS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl tracking-tight">Recent Posts</h2>
        <Button asChild className="gap-1" size="sm" variant="ghost">
          <Link className="flex items-center" href="/blog">
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div>
        {recentPosts.map((post) => (
          <div key={post.slug}>
            <Link
              className="flex flex-col space-y-1 rounded-md p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
              href={`/blog/${post.slug}`}
            >
              <div className="flex w-full flex-row space-x-0 md:space-x-2">
                <p className="w-[100px] text-neutral-600 tabular-nums dark:text-neutral-400">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
                <p className="text-neutral-900 tracking-tight dark:text-neutral-100">
                  {post.metadata.title}
                </p>
              </div>
            </Link>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
