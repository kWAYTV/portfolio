"use client";

import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { BlurFade } from "@/components/ui/blur-fade";

type PageContentProps = {
  children: React.ReactNode;
};

export function PageContent({ children }: PageContentProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <BlurFade
        className="w-full max-w-sm space-y-5 sm:max-w-md sm:space-y-6"
        duration={0.2}
        inView
        key={pathname}
      >
        {children}
      </BlurFade>
    </AnimatePresence>
  );
}
