"use client";

import { cn } from "@portfolio/ui";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export const PageContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    className={cn(
      "mx-auto w-full min-w-0 max-w-2xl space-y-5 px-4 py-6 sm:max-w-4xl sm:px-6 sm:py-8 sm:space-y-6",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
