"use client";

import { analytics } from "@portfolio/analytics";
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
