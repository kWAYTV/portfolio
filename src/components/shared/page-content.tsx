"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import { forwardRef } from "react";
import { PAGE_TRANSITION } from "@/consts/transitions";
import { cn } from "@/lib/utils";

export const PageContent = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      animate={PAGE_TRANSITION.animate}
      className={cn(
        "w-full max-w-sm space-y-5 sm:max-w-md sm:space-y-6",
        className
      )}
      exit={PAGE_TRANSITION.exit}
      initial={PAGE_TRANSITION.initial}
      ref={ref}
      transition={PAGE_TRANSITION.transition}
      {...props}
    >
      {children}
    </motion.div>
  )
);
