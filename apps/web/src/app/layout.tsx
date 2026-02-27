import { defaultLocale } from "@portfolio/i18n/config";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { baseUrl } from "@/lib/metadata";

/** Minimal IDE shell for initial load - no @portfolio/ui to avoid barrel import issues */
function InitialLoadShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <div className="flex h-9 shrink-0 items-center border-border border-b bg-secondary px-2 sm:px-4" />
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-12 shrink-0 border-border border-r bg-sidebar md:block" />
        <div className="hidden w-56 shrink-0 border-border border-r bg-sidebar md:block" />
        <main className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <div className="hidden h-11 shrink-0 border-border border-t bg-secondary md:block" />
    </div>
  );
}

export const metadata: Metadata = {
  metadataBase: baseUrl,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-w-0 overflow-x-hidden antialiased`}
      >
        {process.env.NODE_ENV === "development" && (
          <Script
            crossOrigin="anonymous"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            strategy="afterInteractive"
          />
        )}
        <Suspense
          fallback={
            <InitialLoadShell>
              <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:max-w-4xl sm:space-y-6 sm:px-6 sm:py-8">
                <div className="animate-pulse rounded-md bg-accent h-4 w-20" />
                <header className="space-y-1.5">
                  <div className="animate-pulse rounded-md bg-accent h-5 w-28" />
                  <div className="animate-pulse rounded-md bg-accent h-4 w-40" />
                </header>
                <div className="animate-pulse rounded-md bg-accent h-12 w-full" />
                <div className="h-px w-full bg-border" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      className="animate-pulse rounded-md bg-accent h-4 w-16"
                      key={i}
                    />
                  ))}
                </div>
                <div className="h-px w-full bg-border" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="animate-pulse rounded-md bg-accent h-4 w-16" />
                    <div className="animate-pulse rounded-md bg-accent h-3 w-14" />
                  </div>
                  <div className="space-y-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        className="animate-pulse rounded-md bg-accent h-14 w-full sm:h-12"
                        key={i}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </InitialLoadShell>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
