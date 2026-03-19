import type { Metadata } from "next";
import ChatWidget from "./components/ChatWidget";

import "./globals.css";

const siteUrl = "https://midilli.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Midilli AI",
    template: "%s | Midilli AI",
  },
  description:
    "Midilli AI helps creators generate visuals and motion concepts with a polished, fast AI studio experience.",
  keywords: [
    "Midilli AI",
    "AI image generator",
    "AI video generator",
    "Supabase auth",
    "creative studio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Midilli AI",
    description:
      "Generate visuals, explore concepts, and manage your creative workflow in Midilli AI.",
    url: siteUrl,
    siteName: "Midilli AI",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Midilli AI",
    description:
      "Generate visuals, explore concepts, and manage your creative workflow in Midilli AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
