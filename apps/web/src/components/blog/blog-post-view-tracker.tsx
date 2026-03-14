"use client";

import { analytics } from "@repo/analytics";
import { useEffect } from "react";

interface BlogPostViewTrackerProps {
  slug: string;
}

export function BlogPostViewTracker({ slug }: BlogPostViewTrackerProps) {
  useEffect(() => {
    analytics.blogPostView(slug);
  }, [slug]);
  return null;
}
