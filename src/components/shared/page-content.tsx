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
      "w-full max-w-sm space-y-5 sm:max-w-md md:max-w-lg sm:space-y-6",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
