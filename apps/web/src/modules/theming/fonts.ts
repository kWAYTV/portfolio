import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
});

// Only the 700 cut is drawn (titles and the rail tip): one font file, not two.
const display = Barlow_Condensed({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display-face",
  weight: "700",
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${display.variable}`;
