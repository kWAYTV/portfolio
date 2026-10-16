import { type ReactNode, ViewTransition } from "react";

/**
 * Wraps a page's document. On a route change the outgoing page fades out
 * (`.page-out`) while the incoming one is shown live and lets its own mount
 * cascade play (`.page-in` has no animation). Lives in each `page.tsx`, not
 * the layout: layouts persist across navigations, so enter/exit never fire
 * there.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition default="none" enter="page-in" exit="page-out">
      {children}
    </ViewTransition>
  );
}
