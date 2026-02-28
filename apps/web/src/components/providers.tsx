"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ActiveThemeProvider } from "@/components/theming/active-theme-provider";
import { ThemeProvider } from "@/components/theming/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <ActiveThemeProvider>
          {children}
          <Toaster richColors />
        </ActiveThemeProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
