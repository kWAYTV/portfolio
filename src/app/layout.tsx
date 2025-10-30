import "./globals.css";

import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";

import { baseUrl } from "@/app/sitemap";
import { AnalyticsScript } from "@/components/core/analytics/umami";
import Footer from "@/components/core/layout/footer";
import { Navbar } from "@/components/core/layout/nav";
import { Providers } from "@/components/core/providers/providers";
import { env } from "@/env";
import { createMetadata } from "@/lib/metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        {env.NEXT_PUBLIC_ENABLE_UMAMI === "true" && <AnalyticsScript />}
        <body
          className={`${geistSans.variable} ${geistMono.variable} mx-4 mt-4 max-w-2xl antialiased sm:mt-8 lg:mx-auto`}
        >
          <Providers>
            <main className="mt-4 flex min-w-0 flex-auto flex-col px-1 sm:mt-6 sm:px-2 md:px-0">
              <Navbar />
              {children}
              <Footer />
            </main>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}

export const metadata = createMetadata({
  title: {
    default: "perc.dev",
    template: "%s | perc.dev",
  },
  description: "Welcome to my portfolio!",
  metadataBase: new URL(baseUrl),
});
