"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

const stage: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.04, staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, transform: "translateY(10px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

const wipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.7, ease: EASE },
  },
};

/** One orchestrated entrance for a page: children stagger in reading order. */
export function Stage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate="show"
      className={className}
      initial="hidden"
      variants={stage}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/** Text that is drawn left to right, like a plotter pen. */
export function Wipe({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={wipe}>
      {children}
    </motion.div>
  );
}

/** A 2px ink rule that draws itself when it scrolls into view. */
export function Rule() {
  return (
    <motion.span
      aria-hidden="true"
      className="rule"
      initial={{ transform: "scaleX(0)" }}
      transition={{ duration: 0.6, ease: EASE }}
      viewport={{ amount: 0.8, once: true }}
      whileInView={{ transform: "scaleX(1)" }}
    />
  );
}

/** Route enter: a short rise, exit is instant. */
export function PageEnter({ children }: { children: ReactNode }) {
  return (
    <motion.div
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      initial={{ opacity: 0, transform: "translateY(6px)" }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
