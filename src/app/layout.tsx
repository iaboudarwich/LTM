import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";

import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { FlagStripe } from "@/components/layout/FlagStripe";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SITE_URL } from "@/data/site-meta";

import "./globals.css";

// Public Sans is the U.S. government's public-service typeface. It is clear,
// neutral, and highly readable on mobile — the right tone for an official
// traffic authority. One sans family is used for the whole site (body and
// headings) so the design stays consistent and never reads like a magazine.
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Liberia Traffic Management. Official Traffic Services in Liberia",
    template: "%s | Liberia Traffic Management",
  },
  description:
    "Liberia Traffic Management (LTM) is the official government concessionaire for vehicle registration, driver licensing, vehicle inspection, and license plates in Liberia.",
  keywords: [
    "Liberia Traffic Management",
    "LTM",
    "Liberia driver license",
    "Liberia vehicle registration",
    "Liberia vehicle inspection",
    "license plates Liberia",
  ],
  authors: [{ name: "Liberia Traffic Management" }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Liberia Traffic Management",
    description:
      "Official traffic management services for the Republic of Liberia: vehicle registration, driver licensing, inspection, and license plates.",
    url: SITE_URL,
    siteName: "Liberia Traffic Management",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Liberia Traffic Management service facility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liberia Traffic Management",
    description:
      "Official traffic management services for the Republic of Liberia.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  // Listing icons here replaces the auto-generated link for src/app/icon.svg,
  // so the SVG favicon is declared explicitly alongside the apple-touch-icon.
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LTM",
  },
};

// Theme color lives in the viewport export (the Next 14 home for it) so the
// browser chrome on mobile matches the site's matte-black header.
export const viewport: Viewport = {
  themeColor: "#0E0E10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ltm-black focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <BreadcrumbJsonLd />
        <FlagStripe />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <ScrollToTop />
      </body>
    </html>
  );
}
