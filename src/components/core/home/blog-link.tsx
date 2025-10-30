import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";

import { cn } from "@/lib/utils";

export function BlogLink() {
  return (
    <Link
      className="group flex items-center gap-2 text-foreground transition-colors hover:text-primary"
      href="/blog"
    >
      <span className="font-medium hover:underline hover:underline-offset-4">
        Read my blog
      </span>
      <ArrowRight
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          "group-hover:translate-x-1"
        )}
      />
    </Link>
  );
}
