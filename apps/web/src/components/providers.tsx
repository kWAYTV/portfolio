"use client";

import { SoundProvider } from "@/modules/motion/sound";
import { ThemeProvider } from "@/modules/theming/components/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SoundProvider>{children}</SoundProvider>
    </ThemeProvider>
  );
}
