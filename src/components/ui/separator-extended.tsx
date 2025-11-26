import { Separator as SeparatorPrimitive } from "@base-ui-components/react/separator";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const separatorVariants = cva(
  "shrink-0 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:border-e data-[orientation=horizontal]:border-t",
  {
    variants: {
      variant: {
        default: "border-solid",
        dashed: "border-dashed",
        dotted: "border-dotted",
        double:
          "border-double p-px data-[orientation=vertical]:border-x data-[orientation=horizontal]:border-y",
      },
    },
  }
);

function Separator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive> &
  VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive
      className={cn(separatorVariants({ variant: props.variant }), className)}
      data-slot="separator"
      {...props}
    />
  );
}

export { Separator };
