"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const PageContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    className={cn(
      "mx-auto w-full min-w-0 max-w-2xl space-y-5 px-4 py-6 sm:max-w-4xl sm:space-y-6 sm:px-6 sm:py-8",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
