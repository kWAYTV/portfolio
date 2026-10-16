"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SoundProvider } from "@/modules/motion/sound";
import { ThemeProvider } from "@/modules/theming/components/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={280} skipDelayDuration={120}>
        <SoundProvider>{children}</SoundProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
