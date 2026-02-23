import { UmamiScript } from "@/components/analytics/umami-script";
import { ThemeProvider } from "@/components/theming/provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { baseUrl, createMetadata, siteName } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  ...createMetadata({
    title: siteName,
    description: "welcome to my personal space.",
  }),
  alternates: {
    types: {
      "application/rss+xml": [
        { title: `Blog | ${siteName}`, url: `${baseUrl.origin}/rss` },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UmamiScript />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </NuqsAdapter>
        </RootProvider>
      </body>
    </html>
  );
}
