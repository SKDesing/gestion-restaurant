import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GESTION RESTAURANT - Gestion de restaurant",
  description:
    "GESTION RESTAURANT — Point of sale and restaurant management built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: [
    "GESTION RESTAURANT",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "restaurant",
    "POS",
  ],
  authors: [{ name: "GESTION RESTAURANT Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GESTION RESTAURANT",
    description: "Restaurant management and POS system",
    url: "/",
    siteName: "GESTION RESTAURANT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GESTION RESTAURANT",
    description: "Restaurant management and POS system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
