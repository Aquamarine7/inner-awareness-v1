import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import Sidebar from "./Sidebar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inner Awareness",
  description: "Self-awareness resources for career women navigating lost direction, exhaustion, and disconnection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body className="antialiased min-h-screen text-ink">
        <Sidebar />
        <div className="flex min-h-screen flex-col md:pl-60">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-ink/10 py-8 text-center text-xs text-ink/40">
            Inner Awareness — a space to pause, notice, and look inward.
          </footer>
        </div>
      </body>
    </html>
  );
}
