"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Sheet({
  open,
  onOpenChange,
  children,
  ...props
}: DialogPrimitive.Root.Props) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open} {...props}>
      {children}
    </DialogPrimitive.Root>
  );
}

function SheetContent({
  className,
  side = "right",
  children,
  ...props
}: DialogPrimitive.Popup.Props & {
  side?: "left" | "right" | "top" | "bottom";
}) {
  const sideClasses = {
    left: "inset-y-0 left-0 h-full w-full data-closed:slide-out-to-left data-open:slide-in-from-left",
    right:
      "inset-y-0 right-0 h-full w-full data-closed:slide-out-to-right data-open:slide-in-from-right",
    top: "inset-x-0 top-0 w-full data-closed:slide-out-to-top data-open:slide-in-from-top",
    bottom:
      "inset-x-0 bottom-0 w-full data-closed:slide-out-to-bottom data-open:slide-in-from-bottom",
  };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Popup
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-(--shadow-elevation-lg)",
          "data-closed:fade-out-0 data-open:fade-in-0 data-closed:animate-out data-open:animate-in data-closed:duration-300 data-open:duration-500",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 px-4 py-3", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-medium text-sm", className)}
      {...props}
    />
  );
}

export { Sheet, SheetContent, SheetHeader, SheetTitle };
