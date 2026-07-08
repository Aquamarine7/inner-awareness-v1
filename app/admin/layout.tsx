import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Owner Admin</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin/posts" className="text-stone-600 hover:text-rose-900">
            Posts
          </Link>
          <Link href="/admin/submissions" className="text-stone-600 hover:text-rose-900">
            Submissions
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
