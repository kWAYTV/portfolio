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
      "w-full max-w-sm space-y-5 sm:max-w-md sm:space-y-6 md:max-w-lg",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
