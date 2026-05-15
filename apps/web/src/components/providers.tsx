"use client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/modules/theming/components/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
      <Toaster richColors />
    </ThemeProvider>
  );
}
