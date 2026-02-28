"use client";

import * as React from "react";
/** biome-ignore lint/performance/noNamespaceImport: shadcn/radix pattern */
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      decorative={decorative}
      orientation={orientation}
      {...props}
  />
  );
}

export { Separator };
