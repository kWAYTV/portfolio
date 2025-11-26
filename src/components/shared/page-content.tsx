"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

type PageContentProps = {
  children: React.ReactNode;
};

export function PageContent({ children }: PageContentProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1 }}
        className="w-full max-w-sm space-y-5 sm:max-w-md sm:space-y-6"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key={pathname}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
