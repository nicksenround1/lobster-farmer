import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "养虾户 | Lobster Farmer — AI Agent Builder",
  description:
    "养一池 AI 虾兵蟹将，替你 7×24 冲浪。OpenClaw power user, AI agent builder, Web3 speculator.",
  keywords: [
    "AI Agent",
    "OpenClaw",
    "养虾户",
    "Lobster Farmer",
    "Web3",
    "Crypto",
    "AI Automation",
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "养虾户 | Lobster Farmer",
    description: "养一池 AI 虾兵蟹将，替你 7×24 冲浪",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ckn_acee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
