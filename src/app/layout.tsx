import type { Metadata } from "next";
import "./globals.css";
import { MainSiteWrapper } from "@/components/MainSiteWrapper";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "eSailor.in | B2B Jute Bag Manufacturer & Global Exporter",
  description:
    "Direct manufacturer and global exporter of eco-friendly jute bags, tote bags, shopping bags, and industrial burlap sacks. Registered with RCMC, IEC, GST, and Udyam for international B2B trade.",
  keywords: [
    "jute bags manufacturer",
    "b2b jute bags exporter",
    "custom jute shopping bags",
    "organic jute totes wholesale",
    "hessian burlap sacks India",
    "eco-friendly packaging supplier",
  ],
  openGraph: {
    title: "eSailor.in | Premium B2B Jute Bags Exporter",
    description:
      "Direct manufacturer and exporter of certified eco-friendly jute bags for international retail and promotional brands.",
    url: "https://esailor.in",
    siteName: "eSailor.in",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/images/esailor-logo.png",
    shortcut: "/images/esailor-logo.png",
    apple: "/images/esailor-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full scroll-smooth antialiased font-sans">
      <head>
        {/* Google Fonts for DM Serif Display and Manrope */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0,1&family=Manrope:wght@400;600&display=swap"
          rel="stylesheet"
        />

        <JsonLd />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <MainSiteWrapper>{children}</MainSiteWrapper>
      </body>
    </html>
  );
}