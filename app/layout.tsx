import type { Metadata } from "next";
import Sidebar from "./Sidebar";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased min-h-screen bg-stone-50 text-stone-900">
        <Sidebar />
        <div className="flex min-h-screen flex-col md:pl-56">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
            Inner Awareness — a space for career women to name what they feel.
          </footer>
        </div>
      </body>
    </html>
  );
}
