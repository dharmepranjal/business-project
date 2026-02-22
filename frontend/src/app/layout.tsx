import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadLens | SaaS Lead Intelligence",
  description: "Find and rank high-probability B2B leads using multi-parameter analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">L</div>
                <span className="font-bold text-xl tracking-tight">LeadLens</span>
              </div>
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                <a href="/" className="hover:text-white transition-colors">Find Leads</a>
                <a href="/about" className="hover:text-white transition-colors">How It Works</a>
              </nav>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10"></div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
