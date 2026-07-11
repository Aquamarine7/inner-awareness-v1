"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "./admin/LogoutButton";

const PUBLIC_LINKS = [
  { href: "/pain-points", label: "Pain Points" },
  { href: "/posts", label: "Posts" },
  { href: "/submit", label: "Submit" },
];

const ADMIN_LINKS = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
        active ? "bg-rose-50 text-rose-900 font-medium" : "text-stone-600 hover:bg-stone-100 hover:text-rose-900"
      }`}
    >
      {label}
    </Link>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const inAdmin = pathname.startsWith("/admin");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!inAdmin) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [inAdmin]);

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="block px-3 py-4 font-semibold tracking-tight text-rose-900">
        Inner Awareness
      </Link>

      <nav className="flex-1 space-y-1 px-2">
        {PUBLIC_LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
        ))}

        <div className="my-3 border-t border-stone-200" />

        {inAdmin ? (
          <>
            <p className="px-3 pb-1 text-xs uppercase tracking-wide text-stone-400">Admin</p>
            {ADMIN_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
            ))}
          </>
        ) : (
          <NavLink href="/admin/posts" label="Admin" active={false} />
        )}
      </nav>

      {inAdmin && (
        <div className="border-t border-stone-200 px-3 py-4 space-y-2">
          {email && <p className="truncate text-xs text-stone-400">{email}</p>}
          <LogoutButton />
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-56 md:flex-col md:border-r md:border-stone-200 md:bg-white">
        <SidebarContent />
      </aside>

      <header className="border-b border-stone-200 bg-white md:hidden">
        <nav className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight text-rose-900">
            Inner Awareness
          </Link>
          <div className="flex gap-4 text-sm text-stone-600">
            <Link href="/pain-points" className="hover:text-rose-900">Pain Points</Link>
            <Link href="/posts" className="hover:text-rose-900">Posts</Link>
            <Link href="/submit" className="hover:text-rose-900">Submit</Link>
            <Link href="/admin/posts" className="hover:text-rose-900">Admin</Link>
          </div>
        </nav>
      </header>
    </>
  );
}
