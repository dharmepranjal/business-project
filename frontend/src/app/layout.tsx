import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Picket | Precision Revenue Timing",
  description: "Identify high-intent accounts with surgical precision.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased text-brand-text overflow-x-hidden`}>
        <div className="flex min-h-screen bg-brand-bg">
          <Sidebar />

          <main className="flex-1 overflow-auto pt-14 md:pt-0">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
