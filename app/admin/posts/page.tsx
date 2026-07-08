import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import DeletePostButton from "./DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load posts: ${error.message}`);
  }

  const posts = (data ?? []) as Post[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">Posts</h2>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-rose-900 text-white px-4 py-2 text-sm font-medium hover:bg-rose-800"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-stone-300 p-10 text-center text-stone-500">
          No posts — create your first one.
        </div>
      ) : (
        <table className="mt-6 w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-200">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Views</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-stone-100">
                <td className="py-3 pr-4 font-medium text-stone-900">{post.title}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${
                      post.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-stone-600">{post.view_count}</td>
                <td className="py-3 pr-4 text-right space-x-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-rose-900 hover:underline">
                    Edit
                  </Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
