import type { Metadata } from "next";
import Link from "next/link";
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
      <body className="antialiased min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <header className="border-b border-stone-200 bg-white">
          <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight text-rose-900">
              Inner Awareness
            </Link>
            <div className="flex gap-6 text-sm text-stone-600">
              <Link href="/pain-points" className="hover:text-rose-900">Pain Points</Link>
              <Link href="/posts" className="hover:text-rose-900">Posts</Link>
              <Link href="/submit" className="hover:text-rose-900">Submit</Link>
              <Link href="/admin/posts" className="hover:text-rose-900">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
          Inner Awareness — a space for career women to name what they feel.
        </footer>
      </body>
    </html>
  );
}
