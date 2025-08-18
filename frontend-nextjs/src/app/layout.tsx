import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceGen Pro - Professional Invoice Generator",
  description: "Create professional invoices instantly. Perfect for freelancers and small businesses.",
  keywords: "invoice generator, freelancer invoices, professional invoicing, invoice maker, billing software",
  authors: [{ name: "InvoiceGen Pro" }],
  openGraph: {
    title: "InvoiceGen Pro - Professional Invoice Generator",
    description: "Create professional invoices instantly. Perfect for freelancers and small businesses.",
    url: "https://invoicegen-pro.netlify.app/",
    siteName: "InvoiceGen Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceGen Pro - Professional Invoice Generator",
    description: "Create professional invoices instantly. Perfect for freelancers and small businesses.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
