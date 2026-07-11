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

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
        active ? "bg-rose-50 text-rose-900 font-medium" : "text-stone-600 hover:bg-stone-100 hover:text-rose-900"
      }`}
    >
      {label}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const inAdmin = pathname.startsWith("/admin");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!inAdmin) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [inAdmin]);

  return (
    <>
      <nav className="flex-1 space-y-1 px-2">
        {PUBLIC_LINKS.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={pathname === link.href}
            onClick={onNavigate}
          />
        ))}

        <div className="my-3 border-t border-stone-200" />

        {inAdmin ? (
          <>
            <p className="px-3 pb-1 text-xs uppercase tracking-wide text-stone-400">Admin</p>
            {ADMIN_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
                onClick={onNavigate}
              />
            ))}
          </>
        ) : (
          <NavLink href="/admin/posts" label="Admin" active={false} onClick={onNavigate} />
        )}
      </nav>

      {inAdmin && (
        <div className="border-t border-stone-200 px-3 py-4 space-y-2">
          {email && <p className="truncate text-xs text-stone-400">{email}</p>}
          <LogoutButton />
        </div>
      )}
    </>
  );
}

function MobileMenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="flex h-9 w-9 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
    >
      {open ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-56 md:flex-col md:border-r md:border-stone-200 md:bg-white">
        <Link href="/" className="block px-3 py-4 font-semibold tracking-tight text-rose-900">
          Inner Awareness
        </Link>
        <NavLinks />
      </aside>

      <header className="border-b border-stone-200 bg-white md:hidden">
        <nav className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight text-rose-900">
            Inner Awareness
          </Link>
          <MobileMenuButton open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
        </nav>
        {mobileOpen && (
          <div className="flex flex-col border-t border-stone-200 pb-2 pt-2">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </header>
    </>
  );
}
