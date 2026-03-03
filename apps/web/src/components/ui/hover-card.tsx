"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

interface HoverCardProps extends Omit<PopoverPrimitive.Root.Props, "children"> {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

function HoverCard({
  openDelay = 200,
  closeDelay = 100,
  children,
  ...rootProps
}: HoverCardProps) {
  return (
    <PopoverPrimitive.Root data-slot="hover-card" {...rootProps}>
      <HoverCardDelayContext.Provider value={{ openDelay, closeDelay }}>
        {children}
      </HoverCardDelayContext.Provider>
    </PopoverPrimitive.Root>
  );
}

const HoverCardDelayContext = React.createContext({
  openDelay: 200,
  closeDelay: 100,
});

function HoverCardTrigger({
  asChild,
  children,
  ...props
}: PopoverPrimitive.Trigger.Props & {
  asChild?: boolean;
}) {
  const { openDelay, closeDelay } = React.useContext(HoverCardDelayContext);
  const triggerProps = {
    ...props,
    openOnHover: true,
    delay: openDelay,
    closeDelay,
  };
  if (asChild && React.isValidElement(children)) {
    return (
      <PopoverPrimitive.Trigger
        data-slot="hover-card-trigger"
        render={(mergeProps) =>
          React.cloneElement(
            children as React.ReactElement<object>,
            mergeProps
          )
        }
        {...triggerProps}
      />
    );
  }
  return (
    <PopoverPrimitive.Trigger
      data-slot="hover-card-trigger"
      {...triggerProps}
    >
      {children}
    </PopoverPrimitive.Trigger>
  );
}

function HoverCardContent({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          className={cn(
            "data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-[var(--shadow-elevation-md)] outline-hidden data-closed:animate-out data-open:animate-in",
            className
          )}
          data-slot="hover-card-content"
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
