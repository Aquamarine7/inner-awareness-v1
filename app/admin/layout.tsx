import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Owner Admin</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin/posts" className="text-stone-600 hover:text-rose-900">
            Posts
          </Link>
          <Link href="/admin/submissions" className="text-stone-600 hover:text-rose-900">
            Submissions
          </Link>
          <Link href="/admin/subscribers" className="text-stone-600 hover:text-rose-900">
            Subscribers
          </Link>
          <span className="text-stone-400">{user.email}</span>
          <LogoutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
