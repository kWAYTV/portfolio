"use client";

import {
  AnimatePresence,
  type MotionProps,
  motion,
  type UseInViewOptions,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useRef } from "react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  inViewMargin?: MarginType;
  /** Set to true for LCP-critical content to avoid filter cost and improve paint */
  noBlur?: boolean;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  noBlur = false,
  blur = "6px",
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const effectiveBlur = noBlur || reducedMotion ? "0px" : blur;
  const effectiveDuration = reducedMotion ? 0 : duration;
  const effectiveDelay = reducedMotion ? 0 : 0.04 + delay;

  const defaultVariants: Variants = {
    hidden: {
      [direction === "left" || direction === "right" ? "x" : "y"]:
        direction === "right" || direction === "down" ? -offset : offset,
      opacity: 0,
      filter: `blur(${effectiveBlur})`,
    },
    visible: {
      [direction === "left" || direction === "right" ? "x" : "y"]: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        animate={isInView || reducedMotion ? "visible" : "hidden"}
        className={className}
        exit="hidden"
        initial={reducedMotion ? "visible" : "hidden"}
        ref={ref}
        transition={{
          delay: effectiveDelay,
          duration: effectiveDuration,
          ease: "easeOut",
        }}
        variants={combinedVariants}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
