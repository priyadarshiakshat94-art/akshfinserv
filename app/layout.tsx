import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@/components/site/analytics";
import "./globals.css";

// Self-hosted so builds never depend on fetching from Google Fonts.
const inter = localFont({
  variable: "--font-inter",
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});

// Fallback display face while General Sans (Fontshare) loads, or if it fails.
const interTight = localFont({
  variable: "--font-inter-tight",
  src: "../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://akshfinserv.com"),
  title: {
    default: "Aksh Finserv | Mutual funds in Powai, Mumbai, since 2002",
    template: "%s | Aksh Finserv",
  },
  description:
    "AMFI-registered mutual fund distributor in Powai, Mumbai. ₹250 Cr invested through us by 1,500 families since 2002.",
};

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${interTight.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,600&display=swap"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
