"use client";

import type { HTMLAttributes, Ref } from "react";
import { cn } from "@/lib/utils";

export function PageContent({
  children,
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 max-w-2xl space-y-6 px-4 py-8 sm:max-w-3xl sm:space-y-8 sm:px-6 sm:py-10",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
}
